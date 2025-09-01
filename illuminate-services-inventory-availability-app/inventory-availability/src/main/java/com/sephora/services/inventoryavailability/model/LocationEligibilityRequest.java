package com.sephora.services.inventoryavailability.model;

import lombok.Data;

@Data
public class LocationEligibilityRequest {
	private String locationId;
	private String fulfillmentType;
	private String sellingChannel;
	private boolean enabled;
	private String updateUser;
	private String transactionType;
	private String locationType;
	private String orgId;
}
