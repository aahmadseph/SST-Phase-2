
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
public class SitePageAvailabilityResponse {

	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.sellingChannel.value}", required = true, position = 0, example = "SEPHORAUS")
    public String sellingChannel;
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.availabilityByProducts.value}", required = true, position = 0)
    public List<AvailabilityByProduct> availabilityByProducts;

}
