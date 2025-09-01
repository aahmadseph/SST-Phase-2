package com.sephora.services.inventory.service.availability.impl;

import com.sephora.platform.cache.service.CacheService;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.config.GetAvailabilityForSitePagesConfig;
import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.model.locationavailability.redis.AtpByFulfillmentType;
import com.sephora.services.inventory.model.locationavailability.redis.LocationAvailabilityRedisCacheDto;
import com.sephora.services.inventory.service.availability.AvailabilityService;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.FulfillmentTypeEnum;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByFT;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.utils.AvailabilityUtils;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.collections4.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static com.sephora.services.inventoryavailability.AvailabilityConstants.FULFILLMENT_TYPE_PICK;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.INSTOCK;
import static com.sephora.services.inventoryavailability.config.redis.GetAvailabilityForSitePagesAsyncConfig.V2_CACHE_THREAD_POOL;

@Service
@Log4j2
@Getter
@Setter
public class CacheAvailabilityServiceV2 {
	
    @Autowired
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;
    
	@Value("${inventory.site-page-availability.locationCacheName}")
	private String locationCacheName;
	
	@Value("${inventory.site-page-availability.async.waitTimeoutInSeconds}")
	private long waitTimeoutInSeconds;

	@Value("${inventory.site-page-availability.locationAvailability.cache.time-to-live}")
	private Long timeToLive;

	@Autowired
	@Qualifier(V2_CACHE_THREAD_POOL)
	private AsyncTaskExecutor threadPoolTaskExecutor;
	
	@Value("${inventory.site-page-availability.assumedAtp:0}")
	private double assumedAtp;
	
	@Value("${inventory.site-page-availability.defaultAtpStatus:OOS}")
	private String defaultAtpStatus;
	
	@Value("${inventory.site-page-availability.cacheAavailability.async.batchSize:1}")
	private int batchSize;
	
	@Value("${inventory.site-page-availability.handleSameDayCacheMiss:true}")
	private boolean handleSameDayCacheMiss;

	@Value("${inventory.site-page-availability.atpLocationCacheName}")
	private String atpLocationCacheName;


	//productId -> (fulfilmentType->locations)
	private Map<String, Map<String, Set<String>>> cacheMissMap = new HashMap<String, Map<String, Set<String>>>();
	
	@Autowired
	private CacheService cacheService;
	
	@Autowired
	@Qualifier("AvailabilityHubAvailabilityServiceV2")
	private AvailabilityService availabilityHubAvailabilityService;
	
	@Autowired
	private AvailabilityHubMissConfiguration availabilityHubMissConfiguration;
	
	@Autowired
	private GetAvailabilityForSitePagesConfig getAvailabilityForSitePagesConfig;
	
	private String fulfillmentType = null;
	private String sellingChannel = null;
	private List<String> priorityOrder;
	
	//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
	private PriorityConfig priorityConfig;
	
	//AV-3635 - Handle Blaze meter scenario for getAvailabilityForSitePages API call for Bopis and SDD transactions
	private String requestOrigin;
	
	public Map<String, AvailabilityByProduct> getAvailabiliy(Set<String> products, String sellingChannel,
															 boolean evaluateNetworkAvail, List<String> locations, final String fulfillmentType,
															 List<String> priorityOrder) {
		
		Map<String, AvailabilityByProduct> availabilityByProductList= new HashMap<String, AvailabilityByProduct>();
		this.fulfillmentType = fulfillmentType;
		this.sellingChannel = sellingChannel;
		this.priorityOrder = priorityOrder;
		
		try {
			CompletableFuture<Map<String, AvailabilityByProduct>> availabilityByLocationFuture = null;
						
			// Build key set for location availability cache
			if(null != locations && !locations.isEmpty()) {							
				availabilityByLocationFuture = CompletableFuture.supplyAsync(()-> getAvailabilityByProductAndLocation(products, locations), threadPoolTaskExecutor);
			}
			
			if(null != availabilityByLocationFuture) {
				availabilityByProductList.putAll(availabilityByLocationFuture.get(waitTimeoutInSeconds, TimeUnit.SECONDS));
			}
									
			log.debug("Successfully prepared site page product from cache. Number of products: {}", availabilityByProductList.size());
		} catch(Exception e) {
			log.error("Exception occred while fetching redis cache entry, sending assumed atp", e);
		}
		return availabilityByProductList;
	}
		
