package com.sephora.services.inventoryavailability.model;

import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ApiModel(value = "Location")
@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(exclude = {"supplyTypes"})
@NoArgsConstructor
public class Location {
	@ApiModelProperty(value = "Location.locationId.value", 
			required = true, position = 0, example = "0801")
	private String locationId;
	
	@ApiModelProperty(value = "Location.supplyTypes.value", 
			required = true, position = 1)
	private List<SupplyType> supplyTypes;
}
