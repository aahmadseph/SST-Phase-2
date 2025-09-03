package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;

import java.util.Map;
@ToString
public class PromiseDate {
    private String lineId;
    @JsonProperty("customerFulfillmentDates")
    private Map<String, DateInfo> customerFulfillmentDates;

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public void setCustomerFulfillmentDates(Map<String, DateInfo> customerFulfillmentDates) {
        this.customerFulfillmentDates = customerFulfillmentDates;
    }

    public Map<String, DateInfo> getCustomerFulfillmentDates() {
        return customerFulfillmentDates;
    }
}
