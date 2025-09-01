
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
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(Include.NON_NULL)
public class AvailabilityByProduct {
	
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.productId.value}", required = true, position = 0, example = "12345")
    public String productId;
    public Boolean onhold;
    @ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.availabilityDetails.value}", required = true, position = 0)
    public AvailabilityDetail availabilityDetails;

}
