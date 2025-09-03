package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig;
import com.sephora.services.common.dynamicconfig.model.DynamicConfigDto;
import org.springframework.cache.annotation.CacheEvict;

import java.util.List;

import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.SOURCING_CACHE_MANAGER;

public interface DynamicConfigService {
    DynamicConfigDto get(String appName, String configType);
    DynamicConfigDto create(DynamicConfigDto config);
    DynamicConfigDto save(DynamicConfigDto config);
    List<DynamicConfigDto> getAll();
    void delete(String dynamicConfigId);
}
