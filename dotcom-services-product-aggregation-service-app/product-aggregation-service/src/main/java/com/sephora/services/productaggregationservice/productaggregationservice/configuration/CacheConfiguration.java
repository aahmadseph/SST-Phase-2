package com.sephora.services.productaggregationservice.productaggregationservice.configuration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.cache.interceptor.SimpleCacheErrorHandler;
@Slf4j
public class CacheConfiguration { //extends CachingConfigurerSupport {

    // If get cache is not successful then fetch from source and print soft error
    private static class RelaxedCacheErrorHandler extends SimpleCacheErrorHandler {
        @Override
        public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
            log.error("Error getting for cache name {} ", cache.getName(),exception);
        }
    }

    //@Override
    public CacheErrorHandler errorHandler() {
        return new RelaxedCacheErrorHandler();
    }

    // More config...
}