	private Map<String, AvailabilityByProduct> getAvailabilityByProductAndLocation(Set<String> productList, List<String> locationList) {
		Map<String, AvailabilityByProduct> availabilityByProductMap = new HashedMap();
		
		// Get availability for each location async 	
		List<CompletableFuture<Map<String, AvailabilityByLocation>>> availabilityByLocationFutureList =  locationList.stream().map(locationId -> CompletableFuture.supplyAsync(()->{
			return getAvailabilityByLocation(productList, locationId);
		},threadPoolTaskExecutor)).collect(Collectors.toList());
		
		// Merge availability for each location
		availabilityByLocationFutureList.stream().forEach(availabilityByLocationFuture -> {
			try {
				Map<String, AvailabilityByLocation> availabilityByLocationMap = availabilityByLocationFuture.get();
				availabilityByLocationMap.entrySet().stream().forEach(entry -> {
					AvailabilityByLocation availabilityByLocation = entry.getValue();
					String productId = entry.getKey();
					if(availabilityByProductMap.containsKey(productId)) {
						List<AvailabilityByLocation> availabilityByLocations = availabilityByProductMap.get(productId).getAvailabilityDetails().getAvailabilityByFT().get(0).getLocations();
						availabilityByLocations.add(availabilityByLocation);
					} else {
						List<AvailabilityByLocation> availabilityByLocations = new ArrayList<AvailabilityByLocation>();
						availabilityByLocations.add(availabilityByLocation);
						
						List<AvailabilityByFT> availabilityByFTs = new ArrayList<AvailabilityByFT>();						
						availabilityByFTs.add(AvailabilityByFT.builder().fulfillmentType(fulfillmentType).locations(availabilityByLocations).build());
												
						availabilityByProductMap.put(productId, AvailabilityByProduct.builder().productId(productId)
								.availabilityDetails(AvailabilityDetail.builder().availabilityByFT(availabilityByFTs).build()).build());
					}
				});
			} catch (InterruptedException e) {
				log.error("An Exception occur while getting availability from cache by location", e);
			} catch (ExecutionException e) {
				log.error("An Exception occur while getting availability from cache by location", e);
			}
		});
		
		return availabilityByProductMap;
	}

	/**
	 * @deprecated no longer used. To be removed
	 * @param availabilityByLocationsRes
	 * @param availabilityByLocationsNew
	 */
	private void getAvailabilityByLocationWithNoDetails(AvailabilityByLocation availabilityByLocationsRes, AvailabilityByLocation availabilityByLocationsNew) {
		
		   if ("INSTOCK".equals(availabilityByLocationsNew.getAtpStatus())) {				
			   availabilityByLocationsRes.setAtpStatus(availabilityByLocationsNew.getAtpStatus());
			   availabilityByLocationsRes.setLocation(availabilityByLocationsNew.getLocation());
			} else if ("LIMITEDSTOCK".equals(availabilityByLocationsNew.getAtpStatus()) 
					&& !"INSTOCK".equals(availabilityByLocationsRes.getAtpStatus())) {
				availabilityByLocationsRes.setAtpStatus(availabilityByLocationsNew.getAtpStatus());
				availabilityByLocationsRes.setLocation(availabilityByLocationsNew.getLocation());
			} else if ("OOS".equals(availabilityByLocationsNew.getAtpStatus())
					&& !"LIMITEDSTOCK".equals(availabilityByLocationsRes.getAtpStatus())
					&& !"INSTOCK".equals(availabilityByLocationsRes.getAtpStatus())) {
				availabilityByLocationsRes.setAtpStatus(availabilityByLocationsNew.getAtpStatus());
				availabilityByLocationsRes.setLocation(availabilityByLocationsNew.getLocation());
			}		
	}
	
