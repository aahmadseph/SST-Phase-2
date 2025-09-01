package com.sephora.services.product.service.commercetools.repository;

import com.commercetools.api.client.ProjectApiRoot;
import com.commercetools.api.models.ResourcePagedQueryResponse;
import com.commercetools.api.models.product.ProductProjection;
import com.sephora.services.product.service.commercetools.config.properties.CommerceToolsConfigurationProperties;
import com.sephora.services.product.service.commercetools.repository.exception.RepositoryException;
import com.sephora.services.product.service.commercetools.repository.exception.RetriableRepositoryException;
import com.sephora.services.product.service.commercetools.utils.BatchUtils;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.decorators.Decorators;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryRegistry;
import io.micrometer.core.annotation.Timed;
import io.vrap.rmf.base.client.ApiHttpResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.PRIMARY_PRODUCT;
import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.SKU_ID;


@Service
@Slf4j
@RequiredArgsConstructor
public class ProductProjectionRestRepository {

    public static final String QUOTES_STRING = "\"";
    public static final java.lang.String IDS_DELIMITER = "\",\"";
    private static final Integer REST_REPOSITORY_MAX_LIMIT = 100;

    // Used for expand  "full_size_product"  "original_sample_product";
    protected static final String MASTER_VARIANT_ATTR_MASTER_DATA_CURRENT_MASTER_VARIANT_ATTR_EXPAND = "masterVariant.attributes[*].value.masterData.current.masterVariant.attributes[*].value";
    protected static final String MASTER_VARIANT_ATTR_MASTER_DATA_CURRENT_VARIANTS_REF_ATTR_EXPAND = "masterVariant.attributes[*].value.masterData.current.variants[*].attributes[*].value";

    protected static final String MASTER_VARIANT_ATTR_EXPAND = "masterVariant.attributes[*].value";
    protected static final String MASTER_VARIANT_SET_ATTR_EXPAND = "masterVariant.attributes[*].value[*]";

    protected static final String VARIANTS_ATTR_EXPAND = "variants[*].attributes[*].value";
    protected static final String VARIANTS_SET_ATTR_EXPAND = "variants[*].attributes[*].value[*]";
    // Expand categories object
    protected static final String CATEGORY_ATTRIBUTES_EXPAND = "categories[*]";

    public static final String FILTER_BY_SKU_ID_NAME = "variants.attributes." + SKU_ID + ":";
    public static final String FILTER_BY_PRIMARY_PRODUCT_ID = "variants.attributes." + PRIMARY_PRODUCT + ":";

    private static final List<String> BASIC_EXPAND_LIST = List.of(
            MASTER_VARIANT_ATTR_MASTER_DATA_CURRENT_MASTER_VARIANT_ATTR_EXPAND,
            MASTER_VARIANT_ATTR_EXPAND,
            MASTER_VARIANT_SET_ATTR_EXPAND,
            CATEGORY_ATTRIBUTES_EXPAND,
            VARIANTS_ATTR_EXPAND,
            VARIANTS_SET_ATTR_EXPAND
    );
    public static final String COMMERCE_TOOLS_CIRCUIT_BREAKER = "commerceToolsCircuitBreaker";
    public static final String COMMERCE_TOOLS_QUERY_EXECUTOR_RETRY = "commerce-tools-query-executor";

    private static List<String> createBasicExpandListVariantsAttrVariantsRef() {
        List<String> list = new ArrayList<>(BASIC_EXPAND_LIST);
        list.add(MASTER_VARIANT_ATTR_MASTER_DATA_CURRENT_VARIANTS_REF_ATTR_EXPAND);
        return Collections.unmodifiableList(list);
    }

    private static final List<String> BASIC_EXPAND_LIST_VARIANTS_ATTR_VARIANTS_REF =
            createBasicExpandListVariantsAttrVariantsRef();

    private static final String FILTER_BY_KEY_NAME = "key:";

