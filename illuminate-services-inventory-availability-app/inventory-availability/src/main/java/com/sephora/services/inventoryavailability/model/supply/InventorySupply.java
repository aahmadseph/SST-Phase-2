package com.sephora.services.inventoryavailability.model.supply;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sephora.services.inventoryavailability.model.Location;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ApiModel(value = "InventorySupply")
@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString
@NoArgsConstructor
public class InventorySupply {
	@ApiModelProperty(value = "InventorySupply.location.value", 
			required = true, position = 0)
	@JsonProperty("locations")
	private List<Location> location;

}
