package com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReadClusterAvailabilityResponse {
	private List<BulkResponse> bulkResponse; 
}
