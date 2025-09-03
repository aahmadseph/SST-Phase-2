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

import java.util.List;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.stereotype.Repository;

import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import com.sephora.services.inventory.model.doc.Inventory;

/**
 * @author Vitaliy Oleksiyenko
 */
@Repository
public interface CosmosInventoryRepository extends CosmosRepository<Inventory, String>, CustomCosmosInventoryRepository {

    List<Inventory> findAll();

    List<Inventory> findByItemId(String itemId);

    List<Inventory> findByItemIdAndShipNodeAndInfinite(String itemId, String shipNode, boolean infinite);

    List<Inventory> findByEnterpriseCodeAndItemIdIn(EnterpriseCodeEnum enterpriseCode,
                                                    List<String> itemIds);

    List<Inventory> findByEnterpriseCodeAndItemIdInAndShipNodeIn(EnterpriseCodeEnum enterpriseCode,
                                                                 List<String> itemIds,
                                                                 List<String> shipNodes);

    List<Inventory> findByItemIdAndEnterpriseCodeAndInfinite(String itemId, EnterpriseCodeEnum enterpriseCode, boolean infinite);

    void deleteByItemIdAndEnterpriseCodeAndInfinite(String itemId,
                                                    EnterpriseCodeEnum enterpriseCode,
                                                    boolean infinite);
}
