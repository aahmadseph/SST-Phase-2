package com.sephora.services.inventory.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.common.dynamicconfig.DynamicConfigConstants;
import com.sephora.services.common.service.CommonRedisCacheWarmUpService;
import com.sephora.services.inventory.exception.NotFoundException;
import com.sephora.services.inventory.model.cache.ShipNodeStatusEnum;
import com.sephora.services.inventory.model.cache.ShipNodeCache;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.utils.AvailabilityUtils;

import lombok.extern.log4j.Log4j2;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.sephora.services.inventory.service.InventoryShipNodeService.SEPARATOR;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.CACHE_KEY;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.CACHE_KEY_SEPARATOR;
import static com.sephora.services.inventoryavailability.utils.AvailabilityUtils.storageLocationPath;
import static java.util.stream.Collectors.toList;

import java.io.File;

@Service
@Log4j2
public class InventoryShipNodeCacheService {
   
    public static final String SHIP_NODE_NOT_FOUND_ERROR = "shipNode.notFound";
    
    @Autowired
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;
    
    @Autowired
    private ObjectMapper mapper;

    @Value("${cacheWarmup.baseLocation}")
    private String folderBaseLocation;
    
    @Autowired
 	private CommonRedisCacheWarmUpService redisCacheWarmUpService;
    
    public void updateShipNodesStatus(List<String> shipNodeCacheKeys, ShipNodeStatusEnum status) {
		List<String> foundShipNodeKeys = null;
		log.debug("updating ShipNodes Status in RedisCache with key ={}", shipNodeCacheKeys);
		List<ShipNodeCache> foundShipCacheNodes = getShipNodesFromCache(shipNodeCacheKeys);
		log.debug("getting ShipNodesFromCache from RedisCache ={}", foundShipCacheNodes);
		
		if (CollectionUtils.isEmpty(foundShipCacheNodes)) {
			log.error("Unable to find shipNodes={}", shipNodeCacheKeys);
			throw new NotFoundException(SHIP_NODE_NOT_FOUND_ERROR, StringUtils.join(shipNodeCacheKeys, SEPARATOR));
		} else if (foundShipCacheNodes.size() < shipNodeCacheKeys.size()) {
			foundShipNodeKeys = foundShipCacheNodes.stream().map(shipNodeCache -> shipNodeCache.getId())
					.collect(toList());
			Collection<String> notFoundShipNodes = CollectionUtils.disjunction(shipNodeCacheKeys, foundShipNodeKeys);

			log.warn("Unable to find shipNodes={}", notFoundShipNodes);
		}
		LocalDateTime localDateTime = LocalDateTime.now();
		String formattedUpDateTime = localDateTime.format(AvailabilityConstants.DTF_YYYY_MM_DDTHH_MM_SS_SSS);
		foundShipCacheNodes.forEach(shipNode -> {
			shipNode.setStatus(status);
			shipNode.setUpdateTime(formattedUpDateTime);
		});

		saveAll(foundShipCacheNodes);

		log.debug("ShipNodes={} status updated to '{}'", foundShipNodeKeys, status);
    }
    
    public List<ShipNodeCache> getShipNodesFromCache(List<String> shipNodeKeys) {
        final AtomicInteger counter = new AtomicInteger();
        shipNodeKeys = shipNodeKeys.stream().map(key -> createShipNodeCacheKey(key)).collect(toList());
        Collection<List<String>> keyBatches = shipNodeKeys.stream()
                .collect(Collectors.groupingBy(it -> counter.getAndIncrement() / 10)).values();
        List<ShipNodeCache> shipNodesList = new ArrayList<>();
        List<String> shipNodesInCacheKeyList = new ArrayList<>();
        List<String> shipNodesNotContainsKeyList = new ArrayList<>();
        
        for(List<String> keys : keyBatches) {
            long startFetchInv = System.currentTimeMillis();
            List<Object> cacheShipNodes = invRedisTemplate.opsForValue().multiGet(keys);
            for(Object shipNode : cacheShipNodes) {
                if(Objects.nonNull(shipNode)) {
                    ShipNodeCache shipNodeCache = (ShipNodeCache) shipNode;
                    shipNodesList.add(shipNodeCache);
                    shipNodesInCacheKeyList.add(CACHE_KEY+CACHE_KEY_SEPARATOR+shipNodeCache.getId());
                }
            }
            for(String shipNodeKey: shipNodeKeys) {
                if (!shipNodesInCacheKeyList.contains(shipNodeKey)){
                    shipNodesNotContainsKeyList.add(shipNodeKey);
                    log.info("shipNodesNotContains in Cache KeyList: {}",shipNodesNotContainsKeyList);
                }
            }
            List<ShipNodeCache> shipNodesFromStorage=getShipNodesFromStorageLocation(shipNodesNotContainsKeyList);
            shipNodesList.addAll(shipNodesFromStorage);
            log.debug("Time taken for getting ship nodes: {}, Number of key: {}", System.currentTimeMillis() - startFetchInv, shipNodesList.size());
        }
        return shipNodesList;
    }
    private Iterable<ShipNodeCache> saveAll(List<ShipNodeCache> shipNodesCache) {
        long startFetchInv = System.currentTimeMillis();
        shipNodesCache.forEach(shipNode -> {
            String cacheKey = createShipNodeCacheKey(shipNode.getId());
            invRedisTemplate.opsForValue().set(cacheKey, shipNode);
            updateShipNodeFile(cacheKey,shipNode);
        });
        log.debug("Time taken for saving the status in the cache: {}, Number of key: {}", System.currentTimeMillis() - startFetchInv, shipNodesCache.size());
        log.info("saved status in RedisCache  ={}", shipNodesCache);
        return shipNodesCache;
    }

