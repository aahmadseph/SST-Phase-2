
package com.sephora.services.inventoryavailability.model.availability.availabilityhub.response;

import lombok.*;

import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude={"uom", "gtin"})
public class AvailabilityByProduct {

    private String productId;
    private String uom;
    private String gtin;
    private List<AvailabilityByFulfillmentType> availabilityByFulfillmentTypes = null;


}
