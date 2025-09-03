package com.sephora.services.inventoryavailability.model.supply;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ApiModel(value = "GetInventorySupplyCallerResponse")
@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(exclude = {"uom", })
@NoArgsConstructor
public class GetInventorySupplyCallerResponse {
	@ApiModelProperty(value = "GetInventorySupplyCallerResponse.productId.value", 
			required = true, position = 0, example = "ITEM-4")
	private String productId;
	
	@ApiModelProperty(value = "GetInventorySupplyCallerResponse.uom.value", 
			required = true, position = 1, example = "EACH")
	private String uom;
	
	@ApiModelProperty(value = "GetInventorySupplyCallerResponse.inventorySupplies.value", 
			required = true, position = 2)
	@JsonProperty("inventorySupply")
	private List<InventorySupply> inventorySupplies;
}
