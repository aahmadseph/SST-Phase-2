
package com.sephora.services.sourcingoptions.model.availability.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityByFulfillmentType {

    private String fulfillmentType;
    private List<AvailabilityDetail> availabilityDetails = null;

}
