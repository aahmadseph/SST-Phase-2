
package com.sephora.services.inventory.model.locationavailability.redis;

import java.io.Serializable;
import java.util.List;
import javax.annotation.Generated;

public class LocationAvailabilityRedisCacheDto implements Serializable {

    private String productId;
    private String locationId;
    private List<AtpByFulfillmentType> atpByFulfillmentTypes = null;

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public List<AtpByFulfillmentType> getAtpByFulfillmentTypes() {
        return atpByFulfillmentTypes;
    }

    public void setAtpByFulfillmentTypes(List<AtpByFulfillmentType> atpByFulfillmentTypes) {
        this.atpByFulfillmentTypes = atpByFulfillmentTypes;
    }

}
