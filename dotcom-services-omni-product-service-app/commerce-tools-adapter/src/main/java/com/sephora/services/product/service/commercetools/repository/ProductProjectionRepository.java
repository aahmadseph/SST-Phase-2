package com.sephora.services.product.service.commercetools.repository;

import com.commercetools.api.models.ResourcePagedQueryResponse;
import com.commercetools.api.models.graph_ql.GraphQLRequest;
import com.commercetools.api.models.product.ProductProjection;
import com.commercetools.api.models.product.ProductProjectionPagedQueryResponse;
import com.commercetools.api.models.product.ProductProjectionPagedQueryResponseImpl;
import com.sephora.services.product.service.commercetools.dto.SearchFilterInput;
import com.sephora.services.product.service.commercetools.utils.BatchUtils;
import com.sephora.services.product.service.commercetools.utils.ProductUtils;
import io.micrometer.core.annotation.Timed;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.function.Function;

import static com.sephora.services.product.service.commercetools.config.CommerceToolsConfig.COMMERCE_TOOLS_EXECUTOR;
import static com.sephora.services.product.service.commercetools.repository.ProductProjectionRestRepository.FILTER_BY_PRIMARY_PRODUCT_ID;
import static com.sephora.services.product.service.commercetools.repository.ProductProjectionRestRepository.FILTER_BY_SKU_ID_NAME;
import static com.sephora.services.product.service.commercetools.repository.ProductProjectionRestRepository.IDS_DELIMITER;
import static com.sephora.services.product.service.commercetools.repository.ProductProjectionRestRepository.QUOTES_STRING;
import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.PRIMARY_PRODUCT;
import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.SKU_ID;
import static org.apache.commons.lang3.StringUtils.wrap;

@Service
@Slf4j
public class ProductProjectionRepository {

    public static final Function<String, String> WRAP_WITH_SQUARE_BRACKET = (key) -> "[" +
            key + "]";

    public static final Function<List<String>, String> TO_ARRAY =
            (list) -> WRAP_WITH_SQUARE_BRACKET.apply(
                    StringUtils.join(list, ", "));

    public static final char DOUBLE_QUOTES = '"';

    public static final String GET_PRODUCT_PROJECTIONS_QUERY_WITH_ALL_VARIANT_TEMPLATE_BY_CRITERIA =
            """
                    query ProductProjectionSearch($limit: Int, $offset: Int!, $queryFilters: [SearchFilterInput!]!, $projectExpandedProducts: Boolean, $sorts: [String!]) {
                      productProjectionSearch(
                        limit: $limit
                        offset: $offset
                        queryFilters: $queryFilters
                        projectExpandedProducts: $projectExpandedProducts
                        markMatchingVariants: true
                        sorts: $sorts
                      ) {
                        offset
                        count
                        total
                        results {
                          key
                          variants: allVariants(onlyMatching: true) {
                            attributes: attributesRaw(includeNames: %s) {
                              name
                              value
                            }
                          }
                        }
                      }
                    }""";

    public static final String GET_PRODUCT_PROJECTIONS_QUERY_BY_SKU_ID =
            String.format(GET_PRODUCT_PROJECTIONS_QUERY_WITH_ALL_VARIANT_TEMPLATE_BY_CRITERIA,
                    WRAP_WITH_SQUARE_BRACKET.apply(wrap(SKU_ID, DOUBLE_QUOTES)));

    public static final String GET_PRODUCT_PROJECTIONS_QUERY_BY_PRIMARY_PRODUCT_ID =
            String.format(GET_PRODUCT_PROJECTIONS_QUERY_WITH_ALL_VARIANT_TEMPLATE_BY_CRITERIA,
                    WRAP_WITH_SQUARE_BRACKET.apply(wrap(PRIMARY_PRODUCT, DOUBLE_QUOTES)));


    public static final String QUERY_FILTERS = "queryFilters";
    public static final String OFFSET = "offset";
    public static final String STAGED = "staged";
    public static final String SORTS = "sorts";
    public static final String LIMIT = "limit";

    public static final ProductProjectionPagedQueryResponseImpl PRODUCT_PROJECTION_EMPTY_PAGED_QUERY_RESPONSE
            = new ProductProjectionPagedQueryResponseImpl();

    public static final int MAX_LIMIT = 500;
    // https://docs.commercetools.com/api/projects/product-projection-search#sorting
    public static final List<String> SORTS_BY_CREATED_AT_DESC = List.of("createdAt desc");

    static {
        PRODUCT_PROJECTION_EMPTY_PAGED_QUERY_RESPONSE.setResults(Collections.emptyList());
    }

    private final CommerceToolsQueryExecutor queryExecutor;

    private final ExecutorService commerceToolsExecutor;

