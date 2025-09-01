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
@ToString(exclude = {"orgId", "feedType", "uom", "updateTime", "updateUser"})
@NoArgsConstructor
public class InventorySupplyAHResponse {
	private String orgId;
	private String productId;
	private String feedType;
	private String uom;
	private String updateTime;
	private String updateUser;
	
	private List<PhysicalInventory> physicalInventory;
}
