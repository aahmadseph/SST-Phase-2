package com.sephora.services.inventory.service.availability.impl;

import static com.sephora.services.inventoryavailability.config.redis.GetAvailabilityForSitePagesAsyncConfig.AH_THREAD_POOL;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.INSTOCK;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.OOS;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.LIMITEDSTOCK;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.stereotype.Service;

import com.sephora.services.availabilityhub.client.AvailabilityHubReadClusterClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.service.availability.AvailabilityService;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.request.AggregatedKey;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.request.ReadClusterAvailabilityRequest;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.response.BulkResponse;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.readcluster.response.ReadClusterAvailabilityResponse;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.GetAvailabilityResponseData;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByFT;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemRequestDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.model.dto.Location;

import lombok.Data;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service("ReaddClusterAHAvailabilityHubService")
@Data
@RefreshScope
public class ReaddClusterAHAvailabilityHubService implements AvailabilityService {
	
	@Autowired
    AvailabilityHubReadClusterClient availabilityHubReadClusterClient;
	
	@Value("${inventory.site-page-availability.availabilityhub.async.batchSize:1}")
	private int batchSize;
	
	@Autowired
	InventoryApplicationConfig config;
	
	@Autowired
	@Qualifier(AH_THREAD_POOL)
	private AsyncTaskExecutor threadPoolTaskExecutor;
	
	@Value("${inventory.site-page-availability.defaultAtpStatus:OOS}")
	private String defaultAtpStatus;
	
