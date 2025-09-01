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

package com.sephora.services.inventoryavailability.controller.impl;

import com.sephora.services.inventory.service.GetAvailabilityForSitePagesService;
import com.sephora.services.inventoryavailability.exception.HoldItemException;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.SitePageAvailabilityResponse;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateRequestDto;
import com.sephora.services.inventoryavailability.model.nodecontrol.NodeControlDTO;
import com.sephora.services.inventoryavailability.model.cosmos.doc.bulksupply.BulkInventorySupplyDto;
import com.sephora.services.inventoryavailability.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventoryavailability.controller.InventoryAvailabilityController;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.AvailabilityServicePartialFailureException;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
import com.sephora.services.inventoryavailability.model.inventorycontrol.DeleteInventoryControlDTO;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyCallerResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyCallerResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.extern.log4j.Log4j2;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author Shiljo Jose
 */
@ConditionalOnProperty(prefix = "yantriks", name = "enabled", havingValue = "true")
@RestController
@RequestMapping("/v1.0")
@ControllerDocumentation
@Log4j2
@EnableSwagger2
public class InventoryAvailabilityControllerImpl implements InventoryAvailabilityController {

    /*@Autowired
    private YantriksInventoryService yantriksInventoryService;*/
    
    //@Autowired
    //private CacheService cacheService;
    
//    @Autowired
//    private LocationEligibilityService locationEligibilityService;
    
    @Autowired
    private UpdateInventorySupplyService updateInventorySupplyService;

    /*@Autowired
	private BulkInventorySupplyService bulkInventorySupplyService;*/
    
    @Autowired
    private GetInventorySupplyService getInventorySupplyService;

    @Autowired
	private GetInventoryAvailabilityService getInventoryAvailabilityService;
    
    @Autowired
    private DeleteInventoryControlService deleteInventoryControlService;
    
    @Autowired
	GetAvailabilityForSitePagesService getAvailabilityForSitePagesService;

    @Autowired
	HoldItemService holdItemService;
    
    @Autowired
    NodeControlService nodeControlService;
    
	
//	@Override
//	@GetMapping("/availability/{sellingChannel}/{productId}/{uom}")
//	public  ResponseEntity<Object> getSingleItemInventoryAvailability( @PathVariable("sellingChannel") String sellingChannel,
//    		@PathVariable("productId") String productId, @PathVariable("uom") String uom )
//            throws InventoryServiceException {
//		
//        log.debug("Get Single item availability call for product {}",productId );
//
//        long startTime  = System.currentTimeMillis();
//        AvailabilityResponse availability = yantriksInventoryService.getSingleItemInventoryAvailability(sellingChannel, productId, uom  );
//        
//        log.info("Get Single item availability(HTTP GET Request) took {} ms", System.currentTimeMillis() - startTime) ;
//        
//        return new ResponseEntity<>(availability, HttpStatus.OK);
//
//	}
//
    /*@Override
    @PostMapping("/availability/aggregator")
    public ResponseEntity<Object> getItemsInventoryAvailability(InventoryItemsRequestDto inventoryItemsRequestDto)
            throws InventoryServiceException {

        log.debug("Get items inventory POST request--START");

        long startTime  = System.currentTimeMillis();

		GetAvailabilityResponseData inventoryItems = null;
		try {
			inventoryItems = yantriksInventoryService.getItemsInventoryAvailability(inventoryItemsRequestDto);
		}  catch (AvailabilityServicePartialSuccessException e) {
			return new ResponseEntity<>(e.getResponseData(), HttpStatus.resolve(e.getHttpStatus()));
		} catch (AvailabilityServiceException e) {
			e.printStackTrace();
		}

		log.info("Get item availability (HTTP POST) took {} ms for {} items", System.currentTimeMillis() - startTime, inventoryItemsRequestDto.getProducts().size() ) ;


        if (inventoryItems == null) {
            log.error("Unable to Get items inventory : {}", inventoryItemsRequestDto);
            throw new InventoryServiceException("Unable to Get items inventory :" + inventoryItemsRequestDto);
        }

        return new ResponseEntity<>(inventoryItems, HttpStatus.OK);
    }*/
//    
//    @Override
//    @PutMapping("/locationEligibility")
//    public ResponseEntity<Object> updateLocationEligibility(@RequestBody LocationEligibilityDTO locationEligibilityDTO)
//    		throws InventoryServiceException {
//    	try {
//			locationEligibilityService.updateLocationEligibility(locationEligibilityDTO);
//			
//		} catch (LocationEligibilityException e) {
//			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
//		}
//    	
//    	return new ResponseEntity<>(HttpStatus.OK);
//    }
    
