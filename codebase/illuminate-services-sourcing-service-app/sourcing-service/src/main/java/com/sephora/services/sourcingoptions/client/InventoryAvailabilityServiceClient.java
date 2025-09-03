package com.sephora.services.sourcingoptions.client;

import com.sephora.services.sourcingoptions.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.sourcingoptions.model.availability.response.AvailabilityResponseDto;
import com.sephora.services.sourcingoptions.model.dto.GetInventoryAvailabilityDto;
import com.sephora.services.sourcingoptions.model.dto.InventoryAvailabilityDto;
import com.sephora.services.sourcingoptions.model.dto.UpdateShipNodesStatusDto;
import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.scheduling.annotation.Async;

import static com.sephora.services.sourcingoptions.config.AsyncConfig.THREAD_POOL;

public interface InventoryAvailabilityServiceClient {

    @Async(THREAD_POOL)
    @RequestLine("PUT /inventory-availability/v1/nodes/status")
    @Headers({"Content-Type: application/json","correlationId: {correlationId}"})
    void updateShipNodesStatus(UpdateShipNodesStatusDto updateShipNodesStatus, @Param("correlationId") String correlationId);

    @RequestLine("POST /inventory-availability/v1/availability")
    @Headers({"Content-Type: application/json","correlationId: {correlationId}"})
    InventoryAvailabilityDto getItemsInventoryAvailability(GetInventoryAvailabilityDto inventoryAvailabilityBean, @Param("correlationId") String correlationId);

    @RequestLine("POST /inventory-availability/v1.0/GetAvailability/")
    @Headers({ "Content-Type: application/json" })
    public AvailabilityResponseDto getAvailability(AvailabilityRequestDto request);
}