package com.sephora.services.product.service.commercetools.config;

import com.sephora.services.product.service.commercetools.config.properties.ExtendedRedisCacheProperties;
import com.sephora.services.product.service.commercetools.config.properties.RedisCacheProperties;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.cache.CacheManagerCustomizer;
import org.springframework.boot.autoconfigure.cache.CacheManagerCustomizers;
import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.util.LinkedHashSet;
import java.util.Set;

import static java.util.Objects.nonNull;

@ConditionalOnProperty(name = "sephora.cache.redis.enabled")
@Configuration
@EnableConfigurationProperties(RedisCacheProperties.class)
public class RedisCacheConfig {

    public static final String REDIS_CACHE_MANAGER = "redisCacheManager";

    @Bean
    public CacheManagerCustomizers cacheManagerCustomizers(ObjectProvider<CacheManagerCustomizer<?>> customizers) {
        return new CacheManagerCustomizers(customizers.orderedStream().toList());
    }

    @Bean(name = REDIS_CACHE_MANAGER)
    public RedisCacheManager redisCacheManager(RedisCacheProperties redisCacheProperties,
                                               CacheManagerCustomizers cacheManagerCustomizers,
                                               ObjectProvider<RedisCacheConfiguration> redisCacheConfiguration,
                                               ObjectProvider<RedisCacheManagerBuilderCustomizer> redisCacheManagerBuilderCustomizers,
                                               RedisConnectionFactory redisConnectionFactory,
                                               RedisSerializerProvider serializerProvider) {
        RedisCacheManager.RedisCacheManagerBuilder builder = RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(
                        determineConfiguration(redisCacheProperties, redisCacheConfiguration, serializerProvider));
        Set<String> cacheNames = redisCacheProperties.getCaches().keySet();
        if (!cacheNames.isEmpty()) {
            builder.initialCacheNames(new LinkedHashSet<>(cacheNames));
        }
        if (redisCacheProperties.isEnableStatistics()) {
            builder.enableStatistics();
        }
        redisCacheManagerBuilderCustomizers.orderedStream().forEach(
                (customizer) -> customizer.customize(builder));
        return cacheManagerCustomizers.customize(builder.build());
    }

    private RedisCacheConfiguration determineConfiguration(
            RedisCacheProperties cacheProperties,
            ObjectProvider<RedisCacheConfiguration> redisCacheConfiguration,
            RedisSerializerProvider serializerProvider) {
        return redisCacheConfiguration.getIfAvailable(() -> configure(cacheProperties, serializerProvider));
    }

    @Bean
    public RedisCacheConfiguration cacheConfiguration(RedisCacheProperties redisCacheProperties,
                                                      RedisSerializerProvider serializerProvider) {
        return configure(redisCacheProperties, serializerProvider);
    }

    private RedisCacheConfiguration configure(ExtendedRedisCacheProperties redisCacheProperties,
                                              RedisSerializerProvider serializerProvider) {
        var cacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(serializerProvider.getSerializer(redisCacheProperties)));
        if (nonNull(redisCacheProperties.getTimeToLive())) {
            cacheConfig = cacheConfig.entryTtl(redisCacheProperties.getTimeToLive());
        }
        if (nonNull(redisCacheProperties.getKeyPrefix())) {
            cacheConfig = cacheConfig.prefixCacheNameWith(redisCacheProperties.getKeyPrefix());
        }
        if (!BooleanUtils.isTrue(redisCacheProperties.isCacheNullValues())) {
            cacheConfig = cacheConfig.disableCachingNullValues();
        }
        if (!redisCacheProperties.isUseKeyPrefix()) {
            cacheConfig = cacheConfig.disableKeyPrefix();
        }
        return cacheConfig;
    }

    private RedisCacheConfiguration configure(RedisCacheManager.RedisCacheManagerBuilder builder,
                                              ExtendedRedisCacheProperties redisCacheProperties,
                                              ExtendedRedisCacheProperties defaultRedisCacheProperties,
                                              RedisSerializerProvider serializerProvider) {
        var cacheConfig = builder.cacheDefaults();
        if (redisCacheProperties.getEnableKryo() != null) {
            cacheConfig = cacheConfig.serializeValuesWith(RedisSerializationContext.SerializationPair
                    .fromSerializer(serializerProvider.getSerializer(redisCacheProperties)));
        }
        if (nonNull(redisCacheProperties.getTimeToLive())) {
            cacheConfig = cacheConfig.entryTtl(redisCacheProperties.getTimeToLive());
        }
        if (nonNull(redisCacheProperties.getKeyPrefix())) {
            cacheConfig = cacheConfig.prefixCacheNameWith(redisCacheProperties.getKeyPrefix());
        }
        if (!BooleanUtils.isTrue(redisCacheProperties.isCacheNullValues())) {
            cacheConfig = cacheConfig.disableCachingNullValues();
        }
        if (!redisCacheProperties.isUseKeyPrefix()) {
            cacheConfig = cacheConfig.disableKeyPrefix();
        }
        return cacheConfig;
    }

    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer(RedisCacheProperties redisCacheProperties,
                                                                                 RedisSerializerProvider serializerProvider) {
        return (builder) ->
                redisCacheProperties.getCaches().forEach((key, properties) ->
                        builder.withCacheConfiguration(key, configure(builder, properties, redisCacheProperties, serializerProvider)));
    }

}
