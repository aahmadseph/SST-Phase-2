package com.sephora.services.inventoryavailability.config;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestProduct;

import lombok.Data;

@Component
@ConfigurationProperties(prefix = "availability.cache")
@Data
public class GetAvailabilityConfig {
	
	private boolean enabled;
	private String cacheName;
	private List<PriorityConfig> priorityConfig;
	@Value("${availability.cache.async.batchSize}")
	private int batchSize;

	public String  getFirtPriority(AvailabilityRequestDto request) {
		String fulfillmentType = getFulfillmentType(request);
		PriorityConfig pc = getPriorityConfig(fulfillmentType, request.getRequestOrigin());
		return null != pc ? pc.getPriorityOrder().stream().findFirst().orElse(null) : null;
	}
	
	public PriorityConfig getPriorityConfig(AvailabilityRequestDto request) {
		return getPriorityConfig(getFulfillmentType(request), request.getRequestOrigin());
	}
	
	public PriorityConfig getPriorityConfig(String fulfillmentType, final String requestOrigin) {
		PriorityConfig pc = priorityConfig.stream()
				.filter(priorityConfigEntry -> fulfillmentType.equals(priorityConfigEntry.getFulfillmentType())
						&& priorityConfigEntry.getRequestOrigin().contains(requestOrigin.toUpperCase()))
				.findAny().orElse(null);		
		return pc;
	}
	
	private String getFulfillmentType(AvailabilityRequestDto request) {
		if(null != request.getProducts() && !request.getProducts().isEmpty()) {
			Optional<AvailabilityRequestProduct> productOpt = request.getProducts().stream().findAny();
			if(productOpt.isPresent()) {
				return productOpt.get().getFulfillmentType();
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
	
}
