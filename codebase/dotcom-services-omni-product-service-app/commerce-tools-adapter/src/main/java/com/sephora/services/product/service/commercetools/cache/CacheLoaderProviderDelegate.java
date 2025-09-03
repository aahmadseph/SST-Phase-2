package com.sephora.services.product.service.commercetools.cache;

import org.cache2k.io.BulkCacheLoader;
import org.cache2k.io.CacheLoader;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sephora.services.product.service.commercetools.config.RedisCacheConfig.REDIS_CACHE_MANAGER;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Component(CacheLoaderProviderDelegate.BEAN_NAME)
public class CacheLoaderProviderDelegate implements CacheLoaderProvider {

    public static final String BEAN_NAME = "cacheLoaderProviderDelegate";

    private final CacheLoaderProvider cacheLoaderProvider;
    private final RedisCacheManager redisCacheManager;

    public CacheLoaderProviderDelegate(
            @Qualifier(FromRepositoryCacheLoaderProviderImpl.BEAN_NAME)
            CacheLoaderProvider cacheLoaderProvider,
            @Qualifier(REDIS_CACHE_MANAGER)
            ObjectProvider<RedisCacheManager> redisCacheManager) {
        this.cacheLoaderProvider = cacheLoaderProvider;
        this.redisCacheManager = redisCacheManager.getIfAvailable();
    }

    public CacheLoader<Object, Object> getLoader(String cacheName) {
        if (isNull(redisCacheManager)) {
            return cacheLoaderProvider.getLoader(cacheName);
        }
        return (key) -> {
            var cache = redisCacheManager.getCache(cacheName);
            if (nonNull(cache)) {
                var value = cache.get(key, Object.class);
                if (isNull(value)) {
                    value = cacheLoaderProvider.getLoader(cacheName).load(key);
                    if (nonNull(value)) {
                        cache.put(key, value);
                        return value;
                    }
                }
                return value;
            } else {
                return cacheLoaderProvider.getLoader(cacheName).load(key);
            }
        };
    }

    public BulkCacheLoader<Object, Object> getBulkLoader(String cacheName) {
        if (redisCacheManager == null) {
            return cacheLoaderProvider.getBulkLoader(cacheName);
        }
        return (keys) -> {
            var cache = redisCacheManager.getCache(cacheName);
            if (nonNull(cache)) {
                Map<Object, Object> fromRedis = bulkLoadFromCache(cache, keys);
                if (fromRedis.size() == keys.size()) {
                    return fromRedis;
                }
                // Load missing keys from the cache loader
                var missingKeys = keys.stream()
                        .filter(key -> !fromRedis.containsKey(key))
                        .collect(Collectors.toSet());
                var bulkLoader = cacheLoaderProvider.getBulkLoader(cacheName);
                var loadedValues = bulkLoader.loadAll(missingKeys);
                // Update the cache with the newly loaded values
                loadedValues.forEach((key, value) -> {
                    cache.put(key, value);
                    fromRedis.put(key, value);
                });
                return fromRedis;
            }
            return cacheLoaderProvider.getBulkLoader(cacheName).loadAll(keys);
        };
    }

    /**
     * Bulk load from Redis cache if available, otherwise return an empty map.
     * TODO On spring redis cache not implemented working with bulk loading.
     *
     * @param cache the cache
     * @param keys  the set of keys to load
     * @return a map of keys and their corresponding values from the cache
     */
    private Map<Object, Object> bulkLoadFromCache(Cache cache, Set<?> keys) {
        Map<Object, Object> fromRedis = new HashMap<>();
        for (Object key : keys) {
            var value = cache.get(key, Object.class);
            if (value != null) {
                fromRedis.put(key, value);
            }
        }
        return fromRedis;
    }
}
