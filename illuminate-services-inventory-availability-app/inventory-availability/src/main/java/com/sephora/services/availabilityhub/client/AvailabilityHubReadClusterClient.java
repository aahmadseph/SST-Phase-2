package com.sephora.services.availabilityhub.client;

import com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.request.ReadClusterAvailabilityRequest;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.response.ReadClusterAvailabilityResponse;

import feign.Headers;
import feign.RequestLine;

@Headers({"Content-Type: application/json"})
public interface AvailabilityHubReadClusterClient {
	
	@RequestLine("POST /availability-services/location-atp-cache/aggregator/v3.0/")
    ReadClusterAvailabilityResponse getItemsInventoryAvailability(ReadClusterAvailabilityRequest readClusterAvailabilityRequest);
}
