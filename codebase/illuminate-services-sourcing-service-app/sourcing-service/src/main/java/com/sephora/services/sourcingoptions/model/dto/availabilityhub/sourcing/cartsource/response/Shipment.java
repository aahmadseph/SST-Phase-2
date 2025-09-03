package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@ToString
public class Shipment {
	private String locationId;
    private String locationType;
    private String locationLocale;
    private Double fulfillmentScore;
    private String fulfillmentType;
    private String fulfillmentService;
    private Map<String, CartItem> cartItems;
    private DateTimeInfo shipDate;
    private DateTimeInfo deliveryDate;
    private DateTimeInfo orderCutOffDate;
    private DateTimeInfo releaseDate;
    private String reservationDate;
    private DateTimeInfo capacityDate;
    private Integer shipmentId;
    
}
