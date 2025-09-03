package com.sephora.services.inventory.service.availability;

import java.util.List;
import java.util.Map;

import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.model.networkThreshold.redis.NetworkThresholdCacheDto;

public interface NetworkAvailabilityService {
	Map<String, NetworkThresholdCacheDto> getNetworkAvailability(List<String> products, String sellingChannel, List<String> priorityList);
	void setPriorityConfig(PriorityConfig priorityConfig);
}
