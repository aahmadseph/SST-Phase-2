
package com.sephora.services.sourcingoptions.model.availability.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityByLocation {

    private String locationId;
    private Double atp;

}
