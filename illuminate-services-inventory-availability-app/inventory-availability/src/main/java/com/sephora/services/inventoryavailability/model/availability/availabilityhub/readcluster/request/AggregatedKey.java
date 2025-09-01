package com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AggregatedKey {
	private String orgId;
	private String sellingChannel;
	private String transactionType;
	private String productId;
	private String uom;
	private String fulfillmentType;
	private String locationType;
	private String locationId;
}
