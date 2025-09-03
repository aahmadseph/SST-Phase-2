
package com.sephora.services.inventoryavailability.model.availabilitysp.response;

import java.util.ArrayList;
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
public class AvailabilityDetail {
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.AvailabilityDetail.atp.value}", required = true, position = 0, example = "5")
    private Double atp;
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.AvailabilityDetail.atpStatus.value}", required = true, position = 0, example = "INSTOCK")
    private String atpStatus;
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityResponse.AvailabilityByProduct.AvailabilityDetail.availabilityByFT.value}", required = true, position = 0)
    private List<AvailabilityByFT> availabilityByFT = null;
    

}