    /**
     * Rest end point to Update inventory supply
     */
    @ApiResponses({
    	@ApiResponse(code=200, response = InventorySupplyCallerResponse.class, message="Success"),
		@ApiResponse(code=201, message="Created"),
		@ApiResponse(code=204, message="Data not found in destination"),
		@ApiResponse(code=400, response=ErrorResponseDTO.class, message="Invalid request format"),
		@ApiResponse(code=409, response=ErrorResponseDTO.class, message="Unique Constraint Violation"),
		@ApiResponse(code=500, response=ErrorResponseDTO.class, message="Internal server error")
    })
    @Override
    @PostMapping("/supplyUpdate")
    public ResponseEntity<Object> updateInventorySupply(@RequestBody InventorySupplyDTO inventorySupplyDTO) {
    	log.debug("Update Inventory Supply for request: {}", inventorySupplyDTO);
    	try {
    		log.info("Updating inventory Supply for product {} ", inventorySupplyDTO.getProductId());
    		InventorySupplyCallerResponse response =  updateInventorySupplyService.updateInventorySupply(inventorySupplyDTO);
    		log.info("Updated inventory Supply for product {} ", inventorySupplyDTO.getProductId());
    		
    		return new ResponseEntity<>(response, HttpStatus.OK);
    		
    	} catch(AvailabilityServiceException e) {
    		log.error("Exption occured while updating ivenntory supplay. Status: {}",
					HttpStatus.resolve(e.getHttpStatus()).toString());
    		return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
    	}
    }

	/*@ApiResponses({
			@ApiResponse(code=200, response = InventorySupplyCallerResponse.class, message="Success"),
			@ApiResponse(code=201, message="Created"),
			@ApiResponse(code=204, message="Data not found in destination"),
			@ApiResponse(code=400, response=ErrorResponseDTO.class, message="Invalid request format"),
			@ApiResponse(code=409, response=ErrorResponseDTO.class, message="Unique Constraint Violation"),
			@ApiResponse(code=500, response=ErrorResponseDTO.class, message="Internal server error")
	})

	@Override
	@PostMapping("/bulkSupplyUpdate")
	public ResponseEntity<Object> updateBulkInventorySupply(@org.springframework.web.bind.annotation.RequestBody BulkInventorySupplyDto bulkInventorySupplyDTO) {
		log.debug("Update Inventory Supply for  bulk request: {}", bulkInventorySupplyDTO);
		try {
			log.debug("Updating bulk inventory Supply {} ", bulkInventorySupplyDTO);
			bulkInventorySupplyService.updateInventorySupply(bulkInventorySupplyDTO);
			log.debug("Updated bulk inventory Supply  {} ", bulkInventorySupplyDTO);

			return new ResponseEntity<>(HttpStatus.OK);

		} catch(AvailabilityServiceException e) {
			log.error("Exption occured while updating ivenntory supplay. Status: {}",
					HttpStatus.resolve(e.getHttpStatus()).toString());
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		}
	}*/
    
    /**
     * Rest end point to search a product in network.
     */
    @ApiResponses({
    	@ApiResponse(code=200, response=GetInventorySupplyCallerResponse.class, message="Sucess"),
		@ApiResponse(code=201, message="Created"),
		@ApiResponse(code=204, message="Data not found in destination"),
		@ApiResponse(code=400, response=ErrorResponseDTO.class, message="Invalid request format"),
		@ApiResponse(code=409, response=ErrorResponseDTO.class, message="Unique Constraint Violation"),
		@ApiResponse(code=500, response=ErrorResponseDTO.class, message="Internal server error")
    })
    @Override
    @GetMapping("/search/{productId}/{uom}")
    public ResponseEntity<Object> getInventorySupply(@PathVariable("productId") String productId, @PathVariable("uom") String uom) {
    	try {
    		log.info("Searching inventory supplay for product: {} and uom: {}", productId, uom);
    		GetInventorySupplyCallerResponse callerResponse = getInventorySupplyService.search(productId, uom);
    		log.info("Search completed inventory supplay for product: {} and uom: {}", productId, uom);
    		return new ResponseEntity<>(callerResponse, HttpStatus.OK);
		} catch (AvailabilityServiceException e) {
			log.error("Exption occured while searching ivenntory supplay. Status: {} ",
					HttpStatus.resolve(e.getHttpStatus()).toString());
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		}
    }
    
    @ApiResponses({
    	@ApiResponse(code=200, response=GetInventorySupplyCallerResponse.class, message="Sucess"),
		@ApiResponse(code=201, message="Created"),
		@ApiResponse(code=204, message="Data not found in destination"),
		@ApiResponse(code=400, response=ErrorResponseDTO.class, message="Invalid request format"),
		@ApiResponse(code=409, response=ErrorResponseDTO.class, message="Unique Constraint Violation"),
		@ApiResponse(code=500, response=ErrorResponseDTO.class, message="Internal server error")
    })
    /**
     * Rest end point to search a product in a location.
     */
    @Override
    public ResponseEntity<Object> getInventorySupply(String productId, String uom, String locationId) {
    	try {
    		log.info("Searching inventory supplay for product: {} and uom: {} locationId: {}", productId, uom, locationId);
    		GetInventorySupplyCallerResponse callerResponse = getInventorySupplyService.search(productId, uom, locationId);
    		log.info("Search completed inventory supplay for product: {} and uom: {} locationId: {}", productId, uom, locationId);
    		return new ResponseEntity<>(callerResponse, HttpStatus.OK);
		} catch (AvailabilityServiceException e) {
			log.error("Exption occured while searching ivenntory supplay. Status: {} ",
					HttpStatus.resolve(e.getHttpStatus()).toString());
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		}
    }

