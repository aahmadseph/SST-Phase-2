package com.sephora.services.inventoryavailability.model.supply;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@Builder(toBuilder = true)
@ToString(exclude = {"eventType", "feedType", "locationType", "orgId", "uom"})
@NoArgsConstructor
@AllArgsConstructor
@Data
public class InventorySupplyRequest {
	private String eventType;
	private String feedType;
	private String locationId;
	private String locationType;
	private String orgId;
	private String productId;
	private Double quantity;
	private String uom;
	private String updateTimeStamp;
	@JsonProperty("to")
	private InventorySupplyTo to;
	@JsonProperty("audit")
	private InventorySupplyAudit audit;
}