	public void updateShipNodeFile(String cacheKey, ShipNodeCache shipNodeCache) {

		File shipNodeFile = storageLocationPath(folderBaseLocation, cacheKey);
		log.debug("absolute path of file :{}", shipNodeFile.getAbsolutePath());
		AvailabilityUtils.writeShipNodeDataToFile(mapper, shipNodeCache, shipNodeFile);
		log.info("successfully updated cache files in class path: {}", shipNodeFile);
	}

    
    private String createShipNodeCacheKey( String key) {
              return CACHE_KEY+CACHE_KEY_SEPARATOR+key;
    }

    public List<ShipNodeCache> getShipNodesFromStorageLocation(List<String> shipNodeKeys) {
		List<ShipNodeCache> shipNodesList = new ArrayList<>();
		try {
			for (String shipNodeFileName : shipNodeKeys) {
				long startFetchInv = System.currentTimeMillis();
				ShipNodeCache fileShipNodeCache = getShipNodeFromStorageLocation(shipNodeFileName);
				if (Objects.nonNull(fileShipNodeCache)) {
					shipNodesList.add(fileShipNodeCache);
				}
				log.info("getShipNodesFromStorageLocation Created shipNode Cache from StorageLocation for : {}", shipNodeFileName);
				log.debug("Time taken for getting ship nodes from Storage Location: {}, Number of key: {}",
						System.currentTimeMillis() - startFetchInv, shipNodesList.size());
			}
		} catch (Exception exc) {
			log.error("An exception occurred while getting ShipNodes From Storage Location" + exc);
		}
		return shipNodesList;
    }

    

    public ShipNodeCache getShipNodeFromStorageLocation(String shipNodeKey) {
        ShipNodeCache fileShipNodeCache = null;
        try {
            fileShipNodeCache = readingShipNodeDataFromFile(shipNodeKey);
            if (Objects.nonNull(fileShipNodeCache)) {
                invRedisTemplate.opsForValue().set(shipNodeKey, fileShipNodeCache);
            }
            log.info("Created shipNode Cache from Storage Location for : {}", shipNodeKey);
        } catch (JsonProcessingException ex) {
        	log.error("An exception occurred while getting ShipNodes From Storage Location" + ex);
        } catch (Exception exc) {
        	log.error("An exception occurred while getting ShipNodes From Storage Location" + exc);
        }
        return fileShipNodeCache;
    }

    private ShipNodeCache readingShipNodeDataFromFile(String shipNodeKey) throws JsonProcessingException {
		ShipNodeCache fileShipNodeCache = null;
		File file = storageLocationPath(folderBaseLocation, shipNodeKey);
		String fileData = AvailabilityUtils.getFileDataAsString(file);
		if (!ObjectUtils.isEmpty(fileData)) {
			fileShipNodeCache = mapper.readValue(fileData, ShipNodeCache.class);
		}
		return fileShipNodeCache;
    }
    public boolean deleteShipNodesFromStorageLocation(String shipNodeKey) {
		boolean status = false;
		try {
			File file = storageLocationPath(folderBaseLocation, shipNodeKey);
			status = file.delete();
			log.debug("deleted shipNode from StorageLocation for : {}", shipNodeKey);
		} catch (Exception exc) {
			log.error("An exception occurred while deleted ShipNodes From Storage Location" + exc);
		}

        return status;
    }
    
    public void warmup() {
		redisCacheWarmUpService.updateShipNodeRediseCacheFromFile(
				new File(folderBaseLocation + File.separator + DynamicConfigConstants.SHIP_NODE));
    }
}
