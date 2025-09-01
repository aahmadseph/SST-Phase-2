package com.sephora.services.inventoryavailability.model.availabilitysp.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(Include.NON_NULL)
public class AvailabilityByFT {
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.AvailabilityDetail.AvailabilityByFT.fulfillmentType.value}", required = true, position = 0, example = "PICK")
	private String fulfillmentType;
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.AvailabilityDetail.AvailabilityByFT.locations.value}", required = true, position = 0)
	private List<AvailabilityByLocation> locations = null;
}
