package com.sephora.services.inventoryavailability.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ApiModel(value = "SupplyType")
@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString
@NoArgsConstructor
public class SupplyType {
	
	@ApiModelProperty(value = "SupplyType.supplyType.value", 
			required = true, position = 0, example = "ONHAND")
	private String supplyType;
	
	@ApiModelProperty(value = "SupplyType.quantity.value", 
			required = true, position = 1, example = "2")
    private Double quantity;
	
	@ApiModelProperty(value = "SupplyType.segment.value", 
			required = true, position = 2)
    private String segment;
}
