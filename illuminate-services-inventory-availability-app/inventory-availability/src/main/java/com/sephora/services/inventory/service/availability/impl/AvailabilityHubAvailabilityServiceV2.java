package com.sephora.services.inventory.service.availability.impl;

import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.availabilityhub.client.AvailabilityClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.model.networkThreshold.redis.NetworkThresholdCacheDto;
import com.sephora.services.inventory.service.availability.AvailabilityService;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.GetAvailabilityResponseData;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByFT;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemRequestDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.model.dto.Location;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.sephora.services.inventoryavailability.config.redis.GetAvailabilityForSitePagesAsyncConfig.V2_AH_THREAD_POOL;

@Log4j2
@Service("AvailabilityHubAvailabilityServiceV2")
@Getter
@Setter
public class AvailabilityHubAvailabilityServiceV2 implements AvailabilityService {
	
	@Autowired
	private AvailabilityClient availabilityClient;
	
	@Value("${inventory.defaultSegment}")
	private String defaultSegment;
	
	@Value("${inventory.defaultOrgId}")
	private String defaultOrgId;
	
	@Value("${inventory.defaultTransactionType}")
	private String defaultTransactionType;
	
	@Value("${inventory.site-page-availability.assumedAtp}")
	private double assumedAtp;
	
	@Value("${inventory.site-page-availability.defaultAtpStatus:OOS}")
	private String defaultAtpStatus;
	
	@Autowired
	InventoryApplicationConfig config;
	
	@Autowired
	@Qualifier(V2_AH_THREAD_POOL)
	private AsyncTaskExecutor threadPoolTaskExecutor;
	
	@Value("${inventory.site-page-availability.availabilityhub.async.batchSize:1}")
	private int batchSize;
	
	@Autowired
    RequestLoggingFilterConfig requestLoggingFilterConfig;
	
	@Autowired
	private AvailabilityHubMissConfiguration availabilityHubMissConfiguration;
	
	//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
	private PriorityConfig priorityConfig;
	
	/**
	 * To find availability for missing product in cache from Yantriks
	 * @param productList
	 * @param locationId
	 * @param sellingChannel
	 * @param fulfillmentType
	 * @return
	 */
	public Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> findAvailabilityForCacheMiss(List<String> productList, String locationId, String sellingChannel, String fulfillmentType) {
		Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> availabilityByLocationMap = new HashMap<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>();
		//Check weather batch is needed
		if(productList.size() < batchSize) {
			return getAvailabilityFromAH(productList, locationId, sellingChannel, fulfillmentType);
		} else {
			// Convert product list to batches
			Collection<List<String>> productBatch = convertToBatch(productList);
			// Get availability for each batch of product async. 
			List<CompletableFuture<Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>>> availabilityByLocationFutureList  = 
					productBatch.stream().map(productListBatch -> CompletableFuture.supplyAsync(()-> {
				return getAvailabilityFromAH(productListBatch, locationId, sellingChannel, fulfillmentType);
			}, threadPoolTaskExecutor)).collect(Collectors.toList());
			
			//Collect get availability for each batch
			availabilityByLocationFutureList.forEach(availabilityByLocationFuture-> {
				
				try {
					Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> availabilityByLocationMapBatch = availabilityByLocationFuture.get();
					if(null != availabilityByLocationMapBatch) {
						availabilityByLocationMap.putAll(availabilityByLocationMapBatch);
					}
				} catch (InterruptedException e) {
					log.error("An exception occured while collecting response from yentriks for each batch", e);
				} catch (ExecutionException e) {
					log.error("An exception occured while collecting response from yentriks for each batch", e);
				}
				
			});
		}
							
		return availabilityByLocationMap;
	}
	
