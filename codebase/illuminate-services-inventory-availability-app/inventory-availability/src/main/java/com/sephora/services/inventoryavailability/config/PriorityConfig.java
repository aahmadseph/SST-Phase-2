package com.sephora.services.inventoryavailability.config;

import java.util.List;

import lombok.Data;
@Data
public class PriorityConfig {
	private String fulfillmentType;
    private List<String> requestOrigin; 
    private List<String> priorityOrder;
    private Double assumedATP = 0.0;
    private String assumedATPStatus = "OOS";
}
