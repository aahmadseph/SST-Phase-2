
package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.datesbyservice;

import javax.annotation.Generated;


public class AvailabilityInfo {

    private Double fulfillQuantity;
    private Double requestQuantity;
    private Object capacitySegment;

    public Double getFulfillQuantity() {
        return fulfillQuantity;
    }

    public void setFulfillQuantity(Double fulfillQuantity) {
        this.fulfillQuantity = fulfillQuantity;
    }

    public Double getRequestQuantity() {
        return requestQuantity;
    }

    public void setRequestQuantity(Double requestQuantity) {
        this.requestQuantity = requestQuantity;
    }

    public Object getCapacitySegment() {
        return capacitySegment;
    }

    public void setCapacitySegment(Object capacitySegment) {
        this.capacitySegment = capacitySegment;
    }

}
