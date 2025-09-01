/*
 * package com.sephora.services.common.config;
 * 
 * import org.springframework.beans.factory.annotation.Qualifier; import
 * org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
 * import
 * org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
 * import org.springframework.cache.CacheManager; import
 * org.springframework.cache.annotation.CachingConfigurerSupport; import
 * org.springframework.cache.support.NoOpCacheManager; import
 * org.springframework.context.annotation.Bean; import
 * org.springframework.context.annotation.Configuration; import
 * org.springframework.data.redis.connection.RedisConnectionFactory; import
 * org.springframework.data.redis.core.RedisTemplate; import
 * org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
 * import org.springframework.data.redis.serializer.StringRedisSerializer;
 * 
 * @Configuration
 * 
 * @ConditionalOnMissingBean(RedisTemplate.class) public class
 * CommonCacheConfiguration extends CachingConfigurerSupport {
 * 
 * @Bean public RedisTemplate<String, Object>
 * redisTemplate(@Qualifier("redisConnectionFactory") RedisConnectionFactory
 * redisConnectionFactory) { RedisTemplate<String, Object> template = new
 * RedisTemplate<>(); template.setConnectionFactory(redisConnectionFactory);
 * template.setKeySerializer(new StringRedisSerializer());
 * template.setValueSerializer(new GenericJackson2JsonRedisSerializer()); return
 * template; }
 * 
 * @Bean(name = "redissonCacheManager")
 * 
 * @ConditionalOnProperty(prefix = "sephora.cache.redisson", value = {"type"},
 * havingValue = "none", matchIfMissing = false) public CacheManager
 * getNoOpCacheManagerForRedison() { return new NoOpCacheManager(); } }
 */