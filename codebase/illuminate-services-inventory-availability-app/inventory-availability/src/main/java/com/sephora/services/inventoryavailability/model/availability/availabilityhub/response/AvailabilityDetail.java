
package com.sephora.services.inventoryavailability.model.availability.availabilityhub.response;

import lombok.*;

import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@ToString(exclude = {"segment"})
@NoArgsConstructor
public class AvailabilityDetail {

    private String segment;
    private Double atp;
    private String atpStatus;
    private List<AvailabilityByLocation> availabilityByLocations = null;

}
