/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2020 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.inventoryavailability.controller;

import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.SitePageAvailabilityResponse;
import com.sephora.services.inventoryavailability.model.inventorycontrol.DeleteInventoryControlDTO;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;

import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateRequestDto;
import com.sephora.services.inventoryavailability.model.cosmos.doc.bulksupply.BulkInventorySupplyDto;
import com.sephora.services.inventoryavailability.model.nodecontrol.NodeControlDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import com.sephora.services.inventoryavailability.service.InventoryServiceException;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Api(tags = "APIs to handle availability", description = "API to handle availability")
public interface InventoryAvailabilityController {
 
//	@GetMapping("/availability/{sellingChannel}/{productId}/{uom}")
//	public  ResponseEntity<Object> getSingleItemInventoryAvailability( @PathVariable("sellingChannel") String sellingChannel,
//    		@PathVariable("productId") String productId, @PathVariable("uom") String uom )
//    	            throws InventoryServiceException;
//	
//	
    /*ResponseEntity<Object> getItemsInventoryAvailability( @RequestBody InventoryItemsRequestDto inventoryItemsRequestDto)
            throws InventoryServiceException;*/
    /**
     * This PUT API is used to enable/disable a Location for a fulfillmentType
     * 	
     * @param locationEligibilityDTO
     * @return
     * @throws InventoryServiceException
     */
//    @PutMapping("/locationEligibility")
//    public ResponseEntity<Object> updateLocationEligibility(@RequestBody LocationEligibilityDTO locationEligibilityDTO) throws InventoryServiceException;
//    
    @PostMapping("/supplyUpdate")
    public ResponseEntity<Object> updateInventorySupply(@RequestBody InventorySupplyDTO inventorySupplyDTO);

    /*@PostMapping("/bulkSupplyUpdate")
    ResponseEntity<Object> updateBulkInventorySupply(BulkInventorySupplyDto inventorySupplyDTO);*/
    
    @GetMapping("/search/{productId}/{uom}")
    public ResponseEntity<Object> getInventorySupply(@PathVariable("productId") String productId, @PathVariable("uom") String uom);
    
    @GetMapping("/search/{productId}/{uom}/{locationId}")
    public ResponseEntity<Object> getInventorySupply(@PathVariable("productId") String productId, @PathVariable("uom") String uom,
    		@PathVariable String locationId);

    @PostMapping("/GetAvailability/")
    public ResponseEntity<Object> getInventoryAvailability(@RequestBody AvailabilityRequestDto request);
    
    @PostMapping("/DeleteInventoryControl")
    public ResponseEntity<Object> deleteInventoryControl(@RequestBody DeleteInventoryControlDTO deleteInventoryControlDTO);

    @PostMapping("/GetAvailabilityForSitePages")
    @ApiParam(name = "details", value = "Is details required", required = false)
    public ResponseEntity<Object> getAvailabilityForSitePages(@RequestBody SitePageAvailabilityDto sitePageAvailability, @RequestParam(required = false) boolean details);

    @PostMapping("/updateItemHoldStatus")
    ResponseEntity<Object> updateHoldItemStatus(@RequestBody ItemHoldUpdateRequestDto itemHoldUpdateRequestDto);
    
    @PostMapping("/unlockSku")
    ResponseEntity<Object> unlockSku(@RequestBody NodeControlDTO nodeControlDTO);

    /***
	 * Below controller is the copy of getAvailabilityForSitePages API. This is just to have a generic name for the API when it is given to the external world. 
	 * All the business logic remains the same as in getAvailabilityForSitePages API.
	 * */
   
    @PostMapping("/GetAvailableInventory")
    @ApiParam(name = "${GetAvailableInventory.queryParam.details.name}", value = "Is details required", required = false)
    @ApiResponses({
    	@ApiResponse(code = 200, response = SitePageAvailabilityResponse.class, message = "Success")
    	})
    @ApiOperation(value = "${GetAvailableInventory.value}", notes = "${GetAvailableInventory.notes}", nickname = "${GetAvailableInventory.nickname}")
	ResponseEntity<Object> getAvailableInventory(@RequestBody SitePageAvailabilityDto sitePageAvailability, @RequestParam(required = false) boolean details);
}
