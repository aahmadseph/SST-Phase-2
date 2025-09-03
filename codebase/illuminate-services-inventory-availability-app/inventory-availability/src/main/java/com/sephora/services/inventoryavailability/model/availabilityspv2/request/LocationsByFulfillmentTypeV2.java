package com.sephora.services.inventoryavailability.model.availabilityspv2.request;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.inventory.validation.GetAvailabilityFSLocationValid;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.FulfillmentTypeEnum;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.LocationsByFulfillmentType;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
//@GetAvailabilityFSLocationValid
@ToString
public class LocationsByFulfillmentTypeV2 {
	@NotEmpty
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.LocationsByFulfillmentType.fulfillmentType.value}",
			required = true, position = 0, example = "PICK", allowableValues = "SHIP, SHIPTOHOME, PICK, SAMEDAY")
	@Enum(enumClass = FulfillmentTypeEnum.class, required = true, message = "FulfillmentType must be SHIP, SHIPTOHOME, PICK or SAMEDAY")
	private String fulfillmentType;

	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.LocationsByFulfillmentType.locations.value}", required = true, position = 0, example = "[\"0058\", \"0412\"]")
	private List<String> locations;

	private List<String> productsByLocation;
}
