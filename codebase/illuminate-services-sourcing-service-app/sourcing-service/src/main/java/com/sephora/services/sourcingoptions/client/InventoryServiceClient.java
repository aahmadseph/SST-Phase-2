package com.sephora.services.sourcingoptions.client;

import com.sephora.services.sourcingoptions.model.dto.GetInventoryAvailabilityDto;
import com.sephora.services.sourcingoptions.model.dto.InventoryAvailabilityDto;
import com.sephora.services.sourcingoptions.model.dto.UpdateShipNodesStatusDto;
import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.scheduling.annotation.Async;

import static com.sephora.services.sourcingoptions.config.AsyncConfig.THREAD_POOL;

public interface InventoryServiceClient {

    @Async(THREAD_POOL)
    @RequestLine("PUT /inventory/v1/nodes/status")
    @Headers({"Content-Type: application/json","correlationId: {correlationId}"})
    void updateShipNodesStatus(UpdateShipNodesStatusDto updateShipNodesStatus, @Param("correlationId") String correlationId);

    @RequestLine("POST /inventory/v1/availability")
    @Headers({"Content-Type: application/json","correlationId: {correlationId}"})
    InventoryAvailabilityDto getItemsInventoryAvailability(GetInventoryAvailabilityDto inventoryAvailabilityBean, @Param("correlationId") String correlationId);
}