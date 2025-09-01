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

package com.sephora.services.inventory.repository.cosmos;

import com.sephora.services.inventory.model.doc.Inventory;

/**
 * @author Vitaliy Oleksiyenko
 */
public interface CustomCosmosInventoryRepository extends CustomCosmosInventoryQueryRepository<Inventory>, CustomCosmosInventoryTriggerRepository<Inventory> {
}
