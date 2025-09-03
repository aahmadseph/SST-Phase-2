
package com.sephora.services.inventoryavailability.model.availability.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityRequestProduct {
    @NotEmpty(message = "productId property should not be null or empty")
    private String productId;
    @NotEmpty(message = "uom property should not be null or empty")
    private String uom;
    private String fulfillmentType;
    @NotNull(message = "locations property should not be null")
    @Size(min=1, message = "locations should have at least one element")
    private List< @Valid AvailabilityRequestLocation> locations = null;

}
