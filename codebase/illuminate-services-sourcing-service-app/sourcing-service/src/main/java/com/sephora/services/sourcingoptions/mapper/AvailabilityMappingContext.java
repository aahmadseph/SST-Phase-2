package com.sephora.services.sourcingoptions.mapper;

import com.sephora.services.sourcingoptions.config.AvailabilityConfiguration;
import com.sephora.services.sourcingoptions.config.AvailabilityShipNodeConfiguration;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AvailabilityMappingContext {
    AvailabilityConfiguration availabilityConfiguration;
    AvailabilityShipNodeConfiguration availabilityShipNodeConfiguration;
}
