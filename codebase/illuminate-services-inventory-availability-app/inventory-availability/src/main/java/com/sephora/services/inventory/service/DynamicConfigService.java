package com.sephora.services.inventory.service;

import com.sephora.services.common.dynamicconfig.model.DynamicConfigDto;
import org.springframework.cache.annotation.CacheEvict;
import reactor.core.publisher.Flux;


import static com.sephora.services.inventoryavailability.cosmos.config.cache.CacheConfig.DYNAMIC_CONFIG_CACHE_NAME;

import java.util.List;

public interface DynamicConfigService {
	List<DynamicConfigDto> getAll();
	DynamicConfigDto get(String appName, String configType);
	DynamicConfigDto create(DynamicConfigDto config);
	DynamicConfigDto save(DynamicConfigDto config);
	void delete(String dynamicConfigId);
	
	@CacheEvict(value = DYNAMIC_CONFIG_CACHE_NAME,
            key = "#key.appName + '_' + #key.configType",
            cacheManager = "cache2kCacheManager"
    )
    void evictCache(DynamicConfigDto key);
    
}
