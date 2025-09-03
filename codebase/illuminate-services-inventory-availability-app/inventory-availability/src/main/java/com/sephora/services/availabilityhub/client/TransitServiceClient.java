package com.sephora.services.availabilityhub.client;

import com.sephora.services.inventoryavailability.model.transit.TimeInTransitResponse;
import com.sephora.services.inventoryavailability.model.transit.postTimeInTransit.PostTimeInTransitRequest;
import feign.Headers;
import feign.Param;
import feign.RequestLine;

@Headers({"Content-Type: application/json"})
public interface TransitServiceClient {
	
	@RequestLine("GET /transit-services/time-fulfillment-service/{orgId}/{countryCode}/{destination}/{locationType}/{locationId}/{fulfillmentService}")
    TimeInTransitResponse getTimeInTransitDetails(
            @Param("orgId") String orgId,
            @Param("countryCode") String countryCode,
            @Param("destination") String destination,
            @Param("locationType") String locationType,
            @Param("locationId") String locationId,
            @Param("fulfillmentService") String fulfillmentService
    );

    @RequestLine("POST /transit-services/time-fulfillment-service")
    TimeInTransitResponse postTimeInTransitDetails(PostTimeInTransitRequest postTimeInTransitRequest);

    @RequestLine("PUT /transit-services/time-fulfillment-service")
    TimeInTransitResponse updateTimeInTransitDetails(PostTimeInTransitRequest postTimeInTransitRequest);
}
