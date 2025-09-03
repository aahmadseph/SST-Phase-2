
package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.datesbyservice;

import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.*;
import lombok.ToString;

import javax.annotation.Generated;
import java.util.Map;

@ToString
public class DatesByServicePromiseDate {

    private String locationId;
    private String locationType;
    private Double fulfillmentScore;
    private String fulfillmentType;
    private String fulfillmentService;
    private Map<String, AvailabilityInfo> cartItems;
    private DateTimeInfo shipDate;
    private DateTimeInfo deliveryDate;
    private DateTimeInfo orderCutOffDate;
    private DateTimeInfo releaseDate;
    private String reservationDate;
    private DateTimeInfo capacityDate;
    private Integer shipmentId;

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getLocationType() {
        return locationType;
    }

    public void setLocationType(String locationType) {
        this.locationType = locationType;
    }

    public Double getFulfillmentScore() {
        return fulfillmentScore;
    }

    public void setFulfillmentScore(Double fulfillmentScore) {
        this.fulfillmentScore = fulfillmentScore;
    }

    public String getFulfillmentType() {
        return fulfillmentType;
    }

    public void setFulfillmentType(String fulfillmentType) {
        this.fulfillmentType = fulfillmentType;
    }

    public String getFulfillmentService() {
        return fulfillmentService;
    }

    public void setFulfillmentService(String fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }

    public Map<String, AvailabilityInfo> getCartItems() {
        return cartItems;
    }

    public void setCartItems(Map<String, AvailabilityInfo> cartItems) {
        this.cartItems = cartItems;
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

    public DateTimeInfo getOrderCutOffDate() {
        return orderCutOffDate;
    }

    public void setOrderCutOffDate(DateTimeInfo orderCutOffDate) {
        this.orderCutOffDate = orderCutOffDate;
    }

    public DateTimeInfo getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(DateTimeInfo releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(String reservationDate) {
        this.reservationDate = reservationDate;
    }

    public DateTimeInfo getCapacityDate() {
        return capacityDate;
    }

    public void setCapacityDate(DateTimeInfo capacityDate) {
        this.capacityDate = capacityDate;
    }

    public Integer getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(Integer shipmentId) {
        this.shipmentId = shipmentId;
    }
}
