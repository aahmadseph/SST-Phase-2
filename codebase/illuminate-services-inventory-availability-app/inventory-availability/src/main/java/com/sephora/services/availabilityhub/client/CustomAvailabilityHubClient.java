package com.sephora.services.availabilityhub.client;

import static com.sephora.services.inventoryavailability.AvailabilityConstants.AVAILABILITY_TIME_DESCRIPTION;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.AVAILABILITY_TIME_NAME;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.GET_SUPPLY_LOCATION_AH_URI;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.YANTRIKS_URI;

import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyAHResponse;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import io.micrometer.core.annotation.Timed;

@Headers({"Content-Type: application/json"})
public interface CustomAvailabilityHubClient {
	/**
     * 
     * Fegin end point to search a product in a particular location.
     * 
     * @param orgId
     * @param productId
     * @param uom
     * @param locationType
     * @param locationId
     * @return
     */
    @Timed(value = AVAILABILITY_TIME_NAME, description  = AVAILABILITY_TIME_DESCRIPTION, extraTags = {YANTRIKS_URI, GET_SUPPLY_LOCATION_AH_URI})
    @RequestLine("GET /search/{orgId}/{productId}/{uom}/{locationType}/{locationId}?considerNegativeSupply=true")
    
    GetInventorySupplyAHResponse getInventorySupply(@Param("orgId") String orgId, @Param("productId") String productId, @Param("uom") String uom, 
    		@Param("locationType") String locationType, @Param("locationId") String locationId);

    @RequestLine("GET /organization-services/org/SEPHORA_ECOMM")
	void testConnectivity();
}
