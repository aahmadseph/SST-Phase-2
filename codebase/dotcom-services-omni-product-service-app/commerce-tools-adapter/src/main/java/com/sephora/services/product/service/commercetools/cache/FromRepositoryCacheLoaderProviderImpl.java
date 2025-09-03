package com.sephora.services.product.service.commercetools.cache;

import com.commercetools.api.models.product.ProductProjection;
import com.sephora.services.product.service.commercetools.repository.ProductProjectionRepository;
import com.sephora.services.product.service.commercetools.repository.ProductProjectionRestRepository;
import com.sephora.services.product.service.commercetools.repository.ProductTypeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.cache2k.io.BulkCacheLoader;
import org.cache2k.io.CacheLoader;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.sephora.services.product.service.commercetools.config.CachingConfig.PRIMARY_PRODUCT_PRODUCT_PROJECTION_KEYS_CACHE_NAME;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.PRODUCT_PROJECTION_CACHE_NAME;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.PRODUCT_TYPE_CACHE_NAME;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.SKU_PRODUCT_PROJECTION_KEYS_CACHE_NAME;

@Component(FromRepositoryCacheLoaderProviderImpl.BEAN_NAME)
@RequiredArgsConstructor
public class FromRepositoryCacheLoaderProviderImpl implements CacheLoaderProvider {

    public static final String BEAN_NAME = "fromRepositoryCacheLoaderProvider";

    public static final Set<String> CACHE_NAMES = Set.of(
            PRODUCT_TYPE_CACHE_NAME,
            PRODUCT_PROJECTION_CACHE_NAME,
            SKU_PRODUCT_PROJECTION_KEYS_CACHE_NAME,
            PRIMARY_PRODUCT_PRODUCT_PROJECTION_KEYS_CACHE_NAME
    );

    private final ProductTypeRepository productTypeRepository;
    private final ProductProjectionRestRepository productProjectionRestRepository;
    private final ProductProjectionRepository productProjectionRepository;

    private final Map<String, CacheLoader<Object, Object>> cacheLoaderMap = new java.util.HashMap<>();
    private final Map<String, BulkCacheLoader<Object, Object>> bulkCacheLoaderMap = new java.util.HashMap<>();

    @PostConstruct
    public void postConstruct() {
        CACHE_NAMES.forEach(cacheName -> {
            CacheLoader<Object, Object> loader = initLoader(cacheName);
            if (loader != null) {
                cacheLoaderMap.put(cacheName, loader);
            }
            BulkCacheLoader<Object, Object> bulkLoader = initBulkLoader(cacheName);
            if (bulkLoader != null) {
                bulkCacheLoaderMap.put(cacheName, bulkLoader);
            }
        });
    }

    @Override
    public CacheLoader<Object, Object> getLoader(String cacheName) {
        return cacheLoaderMap.get(cacheName);
    }

    @Override
    public BulkCacheLoader<Object, Object> getBulkLoader(String cacheName) {
        return bulkCacheLoaderMap.get(cacheName);
    }

    public CacheLoader<Object, Object> initLoader(String cacheName) {
        if (PRODUCT_TYPE_CACHE_NAME.equals(cacheName)) {
            return (key) -> productTypeRepository.getProductTypeById((String) key);
        } else if (SKU_PRODUCT_PROJECTION_KEYS_CACHE_NAME.equals(cacheName)) {
            return (keyObject) -> {
                String key = (String) keyObject;
                var result = productProjectionRepository.getProductProjectionsKeysBySkuId(Set.of(key));
                if (MapUtils.isNotEmpty(result)) {
                    return result.get(key);
                }
                return Collections.emptySet();
            };
        } else if (PRIMARY_PRODUCT_PRODUCT_PROJECTION_KEYS_CACHE_NAME.equals(cacheName)) {
            return (key) -> productProjectionRepository.getProductProjectionsKeysByPrimaryProductId((String) key);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public BulkCacheLoader<Object, Object> initBulkLoader(String cacheName) {
        if (PRODUCT_TYPE_CACHE_NAME.equals(cacheName)) {
            return (keys) -> cast(productTypeRepository.getProductTypeByIds((Set<String>) keys));
        } else if (PRODUCT_PROJECTION_CACHE_NAME.equals(cacheName)) {
            return (keys) -> {
                var result = productProjectionRestRepository.getProductVariantsByProductKeys((Set<String>) keys);
                if (CollectionUtils.isNotEmpty(result)) {
                    return result.stream()
                            .collect(java.util.stream.Collectors.toMap(
                                    ProductProjection::getKey,
                                    Function.identity()));
                }
                var hashMap = new HashMap<>();
                keys.forEach(key -> hashMap.put(key, null));
                return hashMap;
            };
        }
        if (SKU_PRODUCT_PROJECTION_KEYS_CACHE_NAME.equals(cacheName)) {
            return (keysObject) -> {
                Set<String> keys = (Set<String>) keysObject;
                Map<String, Set<String>> result = productProjectionRepository.getProductProjectionsKeysBySkuId(keys);
                return cast(result);
            };
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public <K, V> Map<Object, Object> cast(Map<K, V> map) {
        return (Map<Object, Object>) map;
    }
}
