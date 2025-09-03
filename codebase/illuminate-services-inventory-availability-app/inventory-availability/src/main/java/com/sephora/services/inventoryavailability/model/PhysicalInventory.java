package com.sephora.services.inventoryavailability.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(includeFieldNames = false)
@NoArgsConstructor
public class PhysicalInventory {
	private String locationType;
	private List<Location> locations;
}
