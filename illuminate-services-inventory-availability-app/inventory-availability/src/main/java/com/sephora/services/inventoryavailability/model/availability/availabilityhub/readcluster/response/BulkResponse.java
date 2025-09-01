package com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BulkResponse {
	private String updateTime;
	private String updateUser;
	private String orgId;
	private String sellingChannel;
	private String transactionType;
	private String productId;
	private String uom;
	private String fulfillmentType;
	private String locationType;
	private String locationId;
	private String atpStatus;
	private String oldAtpStatus;
	private Double atp;
	private String futureQty;
	private String futureQtyDate;
	private String gtin;
	private String launchDate;
	private String launchDateTime;
}