	@Override
	public ResponseEntity<Object> getInventoryAvailability(AvailabilityRequestDto request) {
		AvailabilityResponseDto availabilityResponseDto = null;
		try{
			availabilityResponseDto = getInventoryAvailabilityService.getInventoryAvailability(request);
		}catch(AvailabilityServiceException e){
			log.error(e);
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		} catch (AvailabilityServicePartialFailureException e) {
			log.error(e);
			return new ResponseEntity<>(e.getResponseData(), HttpStatus.resolve(e.getHttpStatus()));
		}
		return new ResponseEntity<>(availabilityResponseDto, HttpStatus.OK);
	}
	
	@ApiResponses({
    	@ApiResponse(code=200, message="Success"),
		@ApiResponse(code=201, message="Created"),
		@ApiResponse(code=400, response=ErrorResponseDTO.class, message="Invalid request format"),
		@ApiResponse(code=409, response=ErrorResponseDTO.class, message="Unique Constraint Violation"),
		@ApiResponse(code=500, response=ErrorResponseDTO.class, message="Internal server error")
    })
	@Override
	public ResponseEntity<Object> deleteInventoryControl(DeleteInventoryControlDTO deleteInventoryControlDTO) {
		try {
			log.info("Delete inventory control request recieved: {}", deleteInventoryControlDTO);
			deleteInventoryControlService.deleteInventoryControl(deleteInventoryControlDTO);
			return ResponseEntity.ok().build();
		} catch(AvailabilityServiceException e) {
			log.error("Exption occured while deleting  ivenntory control for: {} ",
					deleteInventoryControlDTO, e);
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		}
	}

	@Override
	public ResponseEntity<Object> updateHoldItemStatus(ItemHoldUpdateRequestDto itemHoldUpdateRequestDto){
		try{
			holdItemService.updateHoldItemStatus(itemHoldUpdateRequestDto);
		}catch(HoldItemException e){
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Object> getAvailabilityForSitePages(SitePageAvailabilityDto sitePageAvailability,  boolean details) {
		try {
			log.info("Received getAvailability request for sitePages. Number of products: {} details: {}", sitePageAvailability.getProducts().size(), details);
			log.debug("Request Payload for the getAvailability call for site pages: {}", sitePageAvailability);
			SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(sitePageAvailability, details);
            log.debug("Response Payload for the getAvailability call for site pages: {}", sitePageAvailabilityResponse);
			log.info("Sending response of getAvailability for sitePages request. Number of products: {}, sellingChannel: {}", 
					sitePageAvailabilityResponse.getAvailabilityByProducts().size(), sitePageAvailabilityResponse.getSellingChannel());
			return new ResponseEntity<>(sitePageAvailabilityResponse, HttpStatus.OK);
		} catch (AvailabilityServiceException e) {
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		}
	}

	/***
	 * Below controller is the copy of getAvailabilityForSitePages API. This is just to have a generic name for the API when it is given to the external world. 
	 * All the business logic remains the same as in getAvailabilityForSitePages API.
	 * */
	@Override
	public ResponseEntity<Object> getAvailableInventory(SitePageAvailabilityDto sitePageAvailability,  boolean details) {
		try {
			log.info("Received getAvailableInventory request. Number of products: {} details: {}", sitePageAvailability.getProducts().size(), details);
			log.debug("Request Payload for the getAvailableInventory call: {}", sitePageAvailability);
			SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(sitePageAvailability, details);
            log.debug("Response Payload for the getAvailability call for site pages: {}", sitePageAvailabilityResponse);
			log.info("Sending response of getAvailability for sitePages request. Number of products: {}, sellingChannel: {}", 
					sitePageAvailabilityResponse.getAvailabilityByProducts().size(), sitePageAvailabilityResponse.getSellingChannel());
			return new ResponseEntity<>(sitePageAvailabilityResponse, HttpStatus.OK);
		} catch (AvailabilityServiceException e) {
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		}

	}
	
	@Override
	public ResponseEntity<Object> unlockSku(NodeControlDTO nodeControlDTO) {
		try {
			nodeControlService.unlockSku(nodeControlDTO);
			return  new ResponseEntity<>(HttpStatus.OK);
		} catch (AvailabilityServiceException e) {
			return new ResponseEntity<>(e.getErrorDetails(), HttpStatus.resolve(e.getHttpStatus()));
		}
	}
}
