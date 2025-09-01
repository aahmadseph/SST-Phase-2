package com.sephora.services.inventoryavailability.model.dto;

import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Builder
public class AvailabilityResponse {
    private String orgId;

    private String sellingChannel;

    private String transactionType;
    
    private List<Map<String, Object>> availabilityByProducts;

	public AvailabilityResponse(String orgId, String sellingChannel, String transactionType,
			List<Map<String, Object>> availabilityByProducts) {
		super();
		this.orgId = orgId;
		this.sellingChannel = sellingChannel;
		this.transactionType = transactionType;
		this.availabilityByProducts = availabilityByProducts;
	}
    
    
}
