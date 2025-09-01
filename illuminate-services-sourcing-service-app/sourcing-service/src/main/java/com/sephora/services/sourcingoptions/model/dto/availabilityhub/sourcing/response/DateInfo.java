
package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response;

import java.util.List;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.ToString;

/*@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "locations",
    "orderCutOffDate",
    "shipDate",
    "deliveryDate"
})*/
@ToString
public class DateInfo {


    @JsonProperty("locations")
    private List<Location> locations;

    private DateTimeInfo orderCutOffDate;

    private DateTimeInfo shipDate;

    private DateTimeInfo deliveryDate;

    public DateTimeInfo getOrderCutOffDate() {
        return orderCutOffDate;
    }

    public void setOrderCutOffDate(DateTimeInfo orderCutOffDate) {
        this.orderCutOffDate = orderCutOffDate;
    }

    public DateTimeInfo getShipDate() {
        return shipDate;
    }

    public void setShipDate(DateTimeInfo shipDate) {
        this.shipDate = shipDate;
    }

    public DateTimeInfo getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(DateTimeInfo deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public List<Location> getLocations() {
        return locations;
    }

    public void setLocations(List<Location> locations) {
        this.locations = locations;
    }
}
