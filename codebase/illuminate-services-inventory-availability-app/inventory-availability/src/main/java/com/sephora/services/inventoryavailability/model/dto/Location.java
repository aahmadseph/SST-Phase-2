package com.sephora.services.inventoryavailability.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Location {
	
	private String locationId;
	private String locationType = "DC";
	
	@JsonProperty(value = "locationType")
	public void setLocationType(String locationType) {
		this.locationType = locationType == null ? "DC" : locationType;
	}

}
