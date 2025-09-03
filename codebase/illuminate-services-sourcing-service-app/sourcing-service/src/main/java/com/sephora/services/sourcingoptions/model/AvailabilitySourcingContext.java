package com.sephora.services.sourcingoptions.model;

import com.sephora.services.sourcingoptions.config.AvailabilityConfiguration;
import com.sephora.services.sourcingoptions.config.AvailabilityShipNodeConfiguration;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import lombok.Data;

@Data
public class AvailabilitySourcingContext {
    SourcingOptionsRequestDto request;
    AvailabilityConfiguration config;
    AvailabilityShipNodeConfiguration availabilityShipNodeConfiguration;
}