    public ProductProjectionRepository(CommerceToolsQueryExecutor queryExecutor,
                                       @Qualifier(COMMERCE_TOOLS_EXECUTOR) ExecutorService commerceToolsExecutor) {
        this.queryExecutor = queryExecutor;
        this.commerceToolsExecutor = commerceToolsExecutor;
    }

    @Timed(value = "product.projection.getProductProjectionsKeysByPrimaryProductId",
            description = "Time taken to get product projections from CT by primary product id")
    public Set<String> getProductProjectionsKeysByPrimaryProductId(final String primaryProductId) {
        var projections = BatchUtils.loadAllWithBatch(MAX_LIMIT,
                (offset, limit) -> getProductVariantsByPrimaryProductId(primaryProductId, offset, limit),
                false, commerceToolsExecutor);

        if (!CollectionUtils.isEmpty(projections)) {
            Set<String> result = new HashSet<>();
            projections.forEach(projection -> {
                var allVariants = ProductUtils.getAllVariants(projection);
                if (!CollectionUtils.isEmpty(allVariants)) {
                    allVariants.forEach(productVariant -> {
                        var primaryProduct = ProductUtils.getStringAttribute(productVariant, PRIMARY_PRODUCT);
                        if (primaryProduct != null && Objects.equals(primaryProduct, primaryProductId)) {
                            result.add(projection.getKey());
                        }
                    });
                }

            });
            return result;
        }
        return Set.of();
    }

    @Timed(value = "product.projection.getProductProjectionsBySkuId",
            description = "Time taken to get product projections from CT  by SKU id-s")
    public Map<String, Set<String>> getProductProjectionsKeysBySkuId(final Collection<String> skuIds) {
        var projections = BatchUtils.loadAllWithBatch(MAX_LIMIT,
                (offset, limit) -> getProductVariantsBySkuId(skuIds, offset, limit),
                false, commerceToolsExecutor);
        Map<String, Set<String>> result = new HashMap<>();
        if (!CollectionUtils.isEmpty(projections)) {
            projections.forEach(projection -> {
                var allVariants = ProductUtils.getAllVariants(projection);
                if (!CollectionUtils.isEmpty(allVariants)) {
                    allVariants.forEach(productVariant -> {
                        var skuId = ProductUtils.getStringAttribute(productVariant, SKU_ID);
                        if (skuId != null && skuIds.contains(skuId)) {
                            var set = result.computeIfAbsent(skuId, k -> new HashSet<>());
                            set.add(projection.getKey());
                        }
                    });
                }
            });
        }
        skuIds.forEach(id -> {
            if (!result.containsKey(id)) {
                result.put(id, new HashSet<>());
            }
        });
        return result;
    }


    private ResourcePagedQueryResponse<ProductProjection> getProductVariantsBySkuId(final Collection<String> skuIds,
                                                                                    final long offset, final long limit) {
        return queryProductVariants(GET_PRODUCT_PROJECTIONS_QUERY_BY_SKU_ID,
                toFilterList(FILTER_BY_SKU_ID_NAME + wrap(String.join(IDS_DELIMITER, skuIds), QUOTES_STRING)),
                offset, limit);
    }

    private ResourcePagedQueryResponse<ProductProjection> getProductVariantsByPrimaryProductId(final String primaryProductId,
                                                                                               final long offset, final long limit) {
        return queryProductVariants(GET_PRODUCT_PROJECTIONS_QUERY_BY_PRIMARY_PRODUCT_ID,
                toFilterList(FILTER_BY_PRIMARY_PRODUCT_ID + wrap(primaryProductId, QUOTES_STRING)),
                offset, limit);
    }

    private List<SearchFilterInput> toFilterList(final String filter) {
        if (StringUtils.isNotBlank(filter)) {
            SearchFilterInput searchFilterInput = SearchFilterInput.of(filter);
            return List.of(searchFilterInput);
        }
        return Collections.emptyList();
    }

    private ResourcePagedQueryResponse<ProductProjection> queryProductVariants(final String query, List<SearchFilterInput> queryFilter,
                                                                               final long offset, final long limit) {
        GraphQLRequest request = GraphQLRequest.builder()
                .query(query)
                .variables(builder -> {
                    builder.addValue(LIMIT, limit);
                    builder.addValue(OFFSET, offset);
                    builder.addValue(QUERY_FILTERS, queryFilter);
                    builder.addValue(STAGED, false);
                    builder.addValue(SORTS, SORTS_BY_CREATED_AT_DESC);
                    return builder;
                })
                .build();
        var start = System.currentTimeMillis();
        try {
            return queryExecutor.executeTypedRequest(request, ProductProjectionPagedQueryResponse.class);
        } finally {
            log.debug("Time taken to get product variants by criteria (via GraphQL): {} ms.  Offset={} Limit={}",
                    System.currentTimeMillis() - start, offset, limit);
        }
    }

}
