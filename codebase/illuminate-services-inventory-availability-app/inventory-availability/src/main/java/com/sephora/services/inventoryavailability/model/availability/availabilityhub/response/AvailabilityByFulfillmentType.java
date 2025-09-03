
package com.sephora.services.inventoryavailability.model.availability.availabilityhub.response;

import lombok.*;

import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AvailabilityByFulfillmentType {

    private String fulfillmentType;
    private List<AvailabilityDetail> availabilityDetails = null;

}
