
package com.sephora.services.inventoryavailability.model.availabilitysp.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(Include.NON_NULL)
public class AvailabilityByLocation {
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.AvailabilityDetail.AvailabilityByFT.AvailabilityByLocation.location.value}", required = true, position = 0, example = "0508")
    private String location;
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.AvailabilityDetail.AvailabilityByFT.AvailabilityByLocation.atp.value}", required = true, position = 0, example = "10")
    private Double atp;
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.AvailabilityDetail.AvailabilityByFT.AvailabilityByLocation.atpStatus.value}", required = true, position = 0, example = "INSTOCK")
    private String atpStatus;

}
