//package com.sephora.services.inventoryavailability.service;
//
//import static com.sephora.platform.database.cosmosdb.utils.WhereStatements.equal;
//import static com.sephora.services.inventoryavailability.cosmos.config.cache.CacheConfig.GET_SHIP_NODE_BY_ENTERPRISE_CODE;
//import static com.sephora.services.inventoryavailability.cosmos.config.cache.CacheConfig.SHIP_NODE_CACHE_NAME;
//import static java.util.stream.Collectors.toList;
//
//import java.util.Collection;
//import java.util.List;
//import java.util.Optional;
//
//import org.apache.commons.collections4.CollectionUtils;
//import org.apache.commons.lang3.StringUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.annotation.CacheEvict;
//import org.springframework.cache.annotation.Cacheable;
//import org.springframework.cache.annotation.Caching;
//import org.springframework.stereotype.Service;
//
//import com.sephora.platform.database.cosmosdb.utils.CosmosQueryBuilder;
//import com.sephora.services.inventoryavailability.cosmos.repository.CosmosShipNodeRepository;
//import com.sephora.services.inventoryavailability.exception.NotFoundException;
//import com.sephora.services.inventoryavailability.mapping.ShipNodeMapper;
//import com.sephora.services.inventoryavailability.model.cosmos.ShipNodeStatusEnum;
//import com.sephora.services.inventoryavailability.model.cosmos.doc.ShipNode;
//import com.sephora.services.inventoryavailability.model.shipnode.ShipNodeDto;
//
//import lombok.extern.log4j.Log4j2;
//
//@Service
//@Log4j2
//public class ShipNodeService {
//
//    public static final String SHIP_NODE_NOT_FOUND_ERROR = "shipNode.notFound";
//    public static final String SHIP_NODE_WITH_ENTERPRISE_NOT_FOUND_ERROR = "shipNodeWithEnterpriseCode.notFound";
//
//    public static final String SEPARATOR = ",";
//
//    @Autowired
//    private CosmosShipNodeRepository shipNodeRepository;
//
//    @Autowired
//    private ShipNodeMapper shipNodeMapper;
//
//    @Autowired
//    private ShipNodeService self;
//
//     public void updateShipNodesStatus(List<String> shipNodeKeys, ShipNodeStatusEnum status) {
//        List<ShipNode> foundShipNodes = shipNodeRepository.findByIdIn(shipNodeKeys);
//
//        List<String> foundShipNodeKeys = foundShipNodes.stream()
//                .map(ShipNode::getId)
//                .collect(toList());
//
//        if (CollectionUtils.isEmpty(foundShipNodes)) {
//            log.error("Unable to find shipNodes={}", shipNodeKeys);
//
//            throw new NotFoundException(SHIP_NODE_NOT_FOUND_ERROR,
//                    StringUtils.join(shipNodeKeys, SEPARATOR));
//        } else if (foundShipNodes.size() < shipNodeKeys.size()) {
//            Collection<String> notFoundShipNodes = CollectionUtils.disjunction(shipNodeKeys,
//                    foundShipNodeKeys);
//
//            log.warn("Unable to find shipNodes={}", notFoundShipNodes);
//        }
//
//        foundShipNodes.forEach(shipNode -> shipNode.setStatus(status));
//
//        saveAll(foundShipNodes);
//
//        log.debug("ShipNodes={} status updated to '{}'",
//                foundShipNodeKeys, status);
//    }
//
//    private Iterable<ShipNode> saveAll(List<ShipNode> shipNodes) {
//        Iterable<ShipNode> savedShipNodes = shipNodeRepository.saveAll(shipNodes);
//        savedShipNodes.forEach(self::cacheEvict);
//        return savedShipNodes;
//    }
//
//    public List<ShipNodeDto> findAll() {
//        return shipNodeMapper.convertList(self.findAllShipNodes());
//    }
//
//    @Cacheable(cacheNames = SHIP_NODE_CACHE_NAME, key = "'id:' + #shipNodeKey", unless = "#result == null")
//    public Optional<ShipNode> getShipNodeByKey(String shipNodeKey) {
//        try {
//            return shipNodeRepository.queryDocuments(CosmosQueryBuilder.select()
//                            .whereIf(StringUtils.isNotEmpty(shipNodeKey),
//                                    () -> equal("id", shipNodeKey))
//                            .build()).stream().findFirst();
//        }catch (Exception exception){
//            log.error ("Error during retrieve shipNode by shipNodeKey {}", shipNodeKey, exception);
//        }
//        return Optional.empty();
//    }
//
//    @Cacheable(cacheNames = GET_SHIP_NODE_BY_ENTERPRISE_CODE, key = "#enterpriseCode", unless = "#result == null or #result.size()==0")
//    public List<String> findByEnterpriseCode(String enterpriseCode) {
//        return shipNodeRepository.queryDocuments(CosmosQueryBuilder.select()
//                .whereIf(enterpriseCode != null,
//                        () -> equal("enterpriseCode", enterpriseCode))
//                .build())
//                .stream().map(ShipNode::getId).collect(toList());
//    }
//
//    public List<ShipNode> findAllShipNodes() {
//        return shipNodeRepository.findAll();
//    }
//
//    @Caching(evict = {
//            @CacheEvict(cacheNames = SHIP_NODE_CACHE_NAME, key = "'id:' + #shipNode.id"),
//            @CacheEvict(cacheNames = GET_SHIP_NODE_BY_ENTERPRISE_CODE, key = "#shipNode.enterpriseCode")
//    })
//    public void cacheEvict(ShipNode shipNode) {
//        log.debug("Evict all caches for shipNode {}", shipNode);
//    }
//
//}