	private Map<String, AvailabilityByLocation> getAvailabilityByLocation(Set<String> products, String locationId) {
		long startTimeProcessLoc = System.currentTimeMillis();
		//Convert given product to batch
		Collection<List<String>> productBatches = convertToBatch(products);
		Map<String, AvailabilityByLocation> response = new HashedMap();
		
		// fetch availability for each batch of product async
		List<CompletableFuture<Map<String, AvailabilityByLocation>>> availabilityByLocationFutureList = productBatches.stream().map(productList -> CompletableFuture.supplyAsync(()->{
			long startTime = System.currentTimeMillis();
			Map<String, AvailabilityByLocation> availabilityByLocationMap = new HashedMap();
			List<String> cacheMissProducts = new ArrayList<String>();

			try {
				//OMM-761 Implement switch for lettuce redis cache changes
				Map<Object, Object> locationAvailabilityCashDatas = new HashMap<Object, Object>();
				List<String> locationAvailabilityKeys = new ArrayList<String>();
				//create key list
				locationAvailabilityKeys.addAll(productList.stream()
						.map(productId -> {
							String cacheName = List.of(FulfillmentTypeEnum.SHIP.toString(), FulfillmentTypeEnum.SHIPTOHOME.toString()).contains(fulfillmentType)
									? atpLocationCacheName
									: locationCacheName;
							return createLocationAvailabilityRedisCacheKey(cacheName, productId, locationId);
						})
						.collect(Collectors.toList()));

				log.debug("Cache Keys generated: {}", locationAvailabilityKeys);
				long startTimeLocationAvailabilityCache = System.currentTimeMillis();
				log.debug("Feteching data from cache with number of key(s): {}", locationAvailabilityKeys.size());

				List<Object> cacheItems = invRedisTemplate.opsForValue().multiGet(locationAvailabilityKeys);
				locationAvailabilityCashDatas.putAll(IntStream.range(0, locationAvailabilityKeys.size()).boxed()
						.collect(HashMap::new, (m, v) -> {
							if (v < cacheItems.size() && null != cacheItems.get(v)) {
								m.put(locationAvailabilityKeys.get(v), cacheItems.get(v));
							}
						}, HashMap::putAll));

				log.info("Successfully fetched records with: {} records out of: {}, took: {} ms", locationAvailabilityCashDatas.size(), locationAvailabilityKeys.size(),
						System.currentTimeMillis() - startTimeLocationAvailabilityCache);

				//OMM-761 - End
				
				// build availability response from cache response 			
				if(null != locationAvailabilityCashDatas && null != locationAvailabilityCashDatas.entrySet() && !locationAvailabilityCashDatas.entrySet().isEmpty()) {
					locationAvailabilityKeys.forEach(key -> {
						if(locationAvailabilityCashDatas.containsKey(key)) {
							LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = (LocationAvailabilityRedisCacheDto) locationAvailabilityCashDatas.get(key);
							AvailabilityByLocation availabilityByLocation = buildAvailabilityByLocationResponse(locationAvailabilityRedisCacheDto);
							if(null != availabilityByLocation) {
								availabilityByLocationMap.put(locationAvailabilityRedisCacheDto.getProductId(), availabilityByLocation);
							} else {
								cacheMissProducts.add(locationAvailabilityRedisCacheDto.getProductId());
							}
						} else {
							//OMM-761
							if(getAvailabilityForSitePagesConfig.isUseRedisTemplate()) {
								if (getAvailabilityForSitePagesConfig.isKohlsCacheEnabled() && StringUtils.isNotEmpty(locationId)
										&& locationId.length() == 6
										&& locationId.startsWith(AvailabilityConstants.KOHLS_STORE_ID_START_WITH_EIGHT)) {
									cacheMissProducts.add(key.split("_")[2]);
								} else {
									cacheMissProducts.add(key.split("_")[1]);
								}
							} else {
								cacheMissProducts.add(key.substring(0, key.indexOf("_")));
							}
							//End - OMM-761
						}
					});
				} else {
					// handle cache miss if all products are not present in cache
					log.info("Cache miss product(s): {}, location: {}", Arrays.toString(productList.toArray()), locationId);
					availabilityByLocationMap.putAll(handleCacheMiss(new ArrayList<String>(productList), locationId));
				}
				
				// handle cache miss if some of the products are not available in cache
 				if(!cacheMissProducts.isEmpty()) {
					log.info("Cache miss product(s): {}, location: {}", Arrays.toString(cacheMissProducts.toArray()), locationId);
					availabilityByLocationMap.putAll(handleCacheMiss(cacheMissProducts, locationId));
				}
			} catch(Exception ex) {
				log.error("An exception occured while fetching cache:{} ", ex.getMessage(), ex);
				log.info("Cache miss product(s): {}, location: {}", Arrays.toString(productList.toArray()), locationId);
				availabilityByLocationMap.putAll(handleCacheMiss(new ArrayList<String>(productList), locationId));
			} 
			log.debug("Time taken to process batch for locationId: {} is: {}ms ", locationId, System.currentTimeMillis() - startTime);
			return availabilityByLocationMap;
		},threadPoolTaskExecutor)).collect(Collectors.toList());
		
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
	
	private String createLocationAvailabilityRedisCacheKey(String cacheName, String productId, String locationId) {
		log.debug("kohls Cache key switch is: {} ", getAvailabilityForSitePagesConfig.isKohlsCacheEnabled());

		if (getAvailabilityForSitePagesConfig.isKohlsCacheEnabled() && StringUtils.isNotEmpty(locationId)
				&& locationId.length() == 6
				&& locationId.startsWith(AvailabilityConstants.KOHLS_STORE_ID_START_WITH_EIGHT)) {
			return cacheName + "_" + AvailabilityConstants.KOHLS + "_" + productId + "_" + locationId;
		}
		return cacheName + "_" + productId + "_" + locationId;
	}

	/**
	 * Handle cache miss. if second priority is availability hub, then call yatriks availability and fetch availability for missing prodcut.
	 * othere wise send default value to caller
	 * @param productList
	 * @param location
	 * @return
	 */
	private Map<String, AvailabilityByLocation> handleCacheMiss(List<String> productList, String location) {
		Map<String, AvailabilityByLocation> availabilityByLocationMap = new HashMap<String, AvailabilityByLocation>();
		// Check weather the second priority is AVAILABILITY_HUB for given request origin and fullfilment type
		// OMM-807: Temp fix for Invalid Kohl's store from ATG
		if(isValidStore(location) && !requestOrigin.endsWith("_TEST") && this.priorityOrder.size() > 1 &&  AvailabilityConstants.AVAILABILITY_HUB.equals(this.priorityOrder.get(1))) {

				AvailabilityHubAvailabilityServiceV2 ahAvailabilityService = (AvailabilityHubAvailabilityServiceV2) availabilityHubAvailabilityService.clone();
				
				//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
				ahAvailabilityService.setPriorityConfig(priorityConfig);
				availabilityByLocationMap = ahAvailabilityService.findAvailabilityForCacheMiss(productList, location, sellingChannel, 
						//DEF-2619 REDIS Cache Miss Handling: Put SAMEDAY availability into Cache under PICK
						//(getAvailabilityForSitePagesConfig.isUseDefaultFulfillmentType() && null != getAvailabilityForSitePagesConfig.getDefaultFulfillmentType()) ? 
						//		getAvailabilityForSitePagesConfig.getDefaultFulfillmentType() : fulfillmentType)
						getCacheFulfillmentType(fulfillmentType));

			
			//Update cache with availability from yantris
			if(null != availabilityByLocationMap && !availabilityByLocationMap.isEmpty()) {
				updateCache(availabilityByLocationMap);
			} else {
				availabilityByLocationMap = new HashMap<String, AvailabilityByLocation>();
			}
		}
		// Build default response for missing product in yantriks
		if(productList.size() != availabilityByLocationMap.keySet().size()) {
			productList.removeAll(availabilityByLocationMap.keySet());
			log.debug("Product(s) not available in Yantriks: {}", Arrays.toString(productList.toArray()));
			availabilityByLocationMap.putAll(productList.stream()
					.collect(Collectors.toMap(productId -> productId, 
							productId -> AvailabilityByLocation.builder()
							//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
							//AV-3635 - Handle Blaze meter scenario for getAvailabilityForSitePages API call for Bopis and SDD transactions
							.atp(requestOrigin.endsWith("_TEST") ? 1D : (null != priorityConfig ? priorityConfig.getAssumedATP() : assumedAtp))
							.atpStatus(requestOrigin.endsWith("_TEST") ? INSTOCK : (null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus))
							//AV-3195 - END
							//AV-3635 - END
							.location(location).build())));
		}
		return availabilityByLocationMap;
	}
	
	private AvailabilityByLocation buildAvailabilityByLocationResponse(LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto) {
		AtpByFulfillmentType atpByFulfillmentType = locationAvailabilityRedisCacheDto.getAtpByFulfillmentTypes()
				.stream().filter(atpDetails -> atpDetails.getFulfillmentType()
        		       //.equals(//DEF-2619 REDIS Cache Miss Handling: Put SAMEDAY availability into Cache under PICK
					   //			(getAvailabilityForSitePagesConfig.isUseDefaultFulfillmentType() && null != getAvailabilityForSitePagesConfig.getDefaultFulfillmentType()) ? 
					   //		getAvailabilityForSitePagesConfig.getDefaultFulfillmentType() : fulfillmentType)).findAny()
						.equals(getCacheFulfillmentType(fulfillmentType))).findAny()
				.orElse(null);
		//
		if (null == atpByFulfillmentType && handleSameDayCacheMiss
				&& AvailabilityConstants.FULFILLMENT_TYPE_SAMEDAY.equals(fulfillmentType)) {
			atpByFulfillmentType = locationAvailabilityRedisCacheDto.getAtpByFulfillmentTypes().stream()
					.filter(atpDetails -> FULFILLMENT_TYPE_PICK.equals(atpDetails.getFulfillmentType())).findAny()
					.orElse(null);
		}
					
		if(null != atpByFulfillmentType) {
			return AvailabilityByLocation.builder()
				//AV-3166 Send atp as 0 to ATG if cache have -ve atp due to yantriks availability miss	
				.atp((availabilityHubMissConfiguration.getHandleCacheNegetiveAtp() && atpByFulfillmentType.getAtp() < 0) ? 0 :  atpByFulfillmentType.getAtp())
				.atpStatus(atpByFulfillmentType.getAtpStatus())
				.location(locationAvailabilityRedisCacheDto.getLocationId()).build();
		} else {
			return null;
		}
	}
	
	private String getCacheFulfillmentType(String reqFulfillmentType) {
		if(FulfillmentTypeEnum.SHIP.toString().equals(reqFulfillmentType)) {
			return reqFulfillmentType; 
		} else if (FulfillmentTypeEnum.SHIPTOHOME.toString().equals(reqFulfillmentType)) {
			return FulfillmentTypeEnum.SHIP.toString(); 
		} else {
			//DEF-2619 REDIS Cache Miss Handling: Put SAMEDAY availability into Cache under PICK
			return getAvailabilityForSitePagesConfig.isUseDefaultFulfillmentType() && null != getAvailabilityForSitePagesConfig.getDefaultFulfillmentType() ? 
					getAvailabilityForSitePagesConfig.getDefaultFulfillmentType() : reqFulfillmentType;
		}
		
	}
	
	private Collection<List<String>> convertToBatch(Set<String> products) {		
		final AtomicInteger counter = new AtomicInteger();
		Collection<List<String>> requestBatches = products.stream()
				.collect(Collectors.groupingBy(it -> counter.getAndIncrement() / batchSize)).values();
		
		return requestBatches;
	}
	
	/**
	 * Update availability cache with give product availability details
	 *
	 * @param availabilityByLocationMap
	 */
	public void updateCache(Map<String, AvailabilityByLocation> availabilityByLocationMap) {
		
			Map<String, LocationAvailabilityRedisCacheDto> cacheMap = new HashMap<String, LocationAvailabilityRedisCacheDto>();
			availabilityByLocationMap.entrySet().forEach(productEntry -> {
				String porductId = productEntry.getKey();
				AvailabilityByLocation availabilityByLocation = productEntry.getValue();
				String cacheKey = null;
				if (getAvailabilityForSitePagesConfig.isUseRedisTemplate()) {
					cacheKey = createLocationAvailabilityRedisCacheKey(
							List.of(FulfillmentTypeEnum.SHIP.toString(), FulfillmentTypeEnum.SHIPTOHOME.toString()).contains(fulfillmentType)
								? 	atpLocationCacheName
								:	locationCacheName,
							porductId, availabilityByLocation.getLocation());
				} else {
					cacheKey = AvailabilityUtils.createLocationAvailabilityRedisCacheKey(porductId, availabilityByLocation.getLocation());
				}
				String cacheName = locationCacheName + "_" + availabilityByLocation.getLocation();
				try {
					LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = new LocationAvailabilityRedisCacheDto();
					locationAvailabilityRedisCacheDto.setProductId(porductId);
					locationAvailabilityRedisCacheDto.setLocationId(availabilityByLocation.getLocation());
					List<AtpByFulfillmentType> atpByFulfillmentTypeList = new ArrayList<AtpByFulfillmentType>();
					AtpByFulfillmentType atpByFulfillmentType = new AtpByFulfillmentType();
					atpByFulfillmentType.setAtp(availabilityByLocation.getAtp());
					atpByFulfillmentType.setAtpStatus(availabilityByLocation.getAtpStatus());
					atpByFulfillmentType.setFulfillmentType(
							//DEF-2619 REDIS Cache Miss Handling: Put SAMEDAY availability into Cache under PICK
							//(getAvailabilityForSitePagesConfig.isUseDefaultFulfillmentType() && null != getAvailabilityForSitePagesConfig.getDefaultFulfillmentType()) ? 
							//getAvailabilityForSitePagesConfig.getDefaultFulfillmentType() : fulfillmentType);
							getCacheFulfillmentType(fulfillmentType));
					atpByFulfillmentType.setUpdateTime(AvailabilityUtils.currentPSTDateTime());
					atpByFulfillmentTypeList.add(atpByFulfillmentType);
					locationAvailabilityRedisCacheDto.setAtpByFulfillmentTypes(atpByFulfillmentTypeList);
					
					long startTime = System.currentTimeMillis();
					LocationAvailabilityRedisCacheDto existingCache = null;
					//OMM-761
					if(getAvailabilityForSitePagesConfig.isUseRedisTemplate()) {
						existingCache = (LocationAvailabilityRedisCacheDto)invRedisTemplate.opsForValue().get(cacheKey);
					} else {
						existingCache = (LocationAvailabilityRedisCacheDto) cacheService.getCacheItem(cacheName, cacheKey);
					}
					//OMM-761 - End
					if(null != existingCache) {
						LocationAvailabilityRedisCacheDto mergedCache = mergeCacheData(existingCache, locationAvailabilityRedisCacheDto);
						//OMM-761
						if(getAvailabilityForSitePagesConfig.isUseRedisTemplate()) {
							invRedisTemplate.opsForValue().set(cacheKey, mergedCache, timeToLive, TimeUnit.SECONDS);
							log.info("Successfully updated cache with key: {}, tooks: {}", cacheKey, System.currentTimeMillis() - startTime);
						} else {
							cacheService.putCacheItem(cacheName, cacheKey, mergedCache);
							log.info("Successfully updated cache: {}, key: {}, tooks: {}", cacheName, cacheKey, System.currentTimeMillis() - startTime);
						}
						//OMM-761 - End
					} else {
						//OMM-761
						if(getAvailabilityForSitePagesConfig.isUseRedisTemplate()) {
							invRedisTemplate.opsForValue().set(cacheKey, locationAvailabilityRedisCacheDto, timeToLive, TimeUnit.SECONDS);
							log.info("Successfully updated with key: {}, tooks: {}", cacheKey, System.currentTimeMillis() - startTime);
						} else {
							cacheService.putCacheItem(cacheName, cacheKey, locationAvailabilityRedisCacheDto);
							log.info("Successfully updated cache: {}, key: {}, tooks: {}", cacheName, cacheKey, System.currentTimeMillis() - startTime);
						}
						//OMM-761 - END
					}
					
					//AV-3166 Send atp as 0 to ATG if cache have -ve atp due to yantriks availability miss
					if(availabilityHubMissConfiguration.getHandleCacheNegetiveAtp() && availabilityByLocation.getAtp() < 0) {
						availabilityByLocation.setAtp(0D);
					}
				} catch(Exception ex) {
					log.error("An exception occured while updating cache: {}, key: {}",cacheName, cacheKey, ex);
				}
			});
	}
	
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


	public CacheAvailabilityServiceV2 clone() {
		CacheAvailabilityServiceV2 cacheAvailabilityService = new CacheAvailabilityServiceV2();
		cacheAvailabilityService.setInvRedisTemplate(this.getInvRedisTemplate());
		cacheAvailabilityService.setLocationCacheName(this.getLocationCacheName());
		cacheAvailabilityService.setCacheService(this.getCacheService());
		cacheAvailabilityService.setAssumedAtp(this.getAssumedAtp());
		cacheAvailabilityService.setDefaultAtpStatus(this.getDefaultAtpStatus());
		cacheAvailabilityService.setWaitTimeoutInSeconds(this.getWaitTimeoutInSeconds());
		cacheAvailabilityService.setThreadPoolTaskExecutor(this.threadPoolTaskExecutor);
		cacheAvailabilityService.setAvailabilityHubAvailabilityService(this.availabilityHubAvailabilityService);
		cacheAvailabilityService.setBatchSize(this.batchSize);
		cacheAvailabilityService.setAtpLocationCacheName(this.atpLocationCacheName);
		cacheAvailabilityService.setGetAvailabilityForSitePagesConfig(this.getAvailabilityForSitePagesConfig);
		
		//DEF-1311 Add switch based integration to new Yantriks inventory availability API

		cacheAvailabilityService.setHandleSameDayCacheMiss(this.handleSameDayCacheMiss);
		
		cacheAvailabilityService.setAvailabilityHubMissConfiguration(this.availabilityHubMissConfiguration);
		cacheAvailabilityService.setTimeToLive(timeToLive);
		return cacheAvailabilityService;
	}

	
	public Map<String, Map<String, Set<String>>> getCacheMissMap() {
		return this.cacheMissMap;
	}
	
	/**
	 * OMM-807: Temp fix for Invalid Kohl's store from ATG
	 * If cache miss occur for any Kohl's store (store id staring with "80") which is not belongs to configurable list, 
	 * then no need to check inventory in yantriks or update cache. send back assumedAtp and assumedATPStatus to ATG
	 * @param location
	 * @return
	 */
	private boolean isValidStore(String location) {
		if(location.startsWith("80") && !CollectionUtils.isEmpty(getAvailabilityForSitePagesConfig.getKohlsStores())) {
			return getAvailabilityForSitePagesConfig.getKohlsStores().contains(location);
		} else {
			return true;
		}		
	}


	/**
	 * Set atp location cache with given product availability details.
	 * It is processed and updated from locationAvailabilityResponse(Yantriks).
	 * <ul>
	 * <li>
	 *     Redis Key format for SHIP/SHIPTOHOME 	: atpLocationCache_{productId>}_{locationId}
	 * </li>
	 * <li>
	 *     Redis Key format for PICK/SAMEDAY		: locationAvailability_{productId}_{locationId}
	 * </li>
	 * </ul>
	 *
	 * @param locationAvailabilityResponse list of AvailabilityByProduct which is received from Yantriks and will be updated in cache
	 * @param fulfillmentType              fulfillmentType to filter the cache response
	 * @param cacheMissList		 list of cache miss keys in the format <productId>_<locationId>
	 * @return list of miss happened in both cache and Yantriks in the format <productId>_<locationId>
	 */
	public List<String> setAtpLocationCache(List<AvailabilityByProduct> locationAvailabilityResponse, String fulfillmentType, List<String> cacheMissList) {
		String cacheName = List.of(FulfillmentTypeEnum.SHIP.toString(), FulfillmentTypeEnum.SHIPTOHOME.toString())
				.contains(fulfillmentType)
				? atpLocationCacheName
				: locationCacheName;
		Map<String, LocationAvailabilityRedisCacheDto> payloadToUpdateCache = locationAvailabilityResponse.stream()
				.flatMap(availabilityByProduct -> availabilityByProduct.getAvailabilityDetails().getAvailabilityByFT()
						.stream()
						.filter(availabilityByFT -> availabilityByFT.getFulfillmentType().equals(fulfillmentType))
						.flatMap(availabilityByFT -> availabilityByFT.getLocations().stream())
                        .map(location -> {
                            LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = new LocationAvailabilityRedisCacheDto();
                            locationAvailabilityRedisCacheDto.setProductId(availabilityByProduct.getProductId());
                            locationAvailabilityRedisCacheDto.setLocationId(location.getLocation());
                            locationAvailabilityRedisCacheDto.setAtpByFulfillmentTypes(availabilityByProduct.getAvailabilityDetails().getAvailabilityByFT().stream()
                                    .map(availabilityByFT -> {
											AtpByFulfillmentType atpByFulfillmentType = new AtpByFulfillmentType();
											atpByFulfillmentType.setFulfillmentType(availabilityByFT.getFulfillmentType());
											atpByFulfillmentType.setAtp(location.getAtp());
											atpByFulfillmentType.setAtpStatus(location.getAtpStatus());
											atpByFulfillmentType.setUpdateTime(AvailabilityUtils.currentPSTDateTime());
											return atpByFulfillmentType;
                                    })
									.collect(Collectors.toList()));
                            return locationAvailabilityRedisCacheDto;
                        }))
				.collect(Collectors.toMap(locationAvailabilityRedisCacheDto ->
								String.format("%s_%s_%s",
										cacheName,
										locationAvailabilityRedisCacheDto.getProductId(),
										locationAvailabilityRedisCacheDto.getLocationId()),
						locationAvailabilityRedisCacheDto -> locationAvailabilityRedisCacheDto));

		List<String> cacheAndYantriksMissKeys = new ArrayList<>();

		if(!payloadToUpdateCache.isEmpty()){
			try {
				log.info("Setting keys in redis cache for keys: {}", payloadToUpdateCache.keySet());
				invRedisTemplate.opsForValue().multiSet(payloadToUpdateCache);
				log.debug("Successfully set keys in redis cache: {}", payloadToUpdateCache.keySet());

				//Find cache & Yantriks miss keys
				List<String> cacheUpdatedKeys = payloadToUpdateCache.keySet().stream()
						.map(key -> key.substring(key.indexOf("_") + 1))
						.collect(Collectors.toList());
				cacheAndYantriksMissKeys = cacheMissList.stream()
						.filter(s -> !cacheUpdatedKeys.contains(s))
						.collect(Collectors.toList());

			} catch (Exception e) {
				log.error("Exception occurred while setting {} cache data in redis cache: {}",cacheName, e.getMessage(), e);
			}
		}
		return cacheAndYantriksMissKeys;
	}
}
