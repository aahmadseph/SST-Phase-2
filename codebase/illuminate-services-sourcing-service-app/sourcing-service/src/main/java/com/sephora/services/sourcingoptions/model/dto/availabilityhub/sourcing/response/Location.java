
package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response;

import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
public class Location {
    private String locationId;
    private String locationType;
    private Integer fulfillQuantity;
    private String locationLocale;
    private boolean delayFlag;

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
    public Integer getFulfillQuantity() {
        return fulfillQuantity;
    }
    public void setFulfillQuantity(Integer fulfillQuantity) {
        this.fulfillQuantity = fulfillQuantity;
    }
	public String getLocationLocale() {
		return locationLocale;
	}
	public void setLocationLocale(String locationLocale) {
		this.locationLocale = locationLocale;
	}
	public boolean isDelayFlag() {
		return delayFlag;
	}
	public void setDelayFlag(boolean delayFlag) {
		this.delayFlag = delayFlag;
	}
    
}
