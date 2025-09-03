package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.ZipCodeDetails;
import com.sephora.services.sourcingoptions.model.dto.LocationsByPriorityInput;
import com.sephora.services.sourcingoptions.model.dto.LocationsByPriorityResponse;
import org.springframework.cache.annotation.CacheEvict;

import java.util.List;

import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.*;

public interface LocationPrioritiesService {
    @CacheEvict(cacheNames = LOCATION_PRIORITY_CACHE_NAME, allEntries = true, cacheManager = SOURCING_CACHE_MANAGER)
    void persistLocationPriorities(List<ZipCodeDetails> zoneMapDocuments, EnterpriseCodeEnum enterpriseCode);

//    @Cacheable(cacheNames = LOCATION_PRIORITY_CACHE_NAME,  key = "#input.country.name() + '_' + #input.zipCode", cacheManager = SOURCING_CACHE_MANAGER, unless = "#result == null")
    LocationsByPriorityResponse getLocationPriorities(LocationsByPriorityInput input);
}
