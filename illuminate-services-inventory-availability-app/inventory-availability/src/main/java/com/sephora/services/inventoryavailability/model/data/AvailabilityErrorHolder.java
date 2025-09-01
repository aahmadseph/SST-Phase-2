package com.sephora.services.inventoryavailability.model.data;

import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import lombok.Builder;
import lombok.Data;

@Builder(toBuilder = true)
@Data
public class AvailabilityErrorHolder {
    private InventoryItemsRequestDto request;
    private AvailabilityServiceException serviceException;
}
