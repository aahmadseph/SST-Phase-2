package com.sephora.services.availabilityhub.client;

import static com.sephora.services.inventoryavailability.AvailabilityConstants.*;

import com.sephora.services.inventoryavailability.model.LocationEligibilityRequest;
import com.sephora.services.inventoryavailability.model.dto.AvailabilityResponse;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyRequest;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import io.micrometer.core.annotation.Timed;

@Headers({"Content-Type: application/json"})
public interface AvailabilityHubClient {
	
	@RequestLine("GET /availability-services/availability/v3.0/{orgId}/{sellingChannel}/{productId}/{uom}/{transactionType}?segment=US&correlationId={correlationId}")
	AvailabilityResponse getSingleItemInventoryAvailability (@Param("correlationId") String correlationId, @Param("orgId") String orgId, @Param("sellingChannel") String sellingChannel,
                                  @Param("productId") String productId, @Param("uom") String uom, @Param("transactionType") String transactionType);
	
	
    @RequestLine("POST /availability-services/availability/aggregator/v3.0?correlationId={correlationId}")
    AvailabilityResponse getItemsInventoryAvailability(@Param("correlationId") String correlationId,  InventoryItemsRequestDto inventoryItemsRequestDto);
    
    @RequestLine("PUT /location-services/location-fulfillment-type")
    @Headers({ "Content-Type: application/json"})
    void updateLocationEligibility(LocationEligibilityRequest locationEligibilityRequest);
    
    @Timed(value = AVAILABILITY_TIME_NAME, description  = AVAILABILITY_TIME_DESCRIPTION, extraTags = {YANTRIKS_URI, SUPPLY_UPDATE_AH_URI})
    @RequestLine("POST /inventory-services/supplyupdate")
    @Headers({ "Content-Type: application/json"})
    InventorySupplyAHResponse updateInventorySupply(InventorySupplyRequest inventorySupplyRequest);
    
    /**
     * Fegin end point to search a product in network. It will return all matched location details.
     * 
     * @param orgId
     * @param productId
     * @param uom
     * @return
     */
    @Timed(value = AVAILABILITY_TIME_NAME, description  = AVAILABILITY_TIME_DESCRIPTION, extraTags = {YANTRIKS_URI, GET_SUPPLY_NETWORK_AH_URI})
    @RequestLine("GET /inventory-services/search/{orgId}/{productId}/{uom}")
    GetInventorySupplyAHResponse getInventorySupply(@Param("orgId") String orgId, @Param("productId") String productId, @Param("uom") String uom);
}
