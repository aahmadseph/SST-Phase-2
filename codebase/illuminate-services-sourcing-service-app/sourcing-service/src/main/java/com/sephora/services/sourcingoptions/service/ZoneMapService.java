package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.BatchOperationResultBean;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMappingFilterDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapsDto;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import javax.validation.constraints.NotNull;
import java.util.List;

import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.GET_NODES_PRIORITY_CACHE_NAME;
import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.SOURCING_CACHE_MANAGER;

public interface ZoneMapService {

    List<ZoneMapDto> getZoneMap(ZoneMappingFilterDto input) throws SourcingServiceException;

    @CacheEvict(cacheNames = GET_NODES_PRIORITY_CACHE_NAME, allEntries = true, cacheManager = SOURCING_CACHE_MANAGER)
    BatchOperationResultBean uploadZoneMaps(ZoneMapsDto zoneMapsDto) throws SourcingServiceException;

    @CacheEvict(cacheNames = GET_NODES_PRIORITY_CACHE_NAME, allEntries = true, cacheManager = SOURCING_CACHE_MANAGER)
    void deleteZoneMaps(ZoneMappingFilterDto zoneMappingFilterDto) throws SourcingServiceException;

    @Cacheable(cacheNames = GET_NODES_PRIORITY_CACHE_NAME,
               key = "#enterpriseCode + '__' + #zipCode",
               cacheManager = SOURCING_CACHE_MANAGER, unless = "#result == null or #result.size() == 0")
    List<String> getPriorityByEnterpriseCodeAndZipCode(String enterpriseCode, String zipCode);
}
