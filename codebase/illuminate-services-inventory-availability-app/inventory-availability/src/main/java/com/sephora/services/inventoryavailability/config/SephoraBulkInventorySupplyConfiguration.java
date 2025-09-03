package com.sephora.services.inventoryavailability.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sephora.email.inventory-supply-bulk")
@Data
public class SephoraBulkInventorySupplyConfiguration {
    private String fromAddress;
    private String[] toAddress;
    private String[] ccAddress;
}
