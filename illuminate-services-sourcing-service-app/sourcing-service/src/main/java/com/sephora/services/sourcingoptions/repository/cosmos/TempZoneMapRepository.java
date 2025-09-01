package com.sephora.services.sourcingoptions.repository.cosmos;

import java.util.List;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.stereotype.Repository;

import com.sephora.services.sourcingoptions.model.cosmos.TempZoneMap;

@Repository(TempZoneMapRepository.TEMP_ZONE_MAP_REPOSITORY)
public interface TempZoneMapRepository extends CosmosRepository<TempZoneMap, String>, CustomZoneMapRepository {
	 String TEMP_ZONE_MAP_REPOSITORY = "tempZoneMapRepositoryCosmos";
	 
	 public List<TempZoneMap> findByEnterpriseCodeAndStatus(String enterpriseCode, String status);
}
