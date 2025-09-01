package com.sephora.services.inventoryavailability.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class InventorySupplyDefaultConfig {
    @Value("${inventory.supply.defaultSegment:}")
    private String defaultSegment;
    @Value("${inventory.supply.defaultSupplyType:ONHAND}")
    private String defaultSupplyType;
}
