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

package com.sephora.services.inventory.cosmosdb.changeFeed.cache;

import static com.sephora.services.inventoryavailability.cosmos.config.cache.CacheConfig.GET_SHIP_NODE_BY_ENTERPRISE_CODE;
import static com.sephora.services.inventoryavailability.cosmos.config.cache.CacheConfig.SHIP_NODE_CACHE_NAME;

import java.util.Collections;
import java.util.List;

import com.sephora.services.inventory.model.doc.ShipNode;
import org.springframework.stereotype.Component;

import com.sephora.platform.database.cosmosdb.changefeed.cache.EntityCacheInformation;

/**
 * @author Vitaliy Oleksiyenko
 */
@Component
public class ShipNodeCacheInformation extends EntityCacheInformation<ShipNode> {

    private static final List<String> ADDITIONAL_CACHE_NAMES =
            Collections.singletonList(GET_SHIP_NODE_BY_ENTERPRISE_CODE);

    public ShipNodeCacheInformation() {
        super(ShipNode.class);
        addKeyGenerator(GET_SHIP_NODE_BY_ENTERPRISE_CODE,
                (shipNode) -> shipNode.getEnterpriseCode().toValue());
    }

    @Override
    public String getEntityCacheName() {
        return SHIP_NODE_CACHE_NAME;
    }

    @Override
    public List<String> getAdditionalCacheNames() {
        return ADDITIONAL_CACHE_NAMES;
    }

    @Override
    protected String generateKey(ShipNode entity) {
        return "id:" + entity.getId();
    }
}
