
package com.sephora.services.inventoryavailability.model.availability.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityByProduct {

    private String productId;
    private String uom;
    private List<AvailabilityByFulfillmentType> availabilityByFulfillmentTypes = null;


}
