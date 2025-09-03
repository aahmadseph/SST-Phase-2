/*
package com.sephora.services.inventory.cosmos.pds.repository;

import com.microsoft.azure.spring.data.cosmosdb.repository.CosmosRepository;
import com.sephora.services.inventory.model.cosmos.dynamicconfig.DynamicConfigDto;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(DynamicConfigRepository.DYNAMIC_CONFIG_REPOSITORY)
public interface DynamicConfigRepository extends CosmosRepository<DynamicConfigDto, String> {
    String DYNAMIC_CONFIG_REPOSITORY = "dynamicConfigRespository";

    List<DynamicConfigDto> findByAppNameAndConfigType(String appName, String configType);
}
*/
