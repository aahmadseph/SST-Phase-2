
package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response;

import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
public class OrderCutOffDate {

    @JsonProperty("min")
    private String min;

    @JsonProperty("min")
    public String getMin() {
        return min;
    }

    @JsonProperty("min")
    public void setMin(String min) {
        this.min = min;
    }

}
