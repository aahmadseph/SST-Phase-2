package com.sephora.services.product.service.commercetools.config;

import com.sephora.services.product.service.commercetools.cache.CacheLoaderProvider;
import com.sephora.services.product.service.commercetools.cache.CacheLoaderProviderDelegate;
import com.sephora.services.product.service.commercetools.config.properties.BaseCacheProperties;
import com.sephora.services.product.service.commercetools.config.properties.CacheProperties;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.BooleanUtils;
import org.cache2k.Cache;
import org.cache2k.Cache2kBuilder;
import org.cache2k.CacheEntry;
import org.cache2k.addon.UniversalResiliencePolicy;
import org.cache2k.event.CacheEntryCreatedListener;
import org.cache2k.event.CacheEntryEvictedListener;
import org.cache2k.event.CacheEntryExpiredListener;
import org.cache2k.event.CacheEntryRemovedListener;
import org.cache2k.event.CacheEntryUpdatedListener;
import org.cache2k.extra.spring.SpringCache2kCacheManager;
import org.cache2k.io.BulkCacheLoader;
import org.cache2k.io.CacheLoader;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.Duration;
import java.util.function.Function;

import static java.util.Objects.nonNull;

@Configuration
@EnableCaching
@EnableConfigurationProperties(CacheProperties.class)
public class CachingConfig {

    public static final String PRODUCT_TYPE_CACHE_NAME = "productType";
    public static final String PRODUCT_PROJECTION_CACHE_NAME = "productProjection";
    public static final String SKU_PRODUCT_PROJECTION_KEYS_CACHE_NAME = "skuProductProjectionKeys";
    public static final String PRIMARY_PRODUCT_PRODUCT_PROJECTION_KEYS_CACHE_NAME = "primaryProductProductProjectionKeys";
    public static final String CACHE2K_CACHE_MANAGER = "cache2kCacheManager";

    private final CacheLoaderProvider cacheLoaderProvider;

    public CachingConfig(@Qualifier(CacheLoaderProviderDelegate.BEAN_NAME)
                         CacheLoaderProvider cacheLoaderProvider) {
        this.cacheLoaderProvider = cacheLoaderProvider;
    }

    @Bean(CACHE2K_CACHE_MANAGER)
    @Primary
    public CacheManager cacheManager(CacheProperties cacheProperties) {
        var manager = new SpringCache2kCacheManager()
                .defaultSetup(setupCache(cacheProperties));
        setupCaches(cacheProperties, manager);
        return manager;
    }

    @SuppressWarnings("unchecked")
    private void setupCaches(CacheProperties cacheProperties, SpringCache2kCacheManager cacheManager) {
        cacheProperties.getCaches().forEach((key, properties) -> cacheManager.addCache(
                defaultBuilder -> {
                    var builder = initializeBuilder(defaultBuilder.name(key), properties);
                    CacheLoader<Object, Object> loader = cacheLoaderProvider.getLoader(key);
                    if (loader != null) {
                        ((Cache2kBuilder<Object, Object>) builder).loader(loader);
                    }
                    BulkCacheLoader<Object, Object> bulkLoader = cacheLoaderProvider.getBulkLoader(key);
                    if (bulkLoader != null) {
                        ((Cache2kBuilder<Object, Object>) builder).bulkLoader(bulkLoader);
                    }
                    return builder;
                }
        ));
    }

    private Function<Cache2kBuilder<?, ?>, Cache2kBuilder<?, ?>> setupCache(BaseCacheProperties cacheProperties) {
        return builder ->
                initializeBuilder(builder, cacheProperties);
    }

    private Cache2kBuilder<?, ?> initializeBuilder(Cache2kBuilder<?, ?> builder, BaseCacheProperties properties) {
        if (properties == null) {
            return builder;
        }
        if (BooleanUtils.isTrue(properties.getEnabled())) {
            if (nonNull(properties.getExpireAfterWrite())) {
                builder.expireAfterWrite(properties.getExpireAfterWrite());
            }
        } else{
            builder.expireAfterWrite(Duration.ZERO);
        }

        if (nonNull(properties.getEntryCapacity())) {
            builder.entryCapacity(properties.getEntryCapacity());
        }
        if (nonNull(properties.getBoostConcurrency())) {
            builder.boostConcurrency(properties.getBoostConcurrency());
        }
        if (nonNull(properties.getKeyType())) {
            builder.keyType(properties.getKeyType());
        }
        if (nonNull(properties.getValueType())) {
            builder.valueType(properties.getValueType());
        }
        if (nonNull(properties.getKeepDataAfterExpired())) {
            builder.keepDataAfterExpired(properties.getKeepDataAfterExpired());
        }

        if (BooleanUtils.isTrue(properties.getEnableUniversalResiliencePolicy())) {
            // https://cache2k.org/docs/latest/user-guide.html#using-universalresiliencepolicy
            builder.setup(UniversalResiliencePolicy::enable);
        }

        if (BooleanUtils.isTrue(properties.getEnableLogging())) {
            builder.addListener(new CacheLoggingListener<>());
        }

        if (BooleanUtils.isTrue(properties.getPermitNullValues())) {
            builder.permitNullValues(true);
        }

        return builder;
    }

    @Slf4j
    public static class CacheLoggingListener<K, V>
            implements CacheEntryCreatedListener<K, V>, CacheEntryEvictedListener<K, V>,
            CacheEntryExpiredListener<K, V>, CacheEntryRemovedListener<K, V>,
            CacheEntryUpdatedListener<K, V> {

        @Override
        public void onEntryCreated(@NotNull Cache<K, V> cache, CacheEntry<K, V> entry) {
            log.debug("Cache {}. Entry created: {}", cache.getName(), entry.getKey());
        }

        @Override
        public void onEntryEvicted(@NotNull Cache<K, V> cache, CacheEntry<K, V> entry) {
            log.debug("Cache {}. Entry evicted: {}", cache.getName(), entry.getKey());
        }

        @Override
        public void onEntryExpired(@NotNull Cache<K, V> cache, CacheEntry<K, V> entry) {
            log.debug("Cache {}. Entry expired: {}", cache.getName(), entry.getKey());
        }

        @Override
        public void onEntryRemoved(@NotNull Cache<K, V> cache, CacheEntry<K, V> entry) {
            log.debug("Cache {}. Entry removed: {}", cache.getName(), entry.getKey());
        }

        @Override
        public void onEntryUpdated(@NotNull Cache<K, V> cache, @NotNull CacheEntry<K, V> currentEntry,
                                   CacheEntry<K, V> newEntry) {
            log.debug("Cache {}. Entry updated: {}", cache.getName(), newEntry.getKey());
        }
    }

}
