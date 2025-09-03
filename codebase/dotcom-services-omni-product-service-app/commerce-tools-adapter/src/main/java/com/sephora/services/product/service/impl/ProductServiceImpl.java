package com.sephora.services.product.service.impl;

import com.commercetools.api.models.product.ProductProjection;
import com.commercetools.api.models.product_type.ProductTypeReference;
import com.sephora.services.product.model.Product;
import com.sephora.services.product.service.ProductService;
import com.sephora.services.product.service.commercetools.model.ProductDto;
import com.sephora.services.product.service.commercetools.service.ProductProjectionService;
import com.sephora.services.product.service.commercetools.utils.ProductTypeUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sephora.services.product.service.commercetools.utils.ProductTypeUtils.ProductTypeEnum.NON_SELLABLE;

@Component
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductProjectionService productProjectionService;
    private final ProductTypeUtils productTypeUtils;

    @Override
    public Set<Product> getProductsByIds(Collection<String> productIds, Locale locale) {
        var productProjections = productProjectionService.getProductProjectionsByKeySet(productIds);

        if (CollectionUtils.isNotEmpty(productProjections)) {
            return productProjections.stream()
                    .filter(Objects::nonNull)
                    .map(productProjection -> createProduct(productProjection, locale))
                    .collect(Collectors.toSet());
        }
        return Collections.emptySet();
    }

    @Override
    public Product getProductById(String productId, Locale locale) {
        var productProjection = productProjectionService.getProductProjectionByKey(productId);
        if (productProjection != null) {
            return createProduct(productProjection, locale);
        }
        return null;
    }

    public Product createProduct(ProductProjection productProjection, Locale locale) {
        var productType =
                Optional.ofNullable(productProjection.getProductType())
                        .map(ProductTypeReference::getId)
                        .map(productTypeUtils::getProductType)
                        .orElse(null);
        return new ProductDto(productProjection, locale, NON_SELLABLE.equals(productType));
    }
}
