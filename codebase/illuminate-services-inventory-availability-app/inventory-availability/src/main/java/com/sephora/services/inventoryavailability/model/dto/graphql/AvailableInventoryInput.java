package com.sephora.services.inventoryavailability.model.dto.graphql;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class AvailableInventoryInput {

    private String currentDateTime;
    private Boolean evaluateCapacity;
    private Boolean evaluateNetworkAvail;
    private List<LocationsByFulfillmentTypeInput> locationsByFulfillmentType;
    private List<String> products;
    private String requestOrigin;
    private String sellingChannel;
}
