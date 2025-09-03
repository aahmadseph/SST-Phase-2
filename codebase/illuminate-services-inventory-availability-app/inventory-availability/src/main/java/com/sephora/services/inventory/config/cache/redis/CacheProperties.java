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

package com.sephora.services.inventory.config.cache.redis;

import org.springframework.boot.context.properties.ConfigurationProperties;

import com.sephora.platform.cache.configuration.redis.CustomRedisCacheProperties;


/**
 * @author Vitaliy Oleksiyenko
 */
@ConfigurationProperties(prefix = "spring.cache")
public class CacheProperties extends CustomRedisCacheProperties {
}
