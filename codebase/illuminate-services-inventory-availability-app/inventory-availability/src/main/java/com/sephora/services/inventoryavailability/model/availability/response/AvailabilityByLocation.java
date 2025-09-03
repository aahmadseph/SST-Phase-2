
package com.sephora.services.inventoryavailability.model.availability.response;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityByLocation {

    private String locationId;
    @JsonIgnore
    private String atpStatus;
    private Double atp;

}
