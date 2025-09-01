package com.sephora.services.product.service.commercetools.service.impl;

import com.commercetools.api.models.product.ProductProjection;
import com.sephora.services.product.service.commercetools.service.ProductProjectionService;
import org.apache.commons.collections4.MapUtils;
import org.cache2k.Cache;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sephora.services.product.service.commercetools.config.CachingConfig.CACHE2K_CACHE_MANAGER;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.PRODUCT_PROJECTION_CACHE_NAME;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.SKU_PRODUCT_PROJECTION_KEYS_CACHE_NAME;

@Service
public class ProductProjectionServiceImpl implements ProductProjectionService {

    private final CacheManager cacheManager;

    public ProductProjectionServiceImpl(@Qualifier(CACHE2K_CACHE_MANAGER) CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Override
    public Collection<ProductProjection> getProductProjectionsByKeySet(Collection<String> keys) {
        return getProductProjectionMap(keys).values();
    }

    @Override
    public Map<String, ProductProjection> getProductProjectionMap(Collection<String> keys) {
        Cache<String, ProductProjection> cache = getNativeCache(PRODUCT_PROJECTION_CACHE_NAME);
        if (cache != null) {
            return cache.getAll(keys);
        }
        return Collections.emptyMap();
    }

    @SuppressWarnings("unchecked")
    private <K, V> Cache<K, V> getNativeCache(String cacheName) {
        var cache = cacheManager.getCache(cacheName);
        if (cache != null && cache.getNativeCache() instanceof org.cache2k.Cache) {
            return (org.cache2k.Cache<K, V>) cache.getNativeCache();
        }
        return null;
    }

    @Override
    public Collection<ProductProjection> getProductProjectionsByPrimaryProduct(String productId) {
        return Collections.emptySet();
    }

    @Override
    public Map<String, Set<String>> getProductProjectionKeysBySkuId(Collection<String> skuIds) {
        Cache<String, Set<String>> cache = getNativeCache(SKU_PRODUCT_PROJECTION_KEYS_CACHE_NAME);
        if (cache != null) {
            return cache.getAll(skuIds);
        }
        return Map.of();
    }

    @Override
    public Map<String, List<ProductProjection>> getProductProjectionsBySkuId(Collection<String> skuIds) {
        Cache<String, List<String>> cache = getNativeCache(SKU_PRODUCT_PROJECTION_KEYS_CACHE_NAME);
        if (cache != null) {
            var products = cache.getAll(skuIds);
            if (!MapUtils.isEmpty(products)) {
                var result = new HashMap<String, List<ProductProjection>>();
                var allProducts = products.values().stream()
                        .flatMap(List::stream)
                        .collect(Collectors.toSet());
                var productProjectionMap = getProductProjectionMap(allProducts);
                products.forEach((key, value) ->
                        result.put(key, value.stream()
                                .map(productProjectionMap::get)
                                .collect(Collectors.toList())));
                return result;
            }
        }
        return Collections.emptyMap();
    }

}
