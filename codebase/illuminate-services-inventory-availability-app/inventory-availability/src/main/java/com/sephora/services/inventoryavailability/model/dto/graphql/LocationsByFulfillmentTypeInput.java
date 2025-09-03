package com.sephora.services.inventoryavailability.model.dto.graphql;

import com.sephora.services.inventoryavailability.model.availabilitysp.request.FulfillmentTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationsByFulfillmentTypeInput {

    private String fulfillmentType;
    private List<String> locations;
}
