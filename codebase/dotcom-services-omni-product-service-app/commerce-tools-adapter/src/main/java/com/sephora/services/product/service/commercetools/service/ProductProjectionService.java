package com.sephora.services.product.service.commercetools.service;

import com.commercetools.api.models.product.ProductProjection;
import org.springframework.cache.annotation.Cacheable;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.sephora.services.product.service.commercetools.config.CachingConfig.CACHE2K_CACHE_MANAGER;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.PRIMARY_PRODUCT_PRODUCT_PROJECTION_KEYS_CACHE_NAME;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.PRODUCT_PROJECTION_CACHE_NAME;

public interface ProductProjectionService {

    @Cacheable(cacheManager = CACHE2K_CACHE_MANAGER, cacheNames = PRODUCT_PROJECTION_CACHE_NAME, key = "#key")
    default ProductProjection getProductProjectionByKey(String key) {
        return null;
    }

    Collection<ProductProjection> getProductProjectionsByKeySet(Collection<String> keys);

    Map<String, ProductProjection> getProductProjectionMap(Collection<String> keys);

    Collection<ProductProjection> getProductProjectionsByPrimaryProduct(String productId);

    Map<String, Set<String>> getProductProjectionKeysBySkuId(Collection<String> skuIds);

    @Cacheable(cacheManager = CACHE2K_CACHE_MANAGER, cacheNames = PRIMARY_PRODUCT_PRODUCT_PROJECTION_KEYS_CACHE_NAME, key = "#primaryProductId")
    default Set<String> getProductProjectionKeysPrimaryProductId(String primaryProductId){
        return null;
    }

    Map<String, List<ProductProjection>> getProductProjectionsBySkuId(Collection<String> skuIds);

}
