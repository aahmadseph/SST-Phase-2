package com.sephora.services.inventoryavailability.model.supply;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@ApiModel(value = "InventorySupplyCallerResponse")
@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(exclude = {"uom", "supplyType"})
@NoArgsConstructor
public class InventorySupplyCallerResponse {
	@ApiModelProperty(value = "InventorySupplyCallerResponse.productId.value", 
			required = true, position = 0, example = "ITEM-4")
	private String productId;
	
	@ApiModelProperty(value = "InventorySupplyCallerResponse.uom.value", 
			required = true, position = 1, example = "EACH")
	private String uom;
	
	@ApiModelProperty(value = "InventorySupplyCallerResponse.locationId.value", 
			required = true, position = 2, example = "0701")
	private String locationId;
	
	@ApiModelProperty(value = "InventorySupplyCallerResponse.supplyType.value", 
			required = true, position = 3, example = "ONHAND")
	private String supplyType;
	
	@ApiModelProperty(value = "InventorySupplyCallerResponse.quantity.value", 
			required = true, position = 0, example = "2")
	private Double quantity;
}
