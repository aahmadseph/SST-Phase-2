package com.sephora.services.sourcingoptions.model.dto.promisedate;

import lombok.Data;

@Data
public class PromiseDateResponseDto {
    /*"carrierServiceCode": "12",
            "shipNode": "0801",
            "dcTimeZone": "-06:00",
            "shippingDate": "2021-03-26T23:59:00-06:00",
            "deliveryDate": "2021-04-01T23:59:00-06:00",
            "deliveryDateType": 1,
            "cutoffTimestamp": "2021-03-24T14:59:00-06:00",
            "delayAdded": true*/
    private String carrierServiceCode;
    private String shipNode;
    private String dcTimeZone;
    private String shippingDate;
    private String deliveryDate;
    private Integer deliveryDateType;
    private String cutoffTimestamp;
    private Boolean delayAdded;
}
