package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.dto.ShipNodeDto;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.*;

public interface ShipNodeService {

    @CacheEvict(cacheNames = FIND_SHIP_NODE_CACHE_NAME, allEntries = true, cacheManager = SOURCING_CACHE_MANAGER)
    void updateShipNodesStatus(List<String> shipNodeNames, String shipNodeStatus);

    @Cacheable(cacheNames = FIND_SHIP_NODE_CACHE_NAME, key = "'ACTIVE'", cacheManager = SOURCING_CACHE_MANAGER, unless = "#result == null or #result.size() == 0")
    List<String> findAllActiveNodes();

    @Cacheable(cacheNames = FIND_SHIP_NODE_CACHE_NAME, cacheManager = SOURCING_CACHE_MANAGER, unless = "#result == null or #result.size() == 0")
    List<String> findAllActiveNodesByEnterpriseCode(EnterpriseCodeEnum enterpriseCode);

    List<ShipNodeDto> findAll();

    @Cacheable(cacheNames = FIND_SHIP_NODE_CACHE_NAME, cacheManager = SOURCING_CACHE_MANAGER, unless = "#result == null or #result.size() == 0")
    List<ShipNode> findAllShipNode();

    @CacheEvict(cacheNames = SHIP_NODE_CACHE_NAME, key = "'id:' + #shipNode.id", cacheManager = SOURCING_CACHE_MANAGER)
    void cacheEvict(ShipNode shipNode);

    @CachePut(cacheNames = SHIP_NODE_CACHE_NAME, key = "'id:' + #shipNode.id", cacheManager = SOURCING_CACHE_MANAGER)
    ShipNode addToCache(ShipNode shipNode);

    @Cacheable(value = GET_BY_ID_SHIP_NODE_CACHE_NAME,
            key = "#shipNode",
            cacheManager = SOURCING_CACHE_MANAGER,
            unless = "#result == null"
    )
    ShipNode getById(String shipNode);

    @Cacheable(value = GET_BY_ID_SHIP_NODE_CACHE_NAME,
            key = "#cacheKey",
            cacheManager = SOURCING_CACHE_MANAGER,
            unless = "#result == null"
    )
    List<ShipNode> getByIdIn(String cacheKey, List<String> shipNodes);

    List<ShipNode> findAllShipNodeByEnterpriseCode(EnterpriseCodeEnum enterpriseCode);

    List<ShipNode> findShipNodesIn(List<String> shipNodes) throws SourcingServiceException;

}