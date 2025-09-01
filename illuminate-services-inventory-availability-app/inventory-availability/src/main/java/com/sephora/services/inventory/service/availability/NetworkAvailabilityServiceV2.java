package com.sephora.services.inventory.service.availability;

import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.model.networkThreshold.redis.NetworkThresholdCacheDto;

import java.util.List;
import java.util.Map;

public interface NetworkAvailabilityServiceV2 {
	Map<String, NetworkThresholdCacheDto> getNetworkAvailability(List<String> products, String sellingChannel, List<String> priorityList);
	void setPriorityConfig(PriorityConfig priorityConfig);
}
