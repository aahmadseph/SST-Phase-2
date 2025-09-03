package com.sephora.services.inventoryavailability.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
@RefreshScope
public class InventoryApplicationConfig {
    @Value("${inventory.defaultOrgId: SEPHORA}")
    private String defaultOrgId;
    @Value("#{'${shipment.dc-locations:0701,0801,1001,1021,1050,0750,1070}'.split(',')}")
    private List<String> dcLocations;
    @Value("${inventory.defaultTransactionType: DEFAULT}")
    private String defaultTransactionType;
    
    @Value("${inventory.site-page-availability.defaultAtpStatus:OOS}")
	private String defaultAtpStatus;
    
    @Value("${inventory.defaultSegment}")
	private String defaultSegment;
}
