/*
 * This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 * consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 * Copyright 2019 sephora.com, Inc. All rights reserved.
 */

package com.sephora.services.inventory.controller.impl;


import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.inventory.controller.InventoryController;
import com.sephora.services.inventory.exception.NotFoundException;
import com.sephora.services.inventory.model.dto.*;
import com.sephora.services.inventory.service.InventoryService;
import com.sephora.services.inventory.service.InventoryServiceException;
import com.sephora.services.inventory.service.UpdateInventoryServiceWrapper;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.ResponseEntity.ok;

@ConditionalOnProperty(prefix = "azure.cosmosdb", name = "uri")
@RestController
@RequestMapping("/v1")
@ControllerDocumentation
@Validated
public class InventoryControllerImpl implements InventoryController {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private UpdateInventoryServiceWrapper updateInventoryService;

    @GetMapping
    public ResponseEntity<Object> findAll() {
        return new ResponseEntity<>(inventoryService.findAll(), HttpStatus.OK);
    }

    @Override
    @GetMapping("/availability/items/{itemId}")
    public ResponseEntity<Object> getAvailability(String itemId) throws InventoryServiceException {

        logger.info("Looking for inventory item id #{}", itemId);

        GetInventoryItemDetailsDto inventoryItem = inventoryService.findByItemId(itemId);

        if (inventoryItem == null) {
            logger.error("Unable to find inventory item id #{}", itemId);
            throw new NotFoundException(INVENTORY_NOT_FOUND_ERROR, itemId);
        }

        return new ResponseEntity<>(inventoryItem, HttpStatus.OK);
    }

    @Override
    @GetMapping("/availability/items/{itemId}/nodes/{nodeName}")
    public ResponseEntity<Object> getAvailabilityByShipNode(String itemId, String nodeName) throws InventoryServiceException {
        logger.info("Looking for inventory item id #{} and shipNode {}", itemId, nodeName);

        GetInventoryItemDetailsDto inventoryItem = inventoryService.findByItemIdAndNode(itemId, nodeName);

        if (inventoryItem == null) {
            logger.error("Unable to find inventory item id #{} and shipNode {}", itemId, nodeName);
            throw new NotFoundException(INVENTORY_BY_SHIP_NODE_NOT_FOUND_ERROR, itemId, nodeName);
        }

        return new ResponseEntity<>(inventoryItem, HttpStatus.OK);
    }

    @Override
    @PutMapping("items")
    public ResponseEntity<Object> updateInventory(@RequestBody UpdateInventoryDto updateInventoryDto) throws InventoryServiceException {
        updateInventoryService.updateInventory(updateInventoryDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    @PutMapping("items/{itemId}/infinite")
    public ResponseEntity<Object> updateInfiniteStatus(@RequestBody UpdateInfiniteStatusDto updateInfiniteStatusDto,
                                                       @PathVariable("itemId") String itemId) throws InventoryServiceException {
        updateInventoryService.updateInfiniteStatus(updateInfiniteStatusDto, itemId);

        return ok().build();
    }

    @Override
    @PostMapping("/availability")
    public ResponseEntity<Object> getItemsInventoryAvailability(GetInventoryAvailabilityDto inventoryAvailabilityBean)
        throws InventoryServiceException {

        logger.debug("Get items inventory by given shipNodes call is invoked");
        InventoryResponseDto inventoryItems = null;
        try {
        	inventoryItems = inventoryService.findInventoryBySpecifiedConditions(inventoryAvailabilityBean);
        } catch (Throwable e) {
        	if(e instanceof AvailabilityServiceException) {
        		AvailabilityServiceException ex = (AvailabilityServiceException) e;
        		return new ResponseEntity<>(ex.getErrorDetails(), HttpStatus.resolve(ex.getHttpStatus()));
        	}
		}
        if (inventoryItems == null) {
            logger.warn("Unable to find inventories by specified conditions: {}", inventoryAvailabilityBean);
            throw new NotFoundException(INVENTORY_ITEMS_NOT_FOUND_ERROR);
        }

        return new ResponseEntity<>(inventoryItems, HttpStatus.OK);
    }

}