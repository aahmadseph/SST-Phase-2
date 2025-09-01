/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2019 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.sourcingoptions.config.cache;

import com.sephora.platform.cache.CacheConfig;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@ConditionalOnProperty(prefix = "sourcing.options.cache", value = "type",
        havingValue = "jcache", matchIfMissing = true)
@Configuration("sourcingOptionsCacheConfig")
@EnableCaching
public class SourcingOptionsCacheConfig extends CacheConfig {

    public static final String SOURCING_CACHE_MANAGER = "cache2kCacheManager";

    public static final String GET_NODES_PRIORITY_CACHE_NAME = "getNodesPriority";
    public static final String FIND_SHIP_NODE_CACHE_NAME = "findShipNode";
    public static final String GET_BY_ID_SHIP_NODE_CACHE_NAME = "getByIdShipNode";
    public static final String SOURCING_RULE_CACHE_NAME = "sourcingRule";
    public static final String SHIP_NODE_CACHE_NAME = "shipNode";
    public static final String LOCATION_PRIORITY_CACHE_NAME = "locationPriority";
    public static final String CARRIER_SERVICE_CACHE_NAME = "carrierService";
    public static final String DYNAMIC_CONFIG_CACHE_NAME = "dynamicConfig";
    
    @Override
    @Bean(SOURCING_CACHE_MANAGER)
    @Primary
    @ConditionalOnMissingBean
    public JCacheCacheManager cacheManager() {
        return super.cacheManager();
    }

    @Override
    public String getCacheManagerQualifier() {
        return SOURCING_CACHE_MANAGER;
    }


}
