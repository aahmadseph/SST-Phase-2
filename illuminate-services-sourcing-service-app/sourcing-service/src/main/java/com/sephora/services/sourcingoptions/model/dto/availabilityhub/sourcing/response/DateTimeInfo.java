package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.ToString;

@ToString
public class DateTimeInfo {
    /*private String min;*/
    private String max;


    /*public String getMin() {
        return min;
    }

    public void setMin(String min) {
        this.min = min;
    }*/

    @JsonProperty("max")
    public String getMax() {
        return max;
    }

    @JsonProperty("max")
    public void setMax(String max) {
        this.max = max;
    }
}
