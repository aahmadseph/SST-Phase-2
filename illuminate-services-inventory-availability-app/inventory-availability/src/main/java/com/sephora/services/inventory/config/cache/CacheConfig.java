///*
// * This software is the confidential and proprietary information of
// * sephora.com and may not be used, reproduced, modified, distributed,
// * publicly displayed or otherwise disclosed without the express written
// * consent of sephora.com.
// *
// * This software is a work of authorship by sephora.com and protected by
// * the copyright laws of the United States and foreign jurisdictions.
// *
// * Copyright 2019 sephora.com, Inc. All rights reserved.
// */
//
//package com.sephora.services.inventory.config.cache;
//
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.cache.annotation.EnableCaching;
//import org.springframework.cache.jcache.JCacheCacheManager;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//
///**
// * @author Alexey Zalivko 5/2/2019
// */
////@ConditionalOnProperty(prefix = "spring.cache", value = "type",
////        havingValue = "jcache", matchIfMissing = true)
////@Configuration("inventoryCacheConfig")
////@EnableCaching
//public class CacheConfig extends com.sephora.platform.cache.CacheConfig {
//
//    public static final String SHIP_NODE_CACHE_NAME = "ShipNode";
//    public static final String GET_SHIP_NODE_BY_ENTERPRISE_CODE = "getShipNodeByEnterpriseCode";
//
//    public static final String CACHE_MANAGER = "inventoryCacheManager";
//
//  @Override
//  @Bean(CACHE_MANAGER)
//  @Primary public JCacheCacheManager cacheManager() {
//	return super.cacheManager();
//  }
//    @Override
//    public String getCacheManagerQualifier() {
//        return CACHE_MANAGER;
//    }
//}
//
