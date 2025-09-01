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

import static com.sephora.services.inventoryavailability.cosmos.config.CosmosConfiguration.SHIP_NODE_COLLECTION;

import com.sephora.platform.database.cosmosdb.BaseCosmosConfiguration;
import com.sephora.platform.database.cosmosdb.changefeed.BaseCosmosChangeFeedEventListener;
import com.sephora.services.inventory.model.doc.ShipNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;


import com.sephora.services.inventory.cosmosdb.changeFeed.service.EntityCacheService;
import lombok.extern.log4j.Log4j2;

/**
 * @author Vitaliy Oleksiyenko
 */
@ConditionalOnBean(name = "cosmosConfiguration")
@ConditionalOnProperty(prefix = "spring.cache", value = "type",
        havingValue = "jcache", matchIfMissing = true)
@Component
@Log4j2
@DependsOn({"cosmosConfiguration", "entityCacheService"})
public class CosmosChangeFeedEventListener extends BaseCosmosChangeFeedEventListener {

    public CosmosChangeFeedEventListener(@Autowired BaseCosmosConfiguration cosmosConfiguration,
                                         @Autowired EntityCacheService cacheService) {
        //TODO incompatible types, should be fixed
        super(cosmosConfiguration, cacheService);
    }

    @Override
    public Class getEntityClass(String containerName) {
        if (SHIP_NODE_COLLECTION.equals(containerName)) {
            return ShipNode.class;
        }
        return null;
    }

}
