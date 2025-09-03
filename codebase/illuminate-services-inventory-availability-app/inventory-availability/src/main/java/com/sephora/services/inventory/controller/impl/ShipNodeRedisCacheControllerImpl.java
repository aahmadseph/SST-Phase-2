package com.sephora.services.inventory.controller.impl;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.common.service.CacheServices;
import com.sephora.services.inventory.controller.ShipNodeRedisCacheController;
import com.sephora.services.inventory.exception.NotFoundException;
import com.sephora.services.inventory.model.cache.ShipNodeStatusEnum;
import com.sephora.services.inventory.model.cache.ShipNodeCache;
import com.sephora.services.inventory.model.dto.UpdateShipNodesStatusDto;
import com.sephora.services.inventory.service.InventoryShipNodeCacheService;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.Objects;

import static com.sephora.services.inventoryavailability.AvailabilityConstants.CACHE_KEY;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.CACHE_KEY_SEPARATOR;
import static org.springframework.http.ResponseEntity.ok;

@Log4j2
@ControllerDocumentation
@RestController
@RequestMapping("/v1/nodes")
@ConditionalOnProperty(prefix = "inventory.cache", name = "enabled", havingValue = "true")
public class ShipNodeRedisCacheControllerImpl implements ShipNodeRedisCacheController {
	public static final String SHIP_NODE_NOT_FOUND_ERROR = "shipNode.notFound";
	 	@Autowired
	    @Qualifier("redisInventoryServiceTemplate")
	    private RedisTemplate<String, Object> invRedisTemplate;
	 	
	 	@Autowired
	    private InventoryShipNodeCacheService shipNodeCacheService;
	 		 		 	
	 	@Autowired
	 	private CacheServices cacheServices;

	    @PostMapping
		public String saveInRedis(@RequestBody ShipNodeCache value) {
			String cacheKey = CACHE_KEY + CACHE_KEY_SEPARATOR + value.getId();
			LocalDateTime localDateTime = LocalDateTime.now();
			String formattedDateTime = localDateTime.format(AvailabilityConstants.DTF_YYYY_MM_DDTHH_MM_SS_SSS);
			value.setUpdateTime(formattedDateTime);
			invRedisTemplate.opsForValue().set(cacheKey, value);
			shipNodeCacheService.updateShipNodeFile(cacheKey, value);
			return "success saved ShipNode with Cache key: " + cacheKey;
		}

		@GetMapping
		public ShipNodeCache getFromRedis(@RequestParam String key) {
			ShipNodeCache shipNode = null;
			String cacheKey = CACHE_KEY + CACHE_KEY_SEPARATOR + key;
			shipNode = (ShipNodeCache) cacheServices.get(cacheKey);
			if (Objects.isNull(shipNode)) {
				shipNode = shipNodeCacheService.getShipNodeFromStorageLocation(cacheKey);
			}
			if (Objects.isNull(shipNode)) {
				log.error("Unable to find shipNode={}", key);
				throw new NotFoundException(SHIP_NODE_NOT_FOUND_ERROR, StringUtils.join(key));
			}
			return shipNode;

		}

		@DeleteMapping
		public boolean delete(@RequestParam String key) {
			boolean status = false;
			status = invRedisTemplate.delete(CACHE_KEY + CACHE_KEY_SEPARATOR + key);
			status = shipNodeCacheService.deleteShipNodesFromStorageLocation(CACHE_KEY + CACHE_KEY_SEPARATOR + key);
			return status;
		}

		@Override
		@PutMapping("/status")
		public ResponseEntity<Object> updateShipNodesStatus(@Valid UpdateShipNodesStatusDto updateShipNodesStatus) {
			 updateShipNodesStatus.getShipNodesStatuses()
             .forEach(updateShipNodeStatus -> {
                 ShipNodeStatusEnum status = ShipNodeStatusEnum.valueOf(updateShipNodeStatus.getStatus());
                 log.debug("Update status for shipping nodes with keys={}", updateShipNodeStatus.getShipNodes());                
                 shipNodeCacheService.updateShipNodesStatus(updateShipNodeStatus.getShipNodes(), status);
			 });
			 return ok().build();
		}

		@PutMapping("/warmup")
		public ResponseEntity<Object> warmup() {			
			shipNodeCacheService.warmup();
			return ok().build();
		}
}