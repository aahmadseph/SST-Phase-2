package com.sephora.services.inventoryavailability.model.availabilitysp.request;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.inventory.validation.GetAvailabilityFSLocationValid;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto.SitePageAvailabilityDtoBuilder;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@GetAvailabilityFSLocationValid
@ToString
public class LocationsByFulfillmentType {
	@NotEmpty
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.LocationsByFulfillmentType.fulfillmentType.value}", 
	required = true, position = 0, example = "PICK", allowableValues = "SHIP, SHIPTOHOME, PICK, SAMEDAY")	   
	@Enum(enumClass = FulfillmentTypeEnum.class, required = true, message = "FulfillmentType must be SHIP, SHIPTOHOME, PICK or SAMEDAY")
	private String fulfillmentType;
	
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.LocationsByFulfillmentType.locations.value}", required = true, position = 0, example = "[\"0058\", \"0412\"]")
	private List<String> locations;
}
