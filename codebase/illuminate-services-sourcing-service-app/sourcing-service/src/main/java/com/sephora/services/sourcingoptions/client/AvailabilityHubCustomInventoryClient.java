package com.sephora.services.sourcingoptions.client;

import com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ah.request.AHShipNodeDelayRequestDto;

import feign.Headers;
import feign.Param;
import feign.RequestLine;

public interface AvailabilityHubCustomInventoryClient {
	
	@RequestLine("POST /common-extensions/location-fs-processing-time?Correlation-Id={correlationId}")
	@Headers({ "Content-Type: application/json" })
	public void publishShipNodeDelay(AHShipNodeDelayRequestDto ahShipNodeDelayRequestDto, @Param("correlationId") String correlationId);
	
	@RequestLine("PUT /common-extensions/location-fs-processing-time?Correlation-Id={correlationId}")
	@Headers({ "Content-Type: application/json" })
	public void updateShipNodeDelay(AHShipNodeDelayRequestDto ahShipNodeDelayRequestDto, @Param("correlationId") String correlationId);
	
	@RequestLine("DELETE /common-extensions/location-fs-processing-time/{orgId}/{ruleId}?Correlation-Id={correlationId}")
	@Headers({ "Content-Type: application/json" })
	public void deleteShipNodeDelay(@Param("orgId") String orgId, @Param("ruleId") String ruleId, @Param("correlationId") String correlationId);
}
