///*
// *  This software is the confidential and proprietary information of
// * sephora.com and may not be used, reproduced, modified, distributed,
// * publicly displayed or otherwise disclosed without the express written
// *  consent of sephora.com.
// *
// * This software is a work of authorship by sephora.com and protected by
// * the copyright laws of the United States and foreign jurisdictions.
// *
// *  Copyright  2019 sephora.com, Inc. All rights reserved.
// *
// */
//
//package com.sephora.services.inventory.config.cache.redis;
//
//import static com.sephora.services.inventoryavailability.cosmos.config.cache.CacheConfig.CACHE_MANAGER;
//
//import com.sephora.platform.cache.configuration.redis.CustomRedisCacheProperties;
//import com.sephora.platform.cache.configuration.redis.RedisCacheConfig;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
//import org.springframework.boot.context.properties.EnableConfigurationProperties;
//import org.springframework.cache.annotation.EnableCaching;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Import;
//import org.springframework.context.annotation.Primary;
//import org.springframework.data.redis.cache.RedisCacheManager;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//
//
///**
// * @author Vitaliy Oleksiyenko
// */
//@ConditionalOnProperty(prefix = "spring.cache", value = "type",
//        havingValue = "redis")
//@Import(RedisAutoConfiguration.class)
//@Configuration
//@EnableCaching
//@EnableConfigurationProperties(CacheProperties.class)
//public class RedisCacheConfiguration extends RedisCacheConfig {
//
//    public RedisCacheConfiguration(CustomRedisCacheProperties cacheProperties) {
//        super(cacheProperties);
//    }
//
//    @Bean(CACHE_MANAGER)
//    @Primary
//    @Override
//    public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
//        return super.cacheManager(redisConnectionFactory);
//    }
//}
