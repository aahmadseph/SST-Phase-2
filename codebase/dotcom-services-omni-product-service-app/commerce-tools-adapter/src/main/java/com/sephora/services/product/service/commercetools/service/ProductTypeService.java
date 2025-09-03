package com.sephora.services.product.service.commercetools.service;

import com.commercetools.api.models.product_type.ProductType;
import org.springframework.cache.annotation.Cacheable;

import static com.sephora.services.product.service.commercetools.config.CachingConfig.CACHE2K_CACHE_MANAGER;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.PRODUCT_TYPE_CACHE_NAME;

public interface ProductTypeService {

    void loadProductTypes();

    @Cacheable(cacheManager = CACHE2K_CACHE_MANAGER, cacheNames = PRODUCT_TYPE_CACHE_NAME, key = "#id")
    default ProductType getProductTypeById(String id) {
        return null;
    }
}
