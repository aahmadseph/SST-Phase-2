package com.sephora.services.sourcingoptions.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Location {

    private String shipNode;
    private String dcTimeZone;
    private String shippingDate;
    private String deliveryDate;
    private Integer deliveryDateType;
    private String cutoffTimestamp;
    private Boolean delayAdded;
}
