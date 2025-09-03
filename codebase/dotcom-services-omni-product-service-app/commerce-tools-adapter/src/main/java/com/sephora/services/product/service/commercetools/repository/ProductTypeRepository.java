package com.sephora.services.product.service.commercetools.repository;

import com.commercetools.api.models.graph_ql.GraphQLRequest;
import com.commercetools.api.models.product_type.ProductType;
import com.commercetools.api.models.product_type.ProductTypePagedQueryResponse;
import com.sephora.services.product.service.commercetools.repository.exception.RepositoryException;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.micrometer.core.annotation.Timed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@Slf4j
@RequiredArgsConstructor
public class ProductTypeRepository {

    public static final String PRODUCT_TYPES_QUERY =
            """
                    query ProductTypes {
                      productTypes {
                        results {
                          id
                          key
                          name
                        }
                      }
                    }""";

    public static final String PRODUCT_TYPE_BY_ID_QUERY = """
            query productType($id: String!){
                productType(id: $id)  {
                  name
                }
            }
            """;
    public static final String ID = "id";

    private final CommerceToolsQueryExecutor queryExecutor;

    @Timed(value = "product-type.repository.getProductTypes",
            description = "Time taken to fetch Product types via GraphQL")
    public List<ProductType> getProductTypes() {
        GraphQLRequest request = GraphQLRequest.builder()
                .query(PRODUCT_TYPES_QUERY)
                .build();
        var start = System.currentTimeMillis();
        try {
            var response = queryExecutor.executeTypedRequest(request, ProductTypePagedQueryResponse.class);

            if (response == null || CollectionUtils.isEmpty(response.getResults())) {
                log.warn("No results found for Product types.");
                return Collections.emptyList();
            }

            return response.getResults();
        } catch (RepositoryException | CallNotPermittedException e) {
            log.error("Exception occurred fetching Product types", e);
        } finally {
            log.debug("Time taken to fetch Product types (via GraphQL): {} ms.",
                    System.currentTimeMillis() - start);
        }
        return Collections.emptyList();
    }

    @Timed(value = "product-type.repository.getProductTypeById",
            description = "Time taken to fetch Product type by ID via GraphQL")
    public ProductType getProductTypeById(String productTypeId) {
        GraphQLRequest request = GraphQLRequest.builder()
                .query(PRODUCT_TYPE_BY_ID_QUERY)
                .variables(builder -> builder.addValue(ID, productTypeId))
                .build();
        var start = System.currentTimeMillis();
        try {
            var productType = queryExecutor.executeTypedRequest(request, ProductType.class);
            if (productType == null) {
                log.warn("No results found for Product type with ID: {}", productTypeId);
                return null;
            }
            return productType;
        } catch (RepositoryException | CallNotPermittedException e) {
            log.error("Exception occurred fetching Product type by ID: {}", productTypeId, e);
        } finally {
            log.debug("Time taken to fetch Product type by ID (via GraphQL): {} ms.",
                    System.currentTimeMillis() - start);
        }
        return null;
    }

    public Map<String, ProductType> getProductTypeByIds(Collection<String> productTypeIds) {
        if (CollectionUtils.isEmpty(productTypeIds)) {
            return Collections.emptyMap();
        }
        Map<String, ProductType> productTypeMap = new HashMap<>();
        for (String id : productTypeIds) {
            ProductType productType = getProductTypeById(id);
            if (productType != null) {
                productTypeMap.put(id, productType);
            }
        }
        return productTypeMap;
    }

}