	/**
	 * Get availability for given product list and location id from yantriks and build response  
	 * @param productList
	 * @param locationId
	 * @param sellingChannel
	 * @param fulfillmentType
	 * @return
	 */
	private Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> getAvailabilityFromAH(List<String> productList, String locationId, String sellingChannel, String fulfillmentType) {		
		List<Location> locationList = new ArrayList<Location>();			
		GetAvailabilityResponseData getAvailabilityResponseData = null;
		InventoryItemsRequestDto request = buildAhAvailabilityRequest(productList, Arrays.asList(locationId), fulfillmentType, sellingChannel);	
		try {						
			getAvailabilityResponseData = availabilityClient.getItemsInventoryAvailability(request, fulfillmentType,  MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
			log.debug("Successfully fetched availability form next priority source (yantriks) with products: {}", getAvailabilityResponseData);
			if(null != getAvailabilityResponseData) {
				Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> availabilityByLocationMap = buildAvailabilityByLocationMap(getAvailabilityResponseData, fulfillmentType);
				
				//AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
				if(availabilityHubMissConfiguration.getEnabled() && availabilityByLocationMap.keySet().size() < productList.size()) {
					productList.removeAll(availabilityByLocationMap.keySet());
					availabilityByLocationMap.putAll(handleAvailabilityHubMiss(productList, locationId));
				}
				//AV-3166 end 
				return availabilityByLocationMap;
			}
		} catch(Exception ex) {	
			//AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
			if(availabilityHubMissConfiguration.getEnabled() && ex instanceof NoContentException) {				
				log.warn("No Content exception while getting data from Yantriks for request: {}", request);
				return handleAvailabilityHubMiss(productList, locationId); 
			}
			//AV-3166 end 
			log.error("Exception while getting data from Yantriks for request: {}", request, ex);
		}
		return null;
	}
	
	/**
	 * AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
	 * 
	 * @param productList
	 * @param locationId
	 * @return
	 */
	private Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> handleAvailabilityHubMiss(List<String> productList, String locationId) {
		return productList.stream().collect(Collectors.toMap(productId -> productId, productId -> com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation.builder()
								.atp(availabilityHubMissConfiguration.getDefaultAtp())
								.atpStatus(availabilityHubMissConfiguration.getDefaultAtpStatus())
								.location(locationId).build()));		
	}
	
	/**
	 * 
	 * @param productList
	 * @param sellingChannel
	 * @return
	 */
	public Map<String, NetworkThresholdCacheDto> getNetworkAvailability(List<String> productList, String sellingChannel, boolean cacheMiss) {
		Map<String, NetworkThresholdCacheDto> networkThresholdMap = new HashMap<String, NetworkThresholdCacheDto>();
		if(productList.size() < batchSize) {
			return getNetworkAvailabilityAh(productList, sellingChannel, cacheMiss);
		} else {
			Collection<List<String>> productBatch = convertToBatch(productList);
			List<CompletableFuture<Map<String, NetworkThresholdCacheDto>>> networkAvailabilityFutureList  = 
					productBatch.stream().map(productListBatch -> CompletableFuture.supplyAsync(()-> {
				return getNetworkAvailabilityAh(productList, sellingChannel, cacheMiss);
			}, threadPoolTaskExecutor)).collect(Collectors.toList());
			
			//Collect get availability for each batch
			networkAvailabilityFutureList.forEach(networkAvailabilityFuture-> {
				
				try {
					Map<String, NetworkThresholdCacheDto> networkAvailabilityMapBatch = networkAvailabilityFuture.get();
					if(null != networkAvailabilityMapBatch) {
						networkThresholdMap.putAll(networkAvailabilityMapBatch);
					}
				} catch (InterruptedException e) {
					log.error("An exception occured while collecting response from yentriks for each batch", e);
				} catch (ExecutionException e) {
					log.error("An exception occured while collecting response from yentriks for each batch", e);
				}
				
			});
			return networkThresholdMap;
		}
	}
	
	private Map<String, NetworkThresholdCacheDto> getNetworkAvailabilityAh(List<String> productList, String sellingChannel, boolean cacheMiss) {
		Map<String, NetworkThresholdCacheDto> networkThresholdMap = new HashMap<String, NetworkThresholdCacheDto>();
		try {
			log.debug("Creating network availability request for yantriks product(s): {} and sellingChannel(s): {}", Arrays.toString(productList.toArray()), sellingChannel);
			List<InventoryItemRequestDto> itemList = productList.stream().map(productId -> {			
				return InventoryItemRequestDto.builder()
						.productId(productId)
						.fulfillmentType(AvailabilityConstants.FULFILLMENT_TYPE_SHIP)
						.uom(AvailabilityConstants.UOM_EACH).build();
			}).collect(Collectors.toList());
			
			InventoryItemsRequestDto request = InventoryItemsRequestDto.builder().orgId(defaultOrgId)
					.segment(defaultSegment).sellingChannel(sellingChannel)				
					.transactionType(defaultTransactionType).products(itemList).build();
			log.debug("Created availability request for yantriks: {}", request);
			
			GetAvailabilityResponseData getAvailabilityResponseData = availabilityClient.getItemsInventoryAvailability(request, AvailabilityConstants.FULFILLMENT_TYPE_SHIP,  MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
			if(null != getAvailabilityResponseData) {
				getAvailabilityResponseData.getAvailabilityByProducts().stream().forEach(availabilityByProducts -> {
					String productId = availabilityByProducts.getProductId();
					availabilityByProducts.getAvailabilityByFulfillmentTypes().stream()
							.forEach(availabilityByFulfillmentTypes -> availabilityByFulfillmentTypes.getAvailabilityDetails()
									.stream().forEach(availabilityDetails -> {
										networkThresholdMap.put(productId,
												NetworkThresholdCacheDto.builder().productId(productId)
														.atp(availabilityDetails.getAtp())
														.atpStatus(availabilityDetails.getAtpStatus()).build());
									}));
				});
			}
			//AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
			if(cacheMiss && availabilityHubMissConfiguration.getEnabled() && networkThresholdMap.keySet().size() < productList.size()) {
				productList.removeAll(networkThresholdMap.keySet());
				networkThresholdMap.putAll(handleNetworkAvailabilityHubMiss(productList));
			}
			//AV-3166 End
		}catch(Exception ex) {
			//AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
			if(cacheMiss && availabilityHubMissConfiguration.getEnabled() && ex instanceof NoContentException) {				
				log.warn("No Content exception while getting network availability from Yantriks for productList: {}", Arrays.toString(productList.toArray()));
				return handleNetworkAvailabilityHubMiss(productList); 
			}
			//AV-3166 End
			log.error("Exception while getting network availability from Yantriks for request: {}", ex);
		}
		
		return networkThresholdMap;
	}
	
	/**
	 * AV-3166 Availability] Update Redis cache when Yantriks has no inventory record for a SKU
	 * 
	 */
	private Map<String, NetworkThresholdCacheDto> handleNetworkAvailabilityHubMiss(List<String> productList) {
		return productList.stream().collect(Collectors.toMap(productId -> productId, productId -> NetworkThresholdCacheDto.builder().productId(productId)
						.atp(availabilityHubMissConfiguration.getDefaultAtp())
						.atpStatus(availabilityHubMissConfiguration.getDefaultAtpStatus()).build()));
		
	}
	
	private Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> buildAvailabilityByLocationMap(GetAvailabilityResponseData getAvailabilityResponseData, String fulfillmentType) {
		Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> availabilityByLocationMap 
			= new HashMap<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>();
		getAvailabilityResponseData.getAvailabilityByProducts().stream().forEach(availabilityByProduct -> {
			availabilityByProduct.getAvailabilityByFulfillmentTypes().stream().forEach(availabilityByFulfillmentTypes -> {
				if(fulfillmentType.equals(availabilityByFulfillmentTypes.getFulfillmentType())) {
					availabilityByFulfillmentTypes.getAvailabilityDetails().stream().forEach(availabilityDetails -> {
						availabilityDetails.getAvailabilityByLocations().stream().forEach(availabilityByLocation -> {
							availabilityByLocationMap.put(availabilityByProduct.getProductId(),
								com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation.builder()
								.atp(availabilityByLocation.getAtp())
								.atpStatus(availabilityByLocation.getAtpStatus())
								.location(availabilityByLocation.getLocationId()).build());
						});
					});
					
				}
			});
		});
		return availabilityByLocationMap;
	}

	private Collection<List<String>> convertToBatch(List<String> products) {		
		final AtomicInteger counter = new AtomicInteger();
		Collection<List<String>> requestBatches = products.stream()
				.collect(Collectors.groupingBy(it -> counter.getAndIncrement() / batchSize)).values();
		
		return requestBatches;
	}
	
	/**
	 * For Availability hub only call
	 * @param productList
	 * @param locations
	 * @param fulfillmentType
	 * @param sellingChannel
	 * @param productsByLocation
	 * @return
	 */
	public Map<String, AvailabilityByProduct> getAvailabiliy(List<String> productList, List<String> locations, String fulfillmentType, String sellingChannel,
															 List<String> productsByLocation) {
		Map<String, AvailabilityByProduct> availabilityByProducts = new HashMap<String, AvailabilityByProduct>();
		
		Collection<List<String>> productBatch = convertToBatch(productList);
		log.debug("Converted {} of procuts into {} batches.", productList.size(), productBatch.size());

		// fetch availability and build response for each batch Asynchronously 
		List<CompletableFuture<Map<String, AvailabilityByProduct>>> availabilityByLocationFutureList  = 
				productBatch.stream().map(productListBatch -> CompletableFuture.supplyAsync(()-> {
					Map<String, AvailabilityByProduct> availabilityByProductBatch = new HashMap<String, AvailabilityByProduct>();
					InventoryItemsRequestDto request = buildAhAvailabilityRequest(productListBatch, locations, fulfillmentType, sellingChannel);
					try {
						GetAvailabilityResponseData getAvailabilityResponseData = availabilityClient.getItemsInventoryAvailability(request, fulfillmentType, MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
						log.debug("Converting availability response from yantriks to caller format: ", getAvailabilityResponseData);
						availabilityByProductBatch = buildAvailabilityByProduct(getAvailabilityResponseData, fulfillmentType, locations);
						
					} catch(Exception ex) {
						log.error("An exception occured while fetching availability from yantriks, request: {}", request , ex);
					}
					
					// handle missing products in yantriks
					if(productListBatch.size() != availabilityByProductBatch.keySet().size()) {
						productListBatch.removeAll(availabilityByProductBatch.keySet());
						availabilityByProducts.putAll(buildDefaultAvailabilityProductsForMissingProducts(productListBatch, locations, fulfillmentType));
					}
					return availabilityByProductBatch;
		}, threadPoolTaskExecutor)).collect(Collectors.toList());
		
		availabilityByLocationFutureList.forEach(availabilityByLocationFuture-> {			
			try {
				Map<String, AvailabilityByProduct> availabilityByProductMapBatch = availabilityByLocationFuture.get();
				if(null != availabilityByProductMapBatch) {
					availabilityByProducts.putAll(availabilityByProductMapBatch);
				}
			} catch (InterruptedException e) {		
				log.error("An exception occured while collecting response from yentriks for each batch", e);
			} catch (ExecutionException e) {
				log.error("An exception occured while collecting response from yentriks for each batch", e);
			}
			
		});
		
		return availabilityByProducts;
	}
	
	/**
	 * Create availability request for availability hub (yantriks) for given product list and location list
	 * @param products
	 * @param locations
	 * @param fulfillmentType
	 * @param sellingChannel
	 * @return
	 */
	private InventoryItemsRequestDto buildAhAvailabilityRequest(List<String> products, List<String> locations, String fulfillmentType, String sellingChannel) {
		log.debug("Creating availability request for yantriks product(s): {} and location(s): {}", Arrays.toString(products.toArray()), Arrays.toString(locations.toArray()));
		List<InventoryItemRequestDto> itemList = products.stream().map(productId -> {
			List<Location> ahLocations = locations.stream()
					.map(locationId -> Location.builder().locationId(locationId)
							.locationType(config.getDcLocations().contains(locationId) ? AvailabilityConstants.DC : AvailabilityConstants.STORE)
							.build())
					.collect(Collectors.toList());
			return InventoryItemRequestDto.builder()
					.productId(productId)
					.fulfillmentType(fulfillmentType)
					.uom(AvailabilityConstants.UOM_EACH).locations(ahLocations).build();
		}).collect(Collectors.toList());
		
		InventoryItemsRequestDto request = InventoryItemsRequestDto.builder().orgId(defaultOrgId)
				.segment(defaultSegment).sellingChannel(sellingChannel)				
				.transactionType(defaultTransactionType).products(itemList).build();
		log.debug("Created availability request for yantriks: {}", request);
		return request;
	}
	
	/**
	 * Build response for missing product with default value. 
	 * @param products
	 * @param locations
	 * @param fulfillmentType
	 * @param isDetails
	 * @return
	 */
	Map<String, AvailabilityByProduct> buildDefaultAvailabilityProductsForMissingProducts(List<String> products, 
			List<String> locations, String fulfillmentType) {
		Map<String, AvailabilityByProduct> availabilityByProducts = new HashMap<String, AvailabilityByProduct>();
		
		products.stream().forEach(productId -> {
			List<AvailabilityByFT> availabilityByFTList = new ArrayList<AvailabilityByFT>();
			AvailabilityByFT availabilityByFT = AvailabilityByFT.builder().fulfillmentType(fulfillmentType)
					.locations(new ArrayList<com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>()).build();


			availabilityByFT.getLocations().addAll(locations.stream().map(
							locationId -> com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation
									.builder().location(locationId)
									//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
									.atp(null != priorityConfig ? priorityConfig.getAssumedATP() : assumedAtp)
									.atpStatus(null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus).build())
					//AV-3195 - END
					.collect(Collectors.toList()));

			availabilityByFTList.add(availabilityByFT);
			availabilityByProducts.put(productId, AvailabilityByProduct.builder().productId(productId)
				.availabilityDetails(AvailabilityDetail.builder().availabilityByFT(availabilityByFTList).build()).build());
		});
		
		return availabilityByProducts;
	}
	
	/**
	 * To build AvailabilityByProduct object for send back to caller
	 *
	 * @param getAvailabilityResponseData
	 * @param productsByLocation
	 * @return
	 */
	private Map<String, AvailabilityByProduct> buildAvailabilityByProduct(GetAvailabilityResponseData getAvailabilityResponseData,
																		  String fulfillmentType, List<String> locations) {
		final Map<String, AvailabilityByProduct> availabilityByProductMap = new HashMap<String, AvailabilityByProduct>();
		if(null == getAvailabilityResponseData) {
			return availabilityByProductMap; 
		}else {
			try {
				getAvailabilityResponseData.getAvailabilityByProducts().stream().forEach(availabilityByProducts -> {
					String productId = availabilityByProducts.getProductId();
					List<AvailabilityByFT> availabilityByFTList = new ArrayList<AvailabilityByFT>();
					availabilityByProducts.getAvailabilityByFulfillmentTypes().forEach(availabilityByFulfillmentTypes -> {
						String ahFulfillmentType = availabilityByFulfillmentTypes.getFulfillmentType();
						AvailabilityByFT availabilityByFT = AvailabilityByFT.builder().fulfillmentType(ahFulfillmentType)
								.locations(new ArrayList<com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>()).build();
						
						if(null != fulfillmentType && !ahFulfillmentType.equals(fulfillmentType)) {
							return;
						}
						
						availabilityByFulfillmentTypes.getAvailabilityDetails().forEach(availabilityDetails -> {
							availabilityDetails.getAvailabilityByLocations().stream().forEach(availabilityByLocation -> {

								availabilityByFT.getLocations().add(
										com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation
												.builder().atp(availabilityByLocation.getAtp())
												.atpStatus(availabilityByLocation.getAtpStatus())
												.location(availabilityByLocation.getLocationId()).build());

								
							});
							if(null != locations && locations.size() != availabilityByFT.getLocations().size()) {
								locations.stream().forEach(locationId -> {
									List<com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> missingLocs = 
											new ArrayList<com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>();
									if(!availabilityByFT.getLocations().stream().anyMatch(locationFT -> locationFT.getLocation().equals(locationId))) {
										missingLocs.add(com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation
														.builder()
														//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
														.atp(null != priorityConfig ? priorityConfig.getAssumedATP() : assumedAtp)
														.atpStatus(null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus)
														//AV-3195 - End
														.location(locationId).build());
									}
									availabilityByFT.getLocations().addAll(missingLocs);
								});
							}
						});
						availabilityByFTList.add(availabilityByFT);
					});
					if(!availabilityByFTList.isEmpty() && availabilityByProductMap.containsKey(productId)) {
						AvailabilityDetail availabilityDetail = availabilityByProductMap.get(productId).getAvailabilityDetails();
						if(null != availabilityDetail.getAvailabilityByFT()) {
							availabilityDetail.getAvailabilityByFT().addAll(availabilityByFTList);
						} else {
							availabilityDetail.setAvailabilityByFT(availabilityByFTList);
						}
					} else if (!availabilityByFTList.isEmpty()){
					
						AvailabilityByProduct availabilityByProduct = AvailabilityByProduct.builder().productId(productId)
						 .availabilityDetails(AvailabilityDetail.builder().availabilityByFT(availabilityByFTList).build()).build();
						availabilityByProductMap.put(productId, availabilityByProduct);
					}
				});
			} catch(Exception ex) {
				log.error("An exception occured while building availabilityByProduct from yantriks response", ex);
			}
			return availabilityByProductMap;
		}
	}

	public List<AvailabilityByProduct> getAtpLocationFromYantriks(List<String> cacheMissList, String fulfillmentType, String sellingChannel) {
		List<String> productList = cacheMissList.stream().map(productLocation -> productLocation.split("_")[0]).distinct().collect(Collectors.toList());
		List<String> locationList = cacheMissList.stream().map(productLocation -> productLocation.split("_")[1]).distinct().collect(Collectors.toList());

		InventoryItemsRequestDto request = buildAhAvailabilityRequest(productList, locationList, fulfillmentType, sellingChannel);
		GetAvailabilityResponseData getAvailabilityResponseData = null;
		List<AvailabilityByProduct> availabilityByLocationList = new ArrayList<>();
		try{
			getAvailabilityResponseData = availabilityClient.getItemsInventoryAvailability(request, fulfillmentType,  MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
			if(null != getAvailabilityResponseData) {
				availabilityByLocationList = buildAvailabilityByLocationList(getAvailabilityResponseData, fulfillmentType);
				log.info("Successfully fetched availability from next priority source (Yantriks) for cache miss product_location list: {}, processed response: {}", cacheMissList, availabilityByLocationList);
			}
		} catch(Exception ex) {
			log.error("An exception occurred while fetching availability from Yantriks for cache miss product_location list: {}, request: {}", cacheMissList, request , ex);
		}
        return availabilityByLocationList;
    }

	private List<AvailabilityByProduct> buildAvailabilityByLocationList(GetAvailabilityResponseData getAvailabilityResponseData, String fulfillmentType) {
		List<AvailabilityByProduct> availabilityByLocationList
				= new ArrayList<>();

		getAvailabilityResponseData.getAvailabilityByProducts().stream().forEach(availabilityByProduct -> {
			ArrayList<AvailabilityByFT> availabilityByFTS = new ArrayList<>();
			availabilityByProduct.getAvailabilityByFulfillmentTypes().stream().forEach(availabilityByFulfillmentTypes -> {
				if (fulfillmentType.equals(availabilityByFulfillmentTypes.getFulfillmentType())) {
					List<com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> availabilityByLocations = new ArrayList<>();
					availabilityByFulfillmentTypes.getAvailabilityDetails().stream().forEach(availabilityDetails -> {
						ArrayList<AvailabilityByLocation> availabilityByLocationsList = new ArrayList<>();
						availabilityDetails.getAvailabilityByLocations().stream().forEach(availabilityByLocation -> {
							availabilityByLocations.add(
									com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation
									.builder()
											.atp(availabilityByLocation.getAtp())
											.location(availabilityByLocation.getLocationId())
											.atpStatus(availabilityByLocation.getAtpStatus())
											.build()
									);
						});
					});
					availabilityByFTS.add(AvailabilityByFT.builder()
							.fulfillmentType(fulfillmentType)
							.locations(availabilityByLocations)
							.build()
					);
				}
			});
			availabilityByLocationList.add(AvailabilityByProduct.builder()
					.productId(availabilityByProduct.getProductId())
					.availabilityDetails(AvailabilityDetail.builder()
							.availabilityByFT(availabilityByFTS).build()).build());
		});
		return availabilityByLocationList;
	}

	@Override
	public AvailabilityService clone() {
		AvailabilityHubAvailabilityServiceV2 availabilityHubAvailabilityService = new AvailabilityHubAvailabilityServiceV2();
		availabilityHubAvailabilityService.setAvailabilityClient(this.getAvailabilityClient());
		availabilityHubAvailabilityService.setDefaultOrgId(this.getDefaultOrgId());
		availabilityHubAvailabilityService.setDefaultSegment(this.getDefaultSegment());
		availabilityHubAvailabilityService.setDefaultTransactionType(this.getDefaultTransactionType());
		availabilityHubAvailabilityService.setConfig(this.getConfig());
		availabilityHubAvailabilityService.setAssumedAtp(this.getAssumedAtp());
		availabilityHubAvailabilityService.setDefaultAtpStatus(this.getDefaultAtpStatus());
		availabilityHubAvailabilityService.setThreadPoolTaskExecutor(this.threadPoolTaskExecutor);
		availabilityHubAvailabilityService.setBatchSize(this.batchSize);
		availabilityHubAvailabilityService.setRequestLoggingFilterConfig(this.requestLoggingFilterConfig);
		availabilityHubAvailabilityService.setAvailabilityHubMissConfiguration(this.availabilityHubMissConfiguration);
		return availabilityHubAvailabilityService;
	}	
}
