package com.sephora.services.inventoryavailability.model.supply;



import java.util.List;

import com.sephora.services.inventoryavailability.model.PhysicalInventory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(exclude = {"orgId", "uom"})
@NoArgsConstructor
public class GetInventorySupplyAHResponse {
	private String orgId;
	private String productId;
	private String uom;
	private List<PhysicalInventory> physicalInventory;
}
