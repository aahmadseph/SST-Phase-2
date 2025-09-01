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

package com.sephora.services.inventory.cosmosdb.changeFeed;

import static com.sephora.services.inventory.repository.cosmos.InventoryCosmosShipNodeRepository.COSMOS_SHIP_NODE_REPOSITORY;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import com.sephora.platform.cache.BaseCosmosEventProcessor;
import com.sephora.platform.cache.CacheEvictionConfig;
import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;

/**
 * @author Vitaliy Oleksiyenko
 */
@ConditionalOnProperty(prefix = "azure.cosmosdb", name = "uri")
@Component
@DependsOn(COSMOS_SHIP_NODE_REPOSITORY)
@EnableConfigurationProperties(ChangeFeedConfiguration.class)
@RefreshScope
public class CosmosEventProcessor extends BaseCosmosEventProcessor {

    public CosmosEventProcessor(@Autowired CacheEvictionConfig cacheEvictionConfig,
                                @Autowired CustomCosmosTemplate cosmosTemplates,
                                @Autowired ChangeFeedConfiguration changeFeedConfiguration) {
        super(cacheEvictionConfig, cosmosTemplates, changeFeedConfiguration);
    }
}
