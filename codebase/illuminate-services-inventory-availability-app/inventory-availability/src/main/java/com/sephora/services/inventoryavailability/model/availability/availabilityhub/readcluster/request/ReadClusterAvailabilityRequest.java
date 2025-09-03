package com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReadClusterAvailabilityRequest {
	private List<AggregatedKey> aggregatedKeys;
}
