package com.sephora.services.sourcingoptions.repository.cosmos;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.sephora.services.sourcingoptions.model.cosmos.ZoneMap;
import org.springframework.stereotype.Repository;

@Repository(ZoneMapRepository.ZONE_MAP_REPOSITORY)
public interface ZoneMapRepository extends CosmosRepository<ZoneMap, String>, CustomZoneMapRepository {
    String ZONE_MAP_REPOSITORY = "zoneMapRepositoryCosmos";
}