    private final CommerceToolsConfigurationProperties commerceToolsConfigurationProperties;
    private final ProjectApiRoot projectApiRoot;
    private final ExecutorService commerceToolsExecutor;
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    private final RetryRegistry retryRegistry;

    @Timed(value = "product-projection.rest.repository.getProductProjectionByKey",
            description = "Time taken to fetch Product projection by keys")
    public List<ProductProjection> getProductVariantsByProductKeys(final Iterable<String> productKeys) {
        return getProductProjections(
                FILTER_BY_KEY_NAME + StringUtils.wrap(String.join(IDS_DELIMITER, productKeys), QUOTES_STRING),
                BASIC_EXPAND_LIST_VARIANTS_ATTR_VARIANTS_REF,
                false
        );
    }

    @Timed(value = "product-projection.rest.repository.getProductVariantsBySkuIds",
            description = "Time taken to fetch Product projections by sku id-s")
    public List<ProductProjection> getProductVariantsBySkuIds(final List<String> skuIds) {
        return getProductProjections(
                FILTER_BY_SKU_ID_NAME + StringUtils.wrap(String.join(IDS_DELIMITER, skuIds), QUOTES_STRING),
                BASIC_EXPAND_LIST,
                true
        );
    }

    @Timed(value = "product-projection.rest.repository.getProductVariantsByPrimaryProduct",
            description = "Time taken to fetch Product projections by primary product id")
    public List<ProductProjection> getProductVariantsByPrimaryProduct(final String productId) {
        return getProductProjections(
                FILTER_BY_PRIMARY_PRODUCT_ID + StringUtils.wrap(productId, QUOTES_STRING),
                BASIC_EXPAND_LIST,
                true
        );
    }

    private List<ProductProjection> getProductProjections(String filter, Collection<String> expand,
                                                          boolean markMatchingVariant) {
        return BatchUtils.loadAllWithBatch(REST_REPOSITORY_MAX_LIMIT,
                (offset, limit) -> getProductProjections(filter, expand, limit, markMatchingVariant, offset),
                false, commerceToolsExecutor);

    }

    private ResourcePagedQueryResponse<ProductProjection> getProductProjections(String filter,
                                                                                final Collection<String> expand,
                                                                                final long limit,
                                                                                final boolean markMatchingVariant,
                                                                                final long offset) {
        return Decorators.ofSupplier(
                        () -> execute(() -> projectApiRoot
                                .productProjections().search().get()
                                .withMarkMatchingVariants(markMatchingVariant)
                                .withFilter(filter)
                                .withStaged(Boolean.FALSE)
                                .withLimit(limit)
                                .withOffset(offset)
                                .addExpand(expand)
                                .execute()
                                .thenApply(ApiHttpResponse::getBody)
                                .get(commerceToolsConfigurationProperties.getWaitTimeout().toMillis(), TimeUnit.MILLISECONDS))
                ).withCircuitBreaker(getCircuitBreaker())
                .withRetry(getRetry())
                .decorate()
                .get();
    }

    private <T> T execute(CTExecute<T> execute) {
        try {
            return execute.execute();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted while fetching Product projections", e);
            throw new RepositoryException(e);
        } catch (ExecutionException | TimeoutException e) {
            log.error("Exception occurred while fetching Product projections", e);
            //TODO configure retry on CommerceToolsConfiguration for apiRoot
            throw new RetriableRepositoryException("Error executing request", e);
        }
    }

    private interface CTExecute<T> {
        T execute() throws InterruptedException, ExecutionException, TimeoutException;
    }

    private CircuitBreaker getCircuitBreaker() {
        return circuitBreakerRegistry.circuitBreaker(COMMERCE_TOOLS_CIRCUIT_BREAKER);
    }

    private Retry getRetry() {
        return retryRegistry.retry(COMMERCE_TOOLS_QUERY_EXECUTOR_RETRY);
    }

}
