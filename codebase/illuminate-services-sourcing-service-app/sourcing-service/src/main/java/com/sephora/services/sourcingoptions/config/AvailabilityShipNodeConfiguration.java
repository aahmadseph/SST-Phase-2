package com.sephora.services.sourcingoptions.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;
import java.util.Map;

@ConfigurationProperties(prefix = "shipment")
@Data
public class AvailabilityShipNodeConfiguration {
    List<String> borderFreeLocations;
    Map<String, List<String>> apoFpoLocations;
}
