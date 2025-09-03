
package com.sephora.services.inventoryavailability.model.availabilitysp.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.sephora.services.common.inventory.model.BaseDTO;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude={"requestOrigin", "evaluateCapacity", "requestOrigin", "evaluateCapacity", "evaluateNetworkAvail" })
public class SitePageAvailabilityDto extends BaseDTO {
	@Valid
	@NotNull
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.products.value}", dataType = "array", required = true, position = 0, example = "[\"12345\",\"67890\"]")
	private List<String> products;
	
	@NotEmpty
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.sellingChannel.value}", required = true, position = 0, example = "SEPHORAUS")
    private String sellingChannel;
	
	@NotEmpty
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.requestOrigin.value}", required = true, position = 0, example = "Default")
    private String requestOrigin;
	
	@NotEmpty
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.evaluateCapacity.value}", required = false, position = 0, example = "false")
    private String evaluateCapacity;
    
    @NotEmpty
    @NotEmpty
	@ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.currentDateTime.value}", required = true, position = 0, example = "2021-11-17T02:12:48.926-07:00")
    public String currentDateTime;
    
    @ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.evaluateNetworkAvail.value}", required = false, position = 0, example = "false")
    private boolean evaluateNetworkAvail;
    
    @NotNull
    @NotEmpty
    @ApiModelProperty(value = "${GetAvailableInventory.SitePageAvailabilityDto.locationsByFulfillmentType.value}", required = true, position = 0)
    private List<@Valid LocationsByFulfillmentType> locationsByFulfillmentType;

}
