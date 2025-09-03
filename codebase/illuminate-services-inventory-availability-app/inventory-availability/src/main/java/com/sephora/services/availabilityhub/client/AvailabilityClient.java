package com.sephora.services.availabilityhub.client;

import static com.sephora.services.inventoryavailability.AvailabilityConstants.*;

import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.GetAvailabilityResponseData;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.model.nodecontrol.availabilityhub.NodeControlRequest;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import io.micrometer.core.annotation.Timed;

@Headers({"Content-Type: application/json"})
public interface AvailabilityClient {
	
	@Timed(value = AVAILABILITY_TIME_NAME, description  = AVAILABILITY_TIME_DESCRIPTION, extraTags = {YANTRIKS_URI, GET_AVAILABILITY_AH_URI})
    @RequestLine("POST /availability-services/availability/aggregator/v3.0?fulfillmentTypes={fulfillmentTypes}&correlationId={correlationId}")
    GetAvailabilityResponseData getItemsInventoryAvailability(InventoryItemsRequestDto inventoryItemsRequestDto, @Param("fulfillmentTypes") String fulfillmentTypes, @Param("correlationId") String correlationId);
	
	@Timed(value = AVAILABILITY_TIME_NAME, description  = AVAILABILITY_TIME_DESCRIPTION, extraTags = {YANTRIKS_URI, DELETE_CONTROL_AH_URI})
    @RequestLine("DELETE /availability-services/product-location-controls/v3.0/{orgId}/{productId}/{uom}/{locationId}/{locationType}")
    void deleteInventoryControl(@Param("orgId") String orgId, @Param("productId") String productId, @Param("uom") String uom, 
    		@Param("locationId") String locationId, @Param("locationType") String locationType);
	
    @RequestLine("PUT /availability-services/product-location-controls/v3.0")
    @Headers({ "Content-Type: application/json" })
    void updateInventoryControl(NodeControlRequest nodeControlRequest);
}
