
package com.sephora.services.inventoryavailability.model.availability.request;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;


@Data
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("GetAvailabilityRequestLocation")
public class AvailabilityRequestLocation {
    @NotEmpty(message="locationId property should not be null or empty")
    private String locationId;
}
