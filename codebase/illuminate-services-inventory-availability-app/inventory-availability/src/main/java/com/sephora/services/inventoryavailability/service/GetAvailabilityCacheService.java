package com.sephora.services.inventoryavailability.service;

import static com.sephora.services.inventoryavailability.config.redis.GetAvailabilityForSitePagesAsyncConfig.CACHE_THREAD_POOL;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.FULFILLMENT_TYPE_SHIP;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.SHIPTOHOME;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.FULFILLMENT_TYPE_PICK;

import java.text.ParseException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.apache.commons.collections4.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.stereotype.Service;

import org.springframework.data.redis.core.RedisTemplate;

import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.model.locationavailability.redis.AtpByFulfillmentType;
import com.sephora.services.inventory.model.locationavailability.redis.LocationAvailabilityRedisCacheDto;
import com.sephora.services.inventory.util.InventoryUtils;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.config.GetAvailabilityConfig;
import com.sephora.services.inventoryavailability.config.PriorityConfig;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByFulfillmentType;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.utils.AvailabilityUtils;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class GetAvailabilityCacheService {
	
    @Autowired
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;
    
	@Autowired
	private GetAvailabilityConfig getAvailabilityConfig;

	@Autowired
	@Qualifier(CACHE_THREAD_POOL)
	private AsyncTaskExecutor threadPoolTaskExecutor;
	
	@Autowired
	AvailabilityHubInventoryService yantriksInventoryService;
	
	private String fulfillmentType;
	
	private PriorityConfig priorityConfig;
	private String sellingChannel;

	@Value("${inventory.site-page-availability.locationAvailability.cache.time-to-live}")
	private Long timeToLive;
	
	@Autowired
	private AvailabilityHubMissConfiguration availabilityHubMissConfiguration;
	
	@Value("${inventory.site-page-availability.handleSameDayCacheMiss:true}")
	private boolean handleSameDayCacheMiss;
	
	public AvailabilityResponseDto getAvailability(InventoryItemsRequestDto inventoryItemsRequestDto, PriorityConfig priorityConfig) {
		Map<String, List<String>> locProductMap = new HashMap<String, List<String>>();
		this.priorityConfig = priorityConfig;
		this.sellingChannel = inventoryItemsRequestDto.getSellingChannel();
		this.fulfillmentType = null;
		
		inventoryItemsRequestDto.getProducts().stream().forEach(product -> {
			if(null == fulfillmentType) {
				fulfillmentType = product.getFulfillmentType();
			}
			product.getLocations().forEach(location -> {
				if (locProductMap.containsKey(location.getLocationId())) {
					locProductMap.get(location.getLocationId()).add(product.getProductId());
				} else {
					List<String> productList = new ArrayList(); 
					productList.add(product.getProductId());
					locProductMap.put(location.getLocationId(),productList);
				}
			});
		});
		
		// Get availability for each location async 	
		List<CompletableFuture<Map<String, AvailabilityByProduct>>> availabilityByProductFutureList = locProductMap.entrySet().stream().map(locProductMapEntry -> CompletableFuture.supplyAsync(()->{
					return getAvailabilityByLocation(locProductMapEntry.getValue(), locProductMapEntry.getKey());
				},threadPoolTaskExecutor)).collect(Collectors.toList());
		
		Map<String, AvailabilityByProduct> availabilityByProductMapRes = new HashedMap();
		availabilityByProductFutureList.stream().forEach(availabilityByProductFuture -> {
			 try {
				Map<String, AvailabilityByProduct> availabilityByProductMap = availabilityByProductFuture.get();
				if(availabilityByProductMapRes.isEmpty()) {
					availabilityByProductMapRes.putAll(availabilityByProductMap);
				} else {
					availabilityByProductMap.entrySet().forEach(availabilityByProductEntry -> {
						if(availabilityByProductMapRes.containsKey(availabilityByProductEntry.getKey())) {
							AvailabilityByProduct availabilityByProductRes = availabilityByProductMapRes.get(availabilityByProductEntry.getKey());
							List<AvailabilityByLocation> availabilityByProduct = availabilityByProductEntry.getValue().getAvailabilityByFulfillmentTypes().get(0).getAvailabilityDetails().get(0).getAvailabilityByLocations();							
							availabilityByProductRes.getAvailabilityByFulfillmentTypes().get(0).getAvailabilityDetails().get(0).getAvailabilityByLocations().addAll(availabilityByProduct);
						} else {
							availabilityByProductMapRes.put(availabilityByProductEntry.getKey(), availabilityByProductEntry.getValue());
						}
					});
				}
			} catch (InterruptedException | ExecutionException e) {
				log.error("An exception occured while merrging atp for locations", e);
			}
		});
		
		return AvailabilityResponseDto.builder()
				.availabilityByProducts(new ArrayList<AvailabilityByProduct>(availabilityByProductMapRes.values()))
				.sellingChannel(inventoryItemsRequestDto.getSellingChannel())
				.build();		
	}

	private Map<String, AvailabilityByProduct> getAvailabilityByLocation(List<String> products, String locationId) {
		long startTimeProcessLoc = System.currentTimeMillis();
		// Convert given product to batch
		Collection<List<String>> productBatches = InventoryUtils.convertToBatch(products, getAvailabilityConfig.getBatchSize());
		Map<String, AvailabilityByProduct> response = new HashedMap();
		
		// fetch availability for each batch of product async
		List<CompletableFuture<Map<String, AvailabilityByProduct>>> availabilityByLocationFutureList =productBatches.stream().map(productList -> CompletableFuture.supplyAsync(() -> {
			long startTime = System.currentTimeMillis();
			Map<String, AvailabilityByProduct> availabilityByLocationMap = new HashedMap();
			List<String> cacheMissProducts = new ArrayList<String>();
			try {
				//create key list 
				List<String> locationAvailabilityKeys = productList.stream().map(productId -> AvailabilityUtils.createLocationAvailabilityRedisCacheKey(getAvailabilityConfig.getCacheName(), productId, locationId)).collect(Collectors.toList());
				String cacheName = getAvailabilityConfig.getCacheName() + "_" + locationId;
				
				long startTimeLocationAvailabilityCache = System.currentTimeMillis();
				log.debug("Feteching data from cache for cache name: {}, number of key(s): {}", cacheName, locationAvailabilityKeys.size());
				//Map<Object, Object> locationAvailabilityCashDatas = cacheService.getCacheItems(cacheName, locationAvailabilityKeys);
				
				List<Object> cacheItems = invRedisTemplate.opsForValue().multiGet(locationAvailabilityKeys);
				Map<Object, Object> locationAvailabilityCashDatas = IntStream.range(0, locationAvailabilityKeys.size()).boxed()
						.collect(HashMap::new, (m,v) -> {if(v < cacheItems.size() && null != cacheItems.get(v)) {m.put(locationAvailabilityKeys.get(v), cacheItems.get(v));}}, HashMap::putAll);
				
				log.info("Successfully fetched records from cache: {} with: {} records out of: {}, took: {} ms",
						cacheName, locationAvailabilityCashDatas.size(), locationAvailabilityKeys.size(),
						System.currentTimeMillis() - startTimeLocationAvailabilityCache);
				// build availability response from cache response 			
				if(null != locationAvailabilityCashDatas && null != locationAvailabilityCashDatas.entrySet() && !locationAvailabilityCashDatas.entrySet().isEmpty()) {
					locationAvailabilityKeys.forEach(key -> {
						if(locationAvailabilityCashDatas.containsKey(key)) {
							LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = (LocationAvailabilityRedisCacheDto) locationAvailabilityCashDatas.get(key);
							AvailabilityByProduct availabilityByLocation = buildAvailabilityByLocationResponse(locationAvailabilityRedisCacheDto);
							if(null != availabilityByLocation) {
								availabilityByLocationMap.put(locationAvailabilityRedisCacheDto.getProductId(), availabilityByLocation);
							} else {
								cacheMissProducts.add(locationAvailabilityRedisCacheDto.getProductId());
							}
						} else {
							cacheMissProducts.add(key.split("_")[1]);
						}
					});
				} else {
					// handle cache miss if all products are not present in cache
					log.debug("Cache miss product(s): {}, location: {}", Arrays.toString(productList.toArray()), locationId);
					availabilityByLocationMap.putAll(handleCacheMiss(new ArrayList<String>(productList), locationId));
				}
				
				// handle cache miss if some of the products are not available in cache
				if (!cacheMissProducts.isEmpty()) {
					log.debug("Cache miss product(s): {}, location: {}", Arrays.toString(cacheMissProducts.toArray()), locationId);
					availabilityByLocationMap.putAll(handleCacheMiss(cacheMissProducts, locationId));
				}
			} catch(Exception ex) {
				log.error("An exception occured while fetching cache:{} ", ex.getMessage(), ex);
				log.debug("Cache miss product(s): {}, location: {}", Arrays.toString(productList.toArray()), locationId);
				availabilityByLocationMap.putAll(handleCacheMiss(new ArrayList<String>(productList), locationId));
			} 
			
			return availabilityByLocationMap;
		}, threadPoolTaskExecutor)).collect(Collectors.toList());
		
		availabilityByLocationFutureList.stream().forEach(availabilityByLocationFuture -> {
			try {
				response.putAll(availabilityByLocationFuture.get());
			} catch (InterruptedException e) {
				log.error("An exception occure while fetching availability from cache by batch", e);
			} catch (ExecutionException e) {
				log.error("An exception occure while fetching availability from cache by batch", e);
			}
		});
		log.debug("Time taken to process for getAvailability for locationId: {} is: {}ms ", locationId, System.currentTimeMillis() - startTimeProcessLoc);
		
		return response;
	}
	
	/**
	 * Handle cache miss. if second priority is availability hub, then call yatriks availability and fetch availability for missing prodcut.
	 * othere wise send default value to caller
	 * @param productList
	 * @param location
	 * @return
	 */
	private Map<String, AvailabilityByProduct> handleCacheMiss(List<String> productList, String location) {
		Map<String, AvailabilityByProduct> availabilityByLocationMap = new HashMap<String, AvailabilityByProduct>();
		// Check weather the second priority is AVAILABILITY_HUB for given request origin and fullfilment type
		if(this.priorityConfig.getPriorityOrder().size() > 1 &&  AvailabilityConstants.AVAILABILITY_HUB.equals(this.priorityConfig.getPriorityOrder().get(1))) {
			//Fetch availability from yantriks
			availabilityByLocationMap = yantriksInventoryService.findAvailabilityForCacheMiss(productList, location, sellingChannel, fulfillmentType);
			
			//Update cache with availability from yantris
			if(null != availabilityByLocationMap && !availabilityByLocationMap.isEmpty()) {
				updateCache(availabilityByLocationMap);
			} else {
				availabilityByLocationMap = new HashMap<String, AvailabilityByProduct>();
			}
			
		}
		// Build default response for missing product in yantriks
		if(productList.size() != availabilityByLocationMap.keySet().size()) {
			productList.removeAll(availabilityByLocationMap.keySet());
			log.debug("Product(s) not available in Yantriks: {}", Arrays.toString(productList.toArray()));
			availabilityByLocationMap.putAll(productList.stream()
					.collect(Collectors.toMap(productId -> productId, 
							productId ->
								AvailabilityByProduct.builder()
								.productId(productId)
								.availabilityByFulfillmentTypes(Arrays.asList(AvailabilityByFulfillmentType.builder()
										.fulfillmentType(fulfillmentType)
										.availabilityDetails(Arrays.asList(AvailabilityDetail.builder()
												.availabilityByLocations(Arrays.asList(AvailabilityByLocation.builder()
														.atp(null != priorityConfig ? priorityConfig.getAssumedATP() : 0D)
														.locationId(location)
														.build()))
												.build())).build()))
							.build())));
		}
		return availabilityByLocationMap;
	}
	
	/**
	 * Build getAvailability response from cache object
	 * @param locationAvailabilityRedisCacheDto
	 * @return
	 */
	private AvailabilityByProduct buildAvailabilityByLocationResponse(LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto) {
		//Check cache object having availability for given fulfillment type
		AtpByFulfillmentType atpByFulfillmentType = locationAvailabilityRedisCacheDto.getAtpByFulfillmentTypes()
				.stream().filter(atpDetails -> atpDetails.getFulfillmentType().equals(SHIPTOHOME.equals(fulfillmentType) ? FULFILLMENT_TYPE_SHIP : fulfillmentType)).findAny()
				.orElse(null);
		
		//if given fulfillment is SAMEDAY and the same is not available in cache obj, then check for PICK availability and return. 
		if (null == atpByFulfillmentType && handleSameDayCacheMiss
				&& AvailabilityConstants.FULFILLMENT_TYPE_SAMEDAY.equals(fulfillmentType)) {
			atpByFulfillmentType = locationAvailabilityRedisCacheDto.getAtpByFulfillmentTypes().stream()
					.filter(atpDetails -> FULFILLMENT_TYPE_PICK.equals(atpDetails.getFulfillmentType())).findAny()
					.orElse(null);
		}
					
		if(null != atpByFulfillmentType) {
			return AvailabilityByProduct.builder()
					.productId(locationAvailabilityRedisCacheDto.getProductId())
					.availabilityByFulfillmentTypes(Arrays.asList(AvailabilityByFulfillmentType.builder()
							.fulfillmentType(fulfillmentType)
							.availabilityDetails(Arrays.asList(AvailabilityDetail.builder()
									.availabilityByLocations(Arrays.asList(AvailabilityByLocation.builder()
											.atp((availabilityHubMissConfiguration.getHandleCacheNegetiveAtp() && atpByFulfillmentType.getAtp() < 0) ? 0 :  atpByFulfillmentType.getAtp())
											.locationId(locationAvailabilityRedisCacheDto.getLocationId())
											.build()))
									.build())).build()))
				.build();
		} else {
			return null;
		}
	}
	
	/**
	 * Update availability cache with give product availability details
	 * @param availabilityByLocationMap
	 */
	public void updateCache(Map<String, AvailabilityByProduct> availabilityByLocationMap) {
		
			Map<String, LocationAvailabilityRedisCacheDto> cacheMap = new HashMap<String, LocationAvailabilityRedisCacheDto>();
			availabilityByLocationMap.entrySet().forEach(productEntry -> {
				String porductId = productEntry.getKey();
				AvailabilityByProduct availabilityByProduct = productEntry.getValue();
				availabilityByProduct.getAvailabilityByFulfillmentTypes().forEach(availabilityByFulfillmentType -> {
					String fulfillmentType = availabilityByFulfillmentType.getFulfillmentType();
					availabilityByFulfillmentType.getAvailabilityDetails().forEach(availabilityDetail -> availabilityDetail.getAvailabilityByLocations().forEach(availabilityByLocation -> {
						String cacheKey = AvailabilityUtils.createLocationAvailabilityRedisCacheKey(getAvailabilityConfig.getCacheName(), porductId, availabilityByLocation.getLocationId());
						String cacheName = getAvailabilityConfig.getCacheName() + "_" + availabilityByLocation.getLocationId();
						try {
							LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = new LocationAvailabilityRedisCacheDto();
							locationAvailabilityRedisCacheDto.setProductId(porductId);
							locationAvailabilityRedisCacheDto.setLocationId(availabilityByLocation.getLocationId());
							List<AtpByFulfillmentType> atpByFulfillmentTypeList = new ArrayList<AtpByFulfillmentType>();
							AtpByFulfillmentType atpByFulfillmentType = new AtpByFulfillmentType();
							atpByFulfillmentType.setAtp(availabilityByLocation.getAtp());
							atpByFulfillmentType.setAtpStatus(availabilityByLocation.getAtpStatus());
							atpByFulfillmentType.setFulfillmentType(SHIPTOHOME.equals(fulfillmentType) ? FULFILLMENT_TYPE_SHIP : fulfillmentType);
							atpByFulfillmentType.setUpdateTime(AvailabilityUtils.currentPSTDateTime());
							atpByFulfillmentTypeList.add(atpByFulfillmentType);
							locationAvailabilityRedisCacheDto.setAtpByFulfillmentTypes(atpByFulfillmentTypeList);
							
							long startTime = System.currentTimeMillis();
							/*LocationAvailabilityRedisCacheDto existingCache = (LocationAvailabilityRedisCacheDto) cacheService
		                            .getCacheItem(cacheName, cacheKey);*/
							LocationAvailabilityRedisCacheDto existingCache = (LocationAvailabilityRedisCacheDto)invRedisTemplate.opsForValue().get(cacheKey);
							
							if(null != existingCache) {
								LocationAvailabilityRedisCacheDto mergedCache = mergeCacheData(existingCache, locationAvailabilityRedisCacheDto);
								//cacheService.putCacheItem(cacheName, cacheKey, mergedCache);
								invRedisTemplate.opsForValue().set(cacheKey, mergedCache, timeToLive, TimeUnit.SECONDS);
							} else {
								//cacheService.putCacheItem(cacheName, cacheKey, locationAvailabilityRedisCacheDto);
								invRedisTemplate.opsForValue().set(cacheKey, locationAvailabilityRedisCacheDto, timeToLive, TimeUnit.SECONDS);
							}
							log.info("Successfully updated cache: {}, key: {}, tooks: {}", cacheName, cacheKey, System.currentTimeMillis() - startTime);
							
							//AV-3166 Send atp as 0 to ATG if cache have -ve atp due to yantriks availability miss
							if(availabilityHubMissConfiguration.getHandleCacheNegetiveAtp() && availabilityByLocation.getAtp() < 0) {							
								availabilityByLocation.setAtp(0D);
							}
						} catch(Exception ex) {
							log.error("An exception occured while updating cache: {}, key: {}",cacheName, cacheKey, ex);
						}
					}));
				});
			});
	}
	
	/**
	 * Merge availability from yantriks with existing in cache
	 * @param existingCache
	 * @param item
	 * @return
	 * @throws ParseException
	 */
	private LocationAvailabilityRedisCacheDto mergeCacheData(LocationAvailabilityRedisCacheDto existingCache, LocationAvailabilityRedisCacheDto item) throws ParseException {
        for(AtpByFulfillmentType atpByFulfillmentType: item.getAtpByFulfillmentTypes()){
            Optional<AtpByFulfillmentType> existingAtpOptional =  existingCache.getAtpByFulfillmentTypes().stream().filter(atp -> atp.getFulfillmentType().equals(atpByFulfillmentType.getFulfillmentType())).findFirst();
            if(existingAtpOptional.isPresent()){
                AtpByFulfillmentType existingAtp = existingAtpOptional.get();
                existingCache.getAtpByFulfillmentTypes().remove(existingAtp);
                existingCache.getAtpByFulfillmentTypes().add(atpByFulfillmentType);                
            }else{
                existingCache.getAtpByFulfillmentTypes().add(atpByFulfillmentType);
            }
        }
        return existingCache;
    }
}
