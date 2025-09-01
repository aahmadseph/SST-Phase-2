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

package com.sephora.services.inventory.repository.cosmos.impl;


import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
import com.sephora.platform.database.cosmosdb.repository.support.QuerySupportedCosmosRepository;
import com.sephora.services.inventory.model.doc.Inventory;
import com.sephora.services.inventory.repository.cosmos.CustomCosmosInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;

import static com.sephora.services.inventoryavailability.cosmos.config.CosmosConfiguration.INVENTORY_UPDATE_PRE_TRIGGER;

/**
 * @author Vitaliy Oleksiyenko
 */
public class CustomCosmosInventoryRepositoryImpl extends QuerySupportedCosmosRepository<Inventory, String>
        implements CustomCosmosInventoryRepository {

    private static final List<String> PRE_TRIGGERS = Collections.singletonList(INVENTORY_UPDATE_PRE_TRIGGER);

    public CustomCosmosInventoryRepositoryImpl(@Autowired CustomCosmosTemplate cosmosTemplate) {
        super(cosmosTemplate, Inventory.class);
    }

    @Override
    public Inventory upsertWithTrigger(Inventory entity) {
        return super.upsert(entity, PRE_TRIGGERS);
    }
}
