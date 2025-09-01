package com.sephora.services.inventory.service.availability.impl;

import static com.sephora.services.inventoryavailability.config.redis.GetAvailabilityForSitePagesAsyncConfig.CACHE_THREAD_POOL;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.stereotype.Service;

import org.springframework.data.redis.core.RedisTemplate;

import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.model.networkThreshold.redis.NetworkThresholdCacheDto;
import com.sephora.services.inventory.service.availability.AvailabilityService;
import com.sephora.services.inventory.service.availability.NetworkAvailabilityService;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.utils.AvailabilityUtils;

import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@Setter
@RefreshScope
public class NetworkAvailabilityServiceImpl implements NetworkAvailabilityService {
	
    @Autowired
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;
	
	@Value("${inventory.site-page-availability.networkAavailability.async.batchSize:1}")
	private int batchSize;
	
	@Value("${inventory.site-page-availability.assumedAtp}")
	private double assumedAtp;
	
	@Value("${inventory.site-page-availability.defaultAtpStatus:OOS}")
	private String defaultAtpStatus;
	
	//@Autowired
	//private CacheService cacheService;
	
	@Value("${inventory.site-page-availability.networkCacheName}")
	private String networkCacheName;
	
	@Autowired
	@Qualifier(CACHE_THREAD_POOL)
	private AsyncTaskExecutor threadPoolTaskExecutor;
	
	@Autowired
	@Qualifier("AvailabilityHubAvailabilityService")
	private AvailabilityService availabilityHubAvailabilityService;

	@Value("${inventory.site-page-availability.networkThreshold.cache.time-to-live}")
	private Long timeToLive;
	
	private List<String> priorityOrder;
	
	private PriorityConfig priorityConfig;

