package com.sephora.services.sourcingoptions.service.impl;

import com.sephora.services.sourcingoptions.config.CosmosConfig;
import com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig;
import com.sephora.services.sourcingoptions.exception.NotFoundException;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.mapper.SourcingShipNodeMapper;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.ShipNodeStatusEnum;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.dto.ShipNodeDto;
import com.sephora.services.sourcingoptions.repository.cosmos.ShipNodeRepository;
import com.sephora.services.sourcingoptions.service.ShipNodeService;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.IterableUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.GET_BY_ID_SHIP_NODE_CACHE_NAME;
import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.SOURCING_CACHE_MANAGER;
import static java.util.stream.Collectors.toList;

@Service
@Log4j2
public class ShipNodeServiceImpl implements ShipNodeService {

    public static final String SEPARATOR = ",";
    public static final String SHIP_NODE_NOT_FOUND_ERROR = "shipNode.notFound";

    @Autowired(required = false)
    private ShipNodeRepository shipNodeRepository;

    @Autowired
    private SourcingShipNodeMapper shipNodeMapper;

    @Autowired
    private ShipNodeService self;

    @Override
    public void updateShipNodesStatus(List<String> shipNodeKeys, String status) {
        List<ShipNode> foundShipNodes = shipNodeRepository.findByIdIn(shipNodeKeys);

        List<String> foundShipNodeKeys = foundShipNodes.stream()
                .map(ShipNode::getId)
                .collect(Collectors.toList());

        if (CollectionUtils.isEmpty(foundShipNodes)) {
            log.error("Unable to find shipNodes={}", shipNodeKeys);

            throw new NotFoundException(SHIP_NODE_NOT_FOUND_ERROR,
                    StringUtils.join(shipNodeKeys, SEPARATOR));
        } else if (foundShipNodes.size() < shipNodeKeys.size()) {
            Collection<String> notFoundShipNodes = CollectionUtils.disjunction(shipNodeKeys,
                    foundShipNodeKeys);

            log.warn("shipNodes={} status will not be updated to {} as they are not found", notFoundShipNodes, status);
        }

        foundShipNodes.forEach(shipNode -> shipNode.setStatus(status));

        saveAll(foundShipNodes);

        log.info("ShipNodes={} status updated to '{}'",
                foundShipNodeKeys, status);
    }

    private void saveAll(List<ShipNode> shipNodes) {
        Iterable<ShipNode> savedShipNodes = shipNodeRepository.saveAll(shipNodes);
        savedShipNodes.forEach(self::cacheEvict);
    }

    public List<String> findAllActiveNodes() {
        return addToCache(shipNodeRepository.findByStatus(ShipNodeStatusEnum.ACTIVE))
                .stream()
                .map(ShipNode::getId)
                .collect(toList());
    }

    public List<String> findAllActiveNodesByEnterpriseCode(EnterpriseCodeEnum enterpriseCode) {
        return addToCache(shipNodeRepository.findByStatusAndEnterpriseCode(ShipNodeStatusEnum.ACTIVE, enterpriseCode))
                .stream()
                .map(ShipNode::getId)
                .collect(toList());
    }

    public List<ShipNodeDto> findAll() {
        return shipNodeMapper.convertList(findAllShipNode());
    }

    public List<ShipNode> findAllShipNode() {
        return addToCache(IterableUtils.toList(shipNodeRepository.findAll()));
    }

    public void cacheEvict(ShipNode shipNode) {
        log.debug("Evict all caches for shipNode {}", shipNode);
    }

    @Override
    public ShipNode addToCache(ShipNode shipNode) {
        log.debug("Add shipNode {} to cache", shipNode);
        return shipNode;
    }

    private List<ShipNode> addToCache(List<ShipNode> shipNodeList) {
        shipNodeList.forEach(self::addToCache);
        return shipNodeList;
    }

	@Override
	public List<ShipNode> findAllShipNodeByEnterpriseCode(EnterpriseCodeEnum enterpriseCode) {
		return addToCache(IterableUtils.toList(shipNodeRepository.findByEnterpriseCode(enterpriseCode)));
	}


	public ShipNode getById(String shipNode){

        Optional<ShipNode> shipNodeOptional = shipNodeRepository.findById(shipNode);
        if(shipNodeOptional.isPresent()){
            ShipNode shipNodeObj = shipNodeOptional.get();
            //self.addToCache(shipNodeObj);
            return shipNodeObj;
        }
        return null;
    }

    public List<ShipNode> getByIdIn(String cacheKey, List<String> shipNodes){
        return shipNodeRepository.findByIdIn(shipNodes);
    }

    @Override
    public List<ShipNode> findShipNodesIn(List<String> shipNodes) throws SourcingServiceException {
        try {
            // Use self for get value from cache if exist
            List<ShipNode> shipNodeList = shipNodes.stream().map(shipNodeStr -> self.getById(shipNodeStr))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            /*shipNodes.sort(String::compareTo);
            String cacheKey = shipNodes.stream().map(Object::toString).collect(Collectors.joining("_"));
            List<ShipNode> shipNodeList = self.getByIdIn(cacheKey, shipNodes);*/
            //addToCache(shipNodeList);
            return shipNodeList;
        } catch (Exception e) {
            String shipNodeString = shipNodes.stream().map(Object::toString).collect(Collectors.joining(","));
            log.error(
                    "Error occurred while trying to get shipNodes by shipNodes={}",
                    shipNodeString, e);
            throw new SourcingServiceException(e);
        }
    }

}
