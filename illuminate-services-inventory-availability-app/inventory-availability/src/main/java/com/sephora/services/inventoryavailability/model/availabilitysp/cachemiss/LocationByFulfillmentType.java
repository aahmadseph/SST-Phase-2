package com.sephora.services.inventoryavailability.model.availabilitysp.cachemiss;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationByFulfillmentType {
	private String fulfillmentType;
	private String locationId;
}