	@Value("${inventory.site-page-availability.assumedAtp}")
	private double assumedAtp;
	
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
	public Map<String, AvailabilityByLocation> findAvailabilityForCacheMiss(List<String> productList, String locationId, String sellingChannel, String fulfillmentType) {
		Map<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation> availabilityByLocationMap = new HashMap<String, com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>();
		//Check weather batch is needed
		if(productList.size() < batchSize) {
			return getAvailabilityFromAH(productList, locationId, sellingChannel, fulfillmentType);
		} else {
			// Convert product list to batches
			Collection<List<String>> productBatch = convertToBatch(productList);
			// Get availability for each batch of product async. 
			List<CompletableFuture<Map<String, AvailabilityByLocation>>> availabilityByLocationFutureList  = 
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
	 * For Availability hub only call
	 * @param products
	 * @param locations
	 * @param fulfillmentType
	 * @param sellingChannel
	 * @param isDetails
	 * @return
	 */
	public Map<String, AvailabilityByProduct> getAvailabiliy(List<String> productList, List<String> locations, String fulfillmentType, String sellingChannel, boolean isDetails) {
		Map<String, AvailabilityByProduct> availabilityByProducts = new HashMap<String, AvailabilityByProduct>();
		
		Collection<List<String>> productBatch = convertToBatch(productList);
		log.debug("Converted {} of procuts into {} batches.", productList.size(), productBatch.size());
		
		// fetch availability and build response for each batch Asynchronously 
		List<CompletableFuture<Map<String, AvailabilityByProduct>>> availabilityByLocationFutureList  = 
				productBatch.stream().map(productListBatch -> CompletableFuture.supplyAsync(()-> {
					Map<String, AvailabilityByProduct> availabilityByProductBatch = new HashMap<String, AvailabilityByProduct>();
					ReadClusterAvailabilityRequest request = buildAhAvailabilityRequest(productListBatch, locations, fulfillmentType, sellingChannel);
					try {
						ReadClusterAvailabilityResponse getAvailabilityResponseData = availabilityHubReadClusterClient.getItemsInventoryAvailability(request);
						log.debug("Converting availability response from yantriks to caller format: ", getAvailabilityResponseData);
						availabilityByProductBatch = buildAvailabilityByProduct(getAvailabilityResponseData, fulfillmentType, isDetails, locations);						
						
					} catch(Exception ex) {
						log.error("An exception occured while fetching availability from yantriks, request: {}", request , ex);
					}
					
					// handle missing products in yantriks
					if(productListBatch.size() != availabilityByProductBatch.keySet().size()) {
						productListBatch.removeAll(availabilityByProductBatch.keySet());
						availabilityByProducts.putAll(buildDefaultAvailabilityProductsForMissingProducts(productListBatch, locations, fulfillmentType, isDetails));
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
	 * Get availability for given product list and location id from yantriks and build response  
	 * @param productList
	 * @param locationId
	 * @param sellingChannel
	 * @param fulfillmentType
	 * @return
	 */
	private Map<String, AvailabilityByLocation> getAvailabilityFromAH(List<String> productList, String locationId, String sellingChannel, String fulfillmentType) {		
		List<Location> locationList = new ArrayList<Location>();			
		ReadClusterAvailabilityResponse getAvailabilityResponseData = null;
		ReadClusterAvailabilityRequest request = buildAhAvailabilityRequest(productList, Arrays.asList(locationId), fulfillmentType, sellingChannel);			
		try {						
			getAvailabilityResponseData = availabilityHubReadClusterClient.getItemsInventoryAvailability(request);
			log.debug("Successfully fetched availability form next priority source (yantriks) with products: {}", getAvailabilityResponseData);
			if(null != getAvailabilityResponseData) {
				Map<String, AvailabilityByLocation> availabilityByLocationMap = buildAvailabilityByLocationMap(getAvailabilityResponseData, fulfillmentType);
				
				//AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
				if(availabilityHubMissConfiguration.getEnabled() && availabilityByLocationMap.keySet().size() < productList.size()) {
					productList.removeAll(availabilityByLocationMap.keySet());
					availabilityByLocationMap.putAll(handleAvailabilityHubMiss(productList, locationId));
				}
				//AV-3166 End
				return availabilityByLocationMap;
			}
		} catch(Exception ex) {
			//AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
			if(availabilityHubMissConfiguration.getEnabled() && ex instanceof NoContentException) {				
				log.warn("No Content exception while getting data from Yantriks for request: {}", request);
				return handleAvailabilityHubMiss(productList, locationId); 
			}
			//AV-3166 End
			log.error("Exception while getting data from Yantriks for request: {}", request, ex);
		}
		return null;
	}
	
	/**
	 * AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
	 * @param productList
	 * @param locationId
	 * @return
	 */
	private Map<String, AvailabilityByLocation> handleAvailabilityHubMiss(List<String> productList, String locationId) {
		return productList.stream().collect(Collectors.toMap(productId -> productId, productId -> AvailabilityByLocation.builder()
								.atp(availabilityHubMissConfiguration.getDefaultAtp())
								.atpStatus(availabilityHubMissConfiguration.getDefaultAtpStatus())
								.location(locationId).build()));		
	}
	
	/**
	 * Create availability request for availability hub (yantriks) for given product list and location list
	 * @param products
	 * @param locations
	 * @param fulfillmentType
	 * @param sellingChannel
	 * @return
	 */
	private ReadClusterAvailabilityRequest buildAhAvailabilityRequest(List<String> products, List<String> locations, String fulfillmentType, String sellingChannel) {
		log.debug("Creating availability request for yantriks product(s): {} and location(s): {}", Arrays.toString(products.toArray()), Arrays.toString(locations.toArray()));
		List<AggregatedKey> itemList = new ArrayList<AggregatedKey>();
		locations.forEach(locationId -> {
			itemList.addAll(products.stream().map(productId ->
				AggregatedKey.builder()
				    .orgId(config.getDefaultOrgId())
				    .sellingChannel(sellingChannel)
				    .transactionType(config.getDefaultTransactionType())
					.productId(productId)
					.uom(AvailabilityConstants.UOM_EACH)
					.fulfillmentType(fulfillmentType)	
					.locationType(config.getDcLocations().contains(locationId) ? AvailabilityConstants.DC : AvailabilityConstants.STORE)
					.locationId(locationId)					
					.build()
			).collect(Collectors.toList()));
		});
		
		
		ReadClusterAvailabilityRequest request = ReadClusterAvailabilityRequest.builder().aggregatedKeys(itemList).build();
		log.debug("Created availability request for yantriks: {}", request);
		return request;
	}
	
	private Map<String, AvailabilityByLocation> buildAvailabilityByLocationMap(ReadClusterAvailabilityResponse getAvailabilityResponseData, String fulfillmentType) {
		Map<String, AvailabilityByLocation> availabilityByLocationMap = new HashMap<String, AvailabilityByLocation>();  
		
		getAvailabilityResponseData.getBulkResponse().forEach(item -> {
			AvailabilityByLocation availabilityByLocation = new AvailabilityByLocation();
			availabilityByLocation.setAtp(item.getAtp());
			availabilityByLocation.setLocation(item.getLocationId());
			availabilityByLocation.setAtpStatus(item.getAtpStatus());
			availabilityByLocationMap.put(item.getProductId(), availabilityByLocation);
		});
		
		return availabilityByLocationMap;
	}
	
	
	/**
	 * To build AvailabilityByProduct object for send back to caller
	 * @param getAvailabilityResponseData
	 * @return
	 */
	private Map<String, AvailabilityByProduct> buildAvailabilityByProduct(ReadClusterAvailabilityResponse getAvailabilityResponseData,
			String fulfillmentType, boolean isDetail, List<String> locations) {
		Map<String, AvailabilityByProduct> availabilityByProductMap = new HashMap<String, AvailabilityByProduct>();
		if(null == getAvailabilityResponseData) {
			return availabilityByProductMap; 
		}else {
			try {
				
				getAvailabilityResponseData.getBulkResponse().stream().forEach(item -> {
					if(availabilityByProductMap.containsKey(item.getProductId())) {
						AvailabilityByProduct availabilityByProduct = availabilityByProductMap.get(item.getProductId());
						AvailabilityByFT availabilityByFT = availabilityByProduct.getAvailabilityDetails().getAvailabilityByFT().get(0);	
						if(isDetail) {
							AvailabilityByLocation availabilityByLocation = AvailabilityByLocation.builder().atp(item.getAtp()).atpStatus(item.getAtpStatus()).location(item.getLocationId()).build();																									
							availabilityByFT.getLocations().add(availabilityByLocation);
						} else {
							updateLocationDetails(availabilityByFT, item); 
						}
					} else {
						AvailabilityByProduct availabilityByProduct = new AvailabilityByProduct();
						availabilityByProduct.setProductId(item.getProductId());
						AvailabilityByLocation availabilityByLocation = AvailabilityByLocation.builder().atp( isDetail ? item.getAtp() : null).atpStatus(item.getAtpStatus()).location(item.getLocationId()).build();
						List<AvailabilityByLocation> availabilityByLocationList = new ArrayList<AvailabilityByLocation>();
						availabilityByLocationList.add(availabilityByLocation);
						AvailabilityByFT availabilityByFT = AvailabilityByFT.builder().fulfillmentType(fulfillmentType).locations(availabilityByLocationList).build();
						
						List<AvailabilityByFT> availabilityByFTList = new ArrayList<AvailabilityByFT>();
						availabilityByFTList.add(availabilityByFT);
						availabilityByProduct.setAvailabilityDetails(AvailabilityDetail.builder().availabilityByFT(availabilityByFTList).build());
						
						availabilityByProductMap.put(item.getProductId(), availabilityByProduct);
					}
				});
												
			} catch(Exception ex) {
				log.error("An exception occured while building availabilityByProduct from yantriks response", ex);
			}
			//Check missing locations for products
			if(isDetail) {
				availabilityByProductMap.entrySet().forEach(availabilityByProductEntry -> {
					AvailabilityByFT availabilityByFT = availabilityByProductEntry.getValue().getAvailabilityDetails().getAvailabilityByFT().get(0);
					
					if(locations.size() != availabilityByFT.getLocations().size()) {
						List<AvailabilityByLocation> missingAvailabilityByLocationList = new ArrayList<AvailabilityByLocation>();
						locations.forEach(locationId -> {
							boolean locationAvailable = availabilityByFT.getLocations().stream().anyMatch(availabilityByLocation -> locationId.equals(availabilityByLocation.getLocation()));
							if(!locationAvailable) {
								missingAvailabilityByLocationList.add(AvailabilityByLocation.builder()
										//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
										.atp( null != priorityConfig ? priorityConfig.getAssumedATP() : assumedAtp)
										.atpStatus(null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus)
										////AV-3195 - END
										.location(locationId).build());
							}
						});						
						availabilityByFT.getLocations().addAll(missingAvailabilityByLocationList);
					}
				}); 
			}
			return availabilityByProductMap;
		}
	}
	
	private void updateLocationDetails(AvailabilityByFT availabilityByFT, BulkResponse newItem) {
		AvailabilityByLocation availabilityByLocationRes = (!availabilityByFT.getLocations().isEmpty()) ? availabilityByFT.getLocations().get(0) : null;
		if (null == availabilityByLocationRes) {
			availabilityByLocationRes = com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation.builder()
					.atpStatus(newItem.getAtpStatus())
					.location(newItem.getLocationId())
					.build();
			availabilityByFT.getLocations().add(availabilityByLocationRes);
		} else if (INSTOCK.equals(newItem.getAtpStatus()) && !INSTOCK.equals(availabilityByLocationRes.getAtpStatus())) {
			availabilityByLocationRes
					.setLocation(newItem.getLocationId());
			availabilityByLocationRes.setAtpStatus(newItem.getAtpStatus());
			return;
		} else if (LIMITEDSTOCK.equals(newItem.getAtpStatus()) 
				&& !INSTOCK.equals(availabilityByLocationRes.getAtpStatus()) 
				&& !OOS.equals(availabilityByLocationRes.getAtpStatus())) {
			availabilityByLocationRes
					.setLocation(newItem.getLocationId());
			availabilityByLocationRes.setAtpStatus(newItem.getAtpStatus());
		} else if (OOS.equals(newItem.getAtpStatus())
				&& !INSTOCK.equals(availabilityByLocationRes.getAtpStatus())
				&& !LIMITEDSTOCK.equals(availabilityByLocationRes.getAtpStatus())) {
			availabilityByLocationRes
					.setLocation(newItem.getLocationId());
			availabilityByLocationRes.setAtpStatus(newItem.getAtpStatus());
		}
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
			List<String> locations, String fulfillmentType, final boolean isDetails) {
		Map<String, AvailabilityByProduct> availabilityByProducts = new HashMap<String, AvailabilityByProduct>();
		
		products.stream().forEach(productId -> {
			List<AvailabilityByFT> availabilityByFTList = new ArrayList<AvailabilityByFT>();
			AvailabilityByFT availabilityByFT = AvailabilityByFT.builder().fulfillmentType(fulfillmentType)
					.locations(new ArrayList<com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>()).build();
			
			if(!isDetails) {
				availabilityByFT.getLocations().add(com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation
						.builder().location(locations.stream().findFirst().orElse(null))
						//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
						.atpStatus( null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus)
						.build());
			} else {
				availabilityByFT.getLocations().addAll(locations.stream().map(
						locationId -> AvailabilityByLocation
								.builder().location(locationId)
								//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
								.atp(null != priorityConfig ? priorityConfig.getAssumedATP() : assumedAtp)
								.atpStatus(null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus).build())
						        //AV-3195
						.collect(Collectors.toList()));
			}
			availabilityByFTList.add(availabilityByFT);
			availabilityByProducts.put(productId, AvailabilityByProduct.builder().productId(productId)
				.availabilityDetails(AvailabilityDetail.builder().availabilityByFT(availabilityByFTList).build()).build());
		});
		
		return availabilityByProducts;
	}
	
	private Collection<List<String>> convertToBatch(List<String> products) {		
		final AtomicInteger counter = new AtomicInteger();
		Collection<List<String>> requestBatches = products.stream()
				.collect(Collectors.groupingBy(it -> counter.getAndIncrement() / batchSize)).values();
		
		return requestBatches;
	}
	@Override
	public AvailabilityService clone() {	
		ReaddClusterAHAvailabilityHubService readdClusterAHAvailabilityHubService = new ReaddClusterAHAvailabilityHubService();
		readdClusterAHAvailabilityHubService.batchSize = this.batchSize;
		readdClusterAHAvailabilityHubService.assumedAtp = this.assumedAtp;
		readdClusterAHAvailabilityHubService.availabilityHubReadClusterClient = this.availabilityHubReadClusterClient;
		readdClusterAHAvailabilityHubService.config = this.config;
		readdClusterAHAvailabilityHubService.threadPoolTaskExecutor = this.threadPoolTaskExecutor;
		readdClusterAHAvailabilityHubService.defaultAtpStatus = this.defaultAtpStatus;
		readdClusterAHAvailabilityHubService.availabilityHubMissConfiguration = this.availabilityHubMissConfiguration;
		return readdClusterAHAvailabilityHubService;
	}

}
