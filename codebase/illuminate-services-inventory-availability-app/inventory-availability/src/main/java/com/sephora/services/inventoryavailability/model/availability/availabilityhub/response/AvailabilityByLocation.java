
package com.sephora.services.inventoryavailability.model.availability.availabilityhub.response;

import lombok.*;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"locationType"}, includeFieldNames = false)
public class AvailabilityByLocation {

    private String locationId;
    private String locationType;
    private String atpStatus;
    private Double atp;

}