	@Override
	public Map<String, NetworkThresholdCacheDto> getNetworkAvailability(List<String> products, String sellingChannel, List<String> priorityList) {
		this.priorityOrder = priorityList;
		Map<String, NetworkThresholdCacheDto> availabilityByProductMap= new HashMap<String, NetworkThresholdCacheDto>();
		
		Set<String> networkKeys = products.stream().map(productId -> AvailabilityUtils.createNetworkThresholdRedisCacheKey(productId, sellingChannel)).collect(Collectors.toSet());
		Collection<List<String>> networkKeyBatches = convertToBatch(networkKeys);				
		List<CompletableFuture<Map<String, NetworkThresholdCacheDto>>> networkAvailabilityFutureList = 
				networkKeyBatches.stream().map(networkKeyBatch -> 
				CompletableFuture.supplyAsync(()->  getAvailabilityByProduct(new HashSet<String>(networkKeyBatch), sellingChannel), threadPoolTaskExecutor)).collect(Collectors.toList());
		
		networkAvailabilityFutureList.stream().forEach(networkAvailabilityFuture -> {
			try {
				availabilityByProductMap.putAll(networkAvailabilityFuture.get());
			} catch (InterruptedException e) {
				log.error("An exception occured while fatching network availability from cache", e);
			} catch (ExecutionException e) {				
				log.error("An exception occured while fatching network availability from cache", e);
			}
		});
		return availabilityByProductMap;
	}
	
	
	/**
	 * 
	 * @param keys
	 * @return
	 */
	private Map<String, NetworkThresholdCacheDto> getAvailabilityByProduct(Set<String> keys, String sellingChannel) {
		Map<String, NetworkThresholdCacheDto> availabilityByProductMap = new HashMap<String, NetworkThresholdCacheDto>();
		//Fetching availability for given products using multi-get.
		//String disNetworkCacheName = networkCacheName + "_"+ sellingChannel;
		log.debug("Feteching data from cache for cache name: {}, number of key(s): {}", networkCacheName, keys.size());
		long startTime = System.currentTimeMillis();
		//Map<Object, Object> cashDatas = cacheService.getCacheItems(disNetworkCacheName, keys);
		
		List<String> cacheKeys = keys.stream().map(key -> networkCacheName + "_" + key).collect(Collectors.toList());
		List<Object> cacheItems = invRedisTemplate.opsForValue().multiGet(cacheKeys);
		Map<Object, Object> cashDatas = IntStream.range(0, cacheKeys.size()).boxed()
				.collect(HashMap::new, (m,v) ->{if(v < cacheItems.size() && null != cacheItems.get(v)) {m.put(cacheKeys.get(v), cacheItems.get(v));}}, HashMap::putAll);
		
		log.info("Successfully feted records from cache: {} with: {} records out of: {}, took: {} ms", 
				networkCacheName, cashDatas.size(), keys.size(), System.currentTimeMillis()-startTime);		
		List<String> missingProducts = new ArrayList<String>();
		cacheKeys.stream().forEach(key -> {
			if(cashDatas.containsKey(key)) {
				availabilityByProductMap.put(key.split("_")[1], (NetworkThresholdCacheDto)cashDatas.get(key));
			} else {
				if(this.priorityOrder.size() > 1 && AvailabilityConstants.AVAILABILITY_HUB.equals(this.priorityOrder.get(1))) {
					missingProducts.add(key.split("_")[1]);
				} else {
					availabilityByProductMap.put(key.split("_")[1],NetworkThresholdCacheDto.builder().productId(key.split("_")[1])
							.atp(null != priorityConfig ? priorityConfig.getAssumedATP() : assumedAtp)
							.atpStatus(null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus)
							.build());
				}
				
			}
		});
		
		//
		if(!missingProducts.isEmpty()) {						
			AvailabilityHubAvailabilityService ahAvailabilityService = (AvailabilityHubAvailabilityService) availabilityHubAvailabilityService.clone();
			Map<String, NetworkThresholdCacheDto> netWorkAvailabilityFromAhMap = ahAvailabilityService.getNetworkAvailability(missingProducts, sellingChannel, true);		
			if(!netWorkAvailabilityFromAhMap.isEmpty()) {
				availabilityByProductMap.putAll(netWorkAvailabilityFromAhMap);
				updateCache(netWorkAvailabilityFromAhMap, sellingChannel);
			}
			//
			if(missingProducts.size() > netWorkAvailabilityFromAhMap.size()) {
				missingProducts.removeAll(netWorkAvailabilityFromAhMap.keySet());
				missingProducts.forEach(product -> {
					availabilityByProductMap.put(product,NetworkThresholdCacheDto.builder().productId(product)
							.atp(null != priorityConfig ? priorityConfig.getAssumedATP() : assumedAtp)
							.atpStatus(null != priorityConfig ? priorityConfig.getAssumedATPStatus() :  defaultAtpStatus)
							.build());
				});
			}
		}
				
				
		return availabilityByProductMap;
	}
	
	
	private void updateCache(Map<String, NetworkThresholdCacheDto> networkThresholdMap, String sellingChannel) {
		//String disNetworkCacheName = networkCacheName + "_"+ sellingChannel;
		networkThresholdMap.values().forEach(networkThreshold -> {
			//String key = networkThreshold.getProductId() + "_" + sellingChannel;
			String key = networkCacheName + "_" + networkThreshold.getProductId() + "_" + sellingChannel;
			long startTime = System.currentTimeMillis();
			//cacheService.putCacheItem(disNetworkCacheName, key, networkThreshold);
			invRedisTemplate.opsForValue().set(key, networkThreshold, timeToLive, TimeUnit.SECONDS);
			
			log.info("Successfully updated network threshold cache cacheName: {} key: {} value: {}, took: {} ms", 
					networkCacheName, key, networkThreshold, System.currentTimeMillis()-startTime);	
		});
	}
	
	private Collection<List<String>> convertToBatch(Set<String> products) {		
		final AtomicInteger counter = new AtomicInteger();
		Collection<List<String>> requestBatches = products.stream()
				.collect(Collectors.groupingBy(it -> counter.getAndIncrement() / batchSize)).values();
		
		return requestBatches;
	}
}
