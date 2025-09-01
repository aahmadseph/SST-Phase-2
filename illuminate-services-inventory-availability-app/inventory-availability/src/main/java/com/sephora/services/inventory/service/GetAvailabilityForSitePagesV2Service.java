package com.sephora.services.inventory.service;

import com.sephora.services.common.dynamicconfig.model.DynamicConfigDto;
import com.sephora.services.common.dynamicconfig.service.DynamicConfigService;
import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.config.GetAvailabilityForSitePagesConfig;
import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.model.networkThreshold.redis.NetworkThresholdCacheDto;
import com.sephora.services.inventory.service.availability.AvailabilityService;
import com.sephora.services.inventory.service.availability.NetworkAvailabilityServiceV2;
import com.sephora.services.inventory.service.availability.impl.AvailabilityHubAvailabilityServiceV2;
import com.sephora.services.inventory.service.availability.impl.CacheAvailabilityServiceV2;
import com.sephora.services.inventory.util.InventoryUtils;
import com.sephora.services.inventory.validation.GetAavailabilityFSValidator;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.*;
import com.sephora.services.inventoryavailability.model.availabilityspv2.request.LocationsByFulfillmentTypeV2;
import com.sephora.services.inventoryavailability.model.availabilityspv2.request.SitePageAvailabilityDtoV2;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

import static com.sephora.services.inventoryavailability.AvailabilityConstants.FULFILLMENT_TYPE_SHIP;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.SHIPTOHOME;
import static com.sephora.services.inventoryavailability.config.redis.GetAvailabilityForSitePagesAsyncConfig.*;

@Service
@Log4j2
@ConfigurationProperties(prefix = "inventory.site-page-availability")
@Setter
public class GetAvailabilityForSitePagesV2Service {
	
	
	@Autowired
	GetAavailabilityFSValidator validator;
	
	@Value("${inventory.site-page-availability.productLimit:200}")
	private int productLimit;
	
	@Value("${inventory.site-page-availability.assumedAtp}")
	private double assumedAtp;
	
	@Value("${inventory.site-page-availability.defaultAtpStatus:OOS}")
	private String defaultAtpStatus;
	
	@Autowired
	@Qualifier(THREAD_POOL_V2)
	private AsyncTaskExecutor threadPoolTaskExecutorV2;
		
	private Map<String, AvailabilityService> availabilityServiceMap;
	
	@Autowired
	CacheAvailabilityServiceV2 cacheAvailabilityService;
	
	@Autowired
	@Qualifier("AvailabilityHubAvailabilityServiceV2")
	AvailabilityService availabilityHubAvailabilityService;
	
	@Autowired
	@Qualifier("CosmosDbAvailabilityService")
	AvailabilityService cosmosDbAvailabilityService;
	
	@Autowired
	private NetworkAvailabilityServiceV2 networkAvailabilityService;
	
	@Autowired
	GetAvailabilityForSitePagesConfig getAvailabilityForSitePagesConfig;
	
	@Autowired
	DynamicConfigService dynamicConfigService;
	
	@Autowired
	AvailabilityHubMissConfiguration availabilityHubMissConfiguration;
	
	public SitePageAvailabilityResponse getAvailability(SitePageAvailabilityDtoV2 sitePageAvailability) throws AvailabilityServiceException {
		try {
			log.debug("Validating the Site Page Availability request: {}", sitePageAvailability);
			validator.validateItem(sitePageAvailability);
			// If EvaluateNetworkAvail attribute is false LocationsByFulfillmentType should be not null and not empty
			if(!sitePageAvailability.isEvaluateNetworkAvail() 
					&& (null == sitePageAvailability.getLocationsByFulfillmentType() || sitePageAvailability.getLocationsByFulfillmentType().isEmpty())) {
				
				throw new AvailabilityServiceException(HttpStatus.BAD_REQUEST.value(),
						ErrorResponseDTO.builder().error(ErrorDetails.builder()
								.code(MessagesAndCodes.AVAILABILITY_SITE_PAGE_VALIDATION_ERROR_CODE)
								.message(MessagesAndCodes.AVAILABILITY_SITE_PAGE_VALIDATION_ERROR_CODE_MESSAGE)
								.errors(Arrays.asList(ErrorDetailInfo.builder()
										.reason(String.valueOf(HttpStatus.BAD_REQUEST.value()))
										.message(MessagesAndCodes.AVAILABILITY_SITE_PAGE_LOCATIOS_VALIDATION_ERROR_MESSAGE).build()))
								.build()).build());
			}
			// Create List of locations with respect to fulfillment type
			// Key for locationsMap is fulfillment type and value should be the list of location belongs to respective fulfillment type
			Map<String, List<String>> locationsMap = sitePageAvailability.getLocationsByFulfillmentType().stream().collect(
					Collectors.toMap(LocationsByFulfillmentTypeV2::getFulfillmentType, locationsByFulfillmentType ->
					{
						return null != locationsByFulfillmentType.getLocations()
								?  locationsByFulfillmentType.getLocations()
								: Collections.EMPTY_LIST;}));

			//Create map of productsByLocation with respect to fulfillment type
			Map<String, List<String>> productsByLocationMap = sitePageAvailability.getLocationsByFulfillmentType().stream()
					.filter(locationsByFulfillmentTypeV2 -> null != locationsByFulfillmentTypeV2.getProductsByLocation()
							&& !locationsByFulfillmentTypeV2.getProductsByLocation().isEmpty())
					.collect(Collectors.toMap(
							LocationsByFulfillmentTypeV2::getFulfillmentType,
							LocationsByFulfillmentTypeV2::getProductsByLocation));

			//trim products if the number of products grater than product limit 
			List<String> products = null == sitePageAvailability.getProducts()
					? new ArrayList<>()
					: sitePageAvailability.getProducts();
			if(products.size() > productLimit) {
				products = products.subList(0, productLimit);
			}
			
			//
			List<AvailabilityByProduct> availabilityByProductList = processGetAavailabilityRequest(products, locationsMap,
					sitePageAvailability.getSellingChannel(), sitePageAvailability.getRequestOrigin(), sitePageAvailability.isEvaluateNetworkAvail(), productsByLocationMap);

			log.debug("Successfully completed all batche(s) and total number of prodcut return is: {}",
					null == sitePageAvailability.getProducts()
							? 0
							: sitePageAvailability.getProducts().size());
			
			
			return SitePageAvailabilityResponse.builder()
					.availabilityByProducts(availabilityByProductList)
					.sellingChannel(sitePageAvailability.getSellingChannel()).build();
		} catch (Exception ex) {
			log.error("An exception occur while processing getAvailabilityForSitePages request {}", sitePageAvailability, ex);
			if(ex instanceof AvailabilityServiceException) {
				throw (AvailabilityServiceException) ex;
			} else {
				handleException(ex, sitePageAvailability);
			}
		}
		return null;
	}

	/**
	 * fetch site page availability from respective source.
	 * Asynchronously process locations belongs to each fulfillment type and merge
	 * 
	 * @param productListOriginal
	 * @param locationsMap
	 * @param sellingChannel
	 * @param requestOrigin
	 * @param evaluateNetworkAvail
	 * @param productsByLocationMap
	 * @return
	 */
	private List<AvailabilityByProduct> processGetAavailabilityRequest(
			List<String> productListOriginal,
			Map<String, List<String>> locationsMap,
			final String sellingChannel,
			final String requestOrigin,
			final boolean evaluateNetworkAvail,
			Map<String, List<String>> productsByLocationMap) {

		// Asynchronously fetch availability based on fulfillment type
		List<CompletableFuture<Map<String, AvailabilityByProduct>>> availabilityByLocationFutureList = locationsMap.entrySet().stream().map(locationMapEntry ->
		//OMM-1464-
		!CollectionUtils.isEmpty(locationMapEntry.getValue()) ? CompletableFuture.supplyAsync(()->{
			try {
				return processBatchAsyc(
						locationMapEntry.getValue(),
						locationMapEntry.getKey(),
						sellingChannel,
						requestOrigin,
						evaluateNetworkAvail,
						productsByLocationMap.get(locationMapEntry.getKey())
				);
			} catch (Exception e) {
				log.error("An exception occured while processing getAvailability:", e);
				return null;
			}
		}, threadPoolTaskExecutorV2) : null).filter(future -> null != future).collect(Collectors.toList());


		//Combine both futures
		List<CompletableFuture<Map<String, AvailabilityByProduct>>> combinedFutureList = new ArrayList<>();
		combinedFutureList.addAll(availabilityByLocationFutureList);
//		combinedFutureList.addAll(productByLocationFutureList);

		
		Map<String, AvailabilityByProduct> availabilityByProductMap = new HashMap<String, AvailabilityByProduct>();
		
		// Merge availability response for each fulfillment type
		for(CompletableFuture<Map<String, AvailabilityByProduct>> availabilityByLocationFuture : combinedFutureList) {
			try {
				Map<String, AvailabilityByProduct> availabilityByProductFFMap = availabilityByLocationFuture.get();
				if(availabilityByProductMap.isEmpty()) {
					if (null != availabilityByProductFFMap && !availabilityByProductFFMap.isEmpty()) {
						availabilityByProductMap.putAll(availabilityByProductFFMap);
					}
					continue;
				}
				for(Entry<String, AvailabilityByProduct> availabilityByProductEntry : availabilityByProductFFMap.entrySet()) {
					AvailabilityByProduct availabilityByProduct = availabilityByProductMap.get(availabilityByProductEntry.getKey());
					if(null == availabilityByProduct) {
						availabilityByProductMap.put(availabilityByProductEntry.getKey(), availabilityByProductEntry.getValue());
						continue;
					}
					availabilityByProduct.getAvailabilityDetails().getAvailabilityByFT().addAll(availabilityByProductEntry.getValue().getAvailabilityDetails().getAvailabilityByFT());
				}
			} catch (InterruptedException | ExecutionException e) {
				e.printStackTrace();
			}
		}


		List<String> productList = new ArrayList<>(productListOriginal);


		if(evaluateNetworkAvail && locationsMap.containsKey(FULFILLMENT_TYPE_SHIP) || locationsMap.containsKey(SHIPTOHOME)) {
			//Find source priority with respect to  requestOrigin and fulfillmentType
			//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
			PriorityConfig priorityConfig = getAvailabilityForSitePagesConfig.getPriorityOrder(FULFILLMENT_TYPE_SHIP, requestOrigin);
			//AV-3195 - END
			//ECOM_2213 if priorityList is not configured then service should respond with assumedATP
			List<String> priorityList = (null != priorityConfig) ? priorityConfig.getPriorityOrder() : null;
			log.debug("Priority list for requestOrigin: {} is: {}", requestOrigin,
					!CollectionUtils.isEmpty(priorityList) ? Arrays.toString(priorityList.toArray()) : "");
			// ECOM_2213 END
			
			Map<String, NetworkThresholdCacheDto> networkAvailabilityMap = new HashMap<String, NetworkThresholdCacheDto>();
			if(!CollectionUtils.isEmpty(priorityList) && AvailabilityConstants.CACHE.equals(priorityList.get(0))) {
				log.info("Network availabillity is serve from Cache for request origin: {}, fulfillmentType: {}", requestOrigin, FULFILLMENT_TYPE_SHIP);
				//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
				networkAvailabilityService.setPriorityConfig(priorityConfig);
				networkAvailabilityMap = networkAvailabilityService.getNetworkAvailability(productList, sellingChannel, priorityList);					
			} else if (!CollectionUtils.isEmpty(priorityList) && (AvailabilityConstants.AVAILABILITY_HUB.equals(priorityList.get(0)))) {
				log.info("Network availabillity is serve from yantriks for request origin: {}, fulfillmentType: {}", requestOrigin, FULFILLMENT_TYPE_SHIP);
				AvailabilityHubAvailabilityServiceV2 ahAvailabilityService = (AvailabilityHubAvailabilityServiceV2) availabilityHubAvailabilityService.clone();
				//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
				ahAvailabilityService.setPriorityConfig(priorityConfig);
				
				networkAvailabilityMap = ahAvailabilityService.getNetworkAvailability(productList, sellingChannel, false);
				//
				if(productList.size() > networkAvailabilityMap.size()) {
					productList.removeAll(networkAvailabilityMap.keySet());
					networkAvailabilityMap.putAll(productList.stream().collect(
							Collectors.toMap(product -> product, 
									product -> NetworkThresholdCacheDto.builder().productId(product)
									//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
									.atp(null != priorityConfig ? priorityConfig.getAssumedATP() :  assumedAtp)
									.atpStatus( null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus).build())));	
									//AV-3195 - END
				}
			} else {
				log.info("Building default response for missing priority list for request requestOrigin: {}, fulfillmentType: {}", requestOrigin, FULFILLMENT_TYPE_SHIP);
				networkAvailabilityMap.putAll(productList.stream().collect(
						Collectors.toMap(product -> product,
								product -> NetworkThresholdCacheDto.builder().productId(product)
										//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
										.atp(null != priorityConfig ? priorityConfig.getAssumedATP() :  assumedAtp)
										.atpStatus( null != priorityConfig ? priorityConfig.getAssumedATPStatus() : defaultAtpStatus).build())));

			}
			
			networkAvailabilityMap.values().stream().forEach(networkAvailabilit -> {
				if(availabilityByProductMap.containsKey(networkAvailabilit.getProductId())) {
					AvailabilityByProduct availabilityByProduct = availabilityByProductMap.get(networkAvailabilit.getProductId());
					//AV-3166 Send atp as 0 to ATG if cache have -ve atp due to yantriks availability miss	
					availabilityByProduct.getAvailabilityDetails().setAtp(availabilityHubMissConfiguration.getHandleCacheNegetiveAtp() &&  networkAvailabilit.getAtp() < 0 ? 0 : networkAvailabilit.getAtp());
					availabilityByProduct.getAvailabilityDetails().setAtpStatus(networkAvailabilit.getAtpStatus());
				} else {
					availabilityByProductMap.put(networkAvailabilit.getProductId(), 
							AvailabilityByProduct.builder().productId(networkAvailabilit.getProductId()).availabilityDetails(AvailabilityDetail.builder().
									//AV-3166 Send atp as 0 to ATG if cache have -ve atp due to yantriks availability miss	
									atp(availabilityHubMissConfiguration.getHandleCacheNegetiveAtp() &&  networkAvailabilit.getAtp() < 0 ? 0 : networkAvailabilit.getAtp())
									.atpStatus(networkAvailabilit.getAtpStatus())
									.build()).build());
				}
			});	
		}
		
		
		return new ArrayList<AvailabilityByProduct>(availabilityByProductMap.values());
	}
	
	/**
	 * Process product for locations belongs to given fulfillment type and collect the result to availabilityByProductListMap and return
	 * The source used to fetch availability with respect to the priority configuration.
	 * if any product/location availability is missing in respective source then the respective product/location will returns with default value
	 *
	 * @param locations
	 * @param fulfillmentType
	 * @param sellingChannel
	 * @param requestOrigin
	 * @param evaluateNetworkAvail
	 * @param productsByLocation
	 * @return Map<String, AvailabilityByProduct> - key: productId value: availability details for respective product
	 * @throws Exception
	 */
	private Map<String, AvailabilityByProduct>  processBatchAsyc(List<String> locations,
																 final String fulfillmentType, final String sellingChannel, final String requestOrigin, final boolean evaluateNetworkAvail,
																 List<String> productsByLocation) throws Exception {
		long startTime = System.currentTimeMillis();
		log.debug("Start processing for fulfillmentType: {}", fulfillmentType);
		List<String> productList = new ArrayList<>(productsByLocation);
		if (productList.size() > productLimit) {
			log.warn("Product by location list length {} is greater than productLimit {}", productList.size(), productLimit);
			log.info("Trimming product by location list to productLimit: {}", productLimit);
			productList = productList.subList(0, productLimit);
			log.info("Trimmed product by location list with length {} is: {}", productList.size(), productList);
		}

		//Find source priority with respect to  requestOrigin and fulfillmentType
		PriorityConfig priorityConfig = getAvailabilityForSitePagesConfig.getPriorityOrder(fulfillmentType, requestOrigin);
		//ECOM_2213 if priorityList is not configured then service should respond with assumedATP
		List<String> priorityList = (null != priorityConfig) ? priorityConfig.getPriorityOrder() : null;		
		
		log.debug("Priority list for requestOrigin: {} and fulfillmentType: {} is: {}", requestOrigin, fulfillmentType, 
				!CollectionUtils.isEmpty(priorityList) ? Arrays.toString(priorityList.toArray()) : "");

		// ECOM_2213 END
		//AV-3635 - Handle Blaze meter scenario for getAvailabilityForSitePages API call for Bopis and SDD transactions
		if(requestOrigin.endsWith("_TEST") 
				|| ( !CollectionUtils.isEmpty(priorityList) && AvailabilityConstants.CACHE.equals(priorityList.get(0))
				&& ( !getAvailabilityForSitePagesConfig.rampUpEnabled(fulfillmentType) || eligibleForRampup(locations, fulfillmentType)))) {
			// fetch availability from Cache
			log.info("Availabillity is serve from redis cache for request origin: {}, fulfillmentType: {}", requestOrigin, fulfillmentType);
			CacheAvailabilityServiceV2 cacheAvailabilityServiceClone = cacheAvailabilityService.clone();
			
			//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
			cacheAvailabilityServiceClone.setPriorityConfig(priorityConfig);
			
			//AV-3635 - Handle Blaze meter scenario for getAvailabilityForSitePages API call for Bopis and SDD transactions
			cacheAvailabilityServiceClone.setRequestOrigin(requestOrigin);

			Map<String, AvailabilityByProduct> availabilityResponse = cacheAvailabilityServiceClone.getAvailabiliy(new HashSet(productList), sellingChannel,
					evaluateNetworkAvail, locations, fulfillmentType, priorityList);
			return availabilityResponse;
		}
		else if (!CollectionUtils.isEmpty(priorityList) && (AvailabilityConstants.AVAILABILITY_HUB.equals(priorityList.get(0)))) {
			log.info("Availabillity is serve from yantriks for request origin: {}, fulfillmentType: {}", requestOrigin, fulfillmentType);
			Map<String, AvailabilityByProduct> availabilityByProducts = null;

			AvailabilityHubAvailabilityServiceV2 ahAvailabilityService = (AvailabilityHubAvailabilityServiceV2) availabilityHubAvailabilityService.clone();

			//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
			ahAvailabilityService.setPriorityConfig(priorityConfig);
			availabilityByProducts = ahAvailabilityService.getAvailabiliy(productList, locations, fulfillmentType, sellingChannel
					, productsByLocation);

			log.debug("Time taken for processing batch with {} products is: {}", productList.size(), System.currentTimeMillis() - startTime);
			return availabilityByProducts;
			//OMM-1462 Change default priority logic
            //buildDefaultForMissingProducts
		}
		else {
            log.info("Building default response for missing priority list for request requestOrigin: {}, fulfillmentType: {}", requestOrigin, fulfillmentType);
			Map<String, AvailabilityByProduct> availabilityByProducts = new HashMap<String, AvailabilityByProduct>();
			//ECOM_2213 if priorityList is not configured then service should respond with assumedATP
			if(priorityConfig != null){
				availabilityByProducts.putAll(InventoryUtils.buildDefaultResponseForMissingPriority(productList, locations, fulfillmentType,
						true,//isDetails is no longer used by V2 Service. So, hardcoding to true just as a placeholder
						priorityConfig.getAssumedATPStatus(), priorityConfig.getAssumedATP()));
			////ECOM_2213 end
			}
			else {
				availabilityByProducts.putAll(InventoryUtils.buildDefaultResponseForMissingPriority(productList, locations, fulfillmentType, 
						true, //isDetails is no longer used by V2 Service. So, hardcoding to true just as a placeholder
						defaultAtpStatus, assumedAtp));
			}
			return availabilityByProducts;
		}
	}

	private boolean eligibleForRampup(List<String> storeIds, String fulfillmentType) {
		try {
			DynamicConfigDto dynamicConfigDto = dynamicConfigService.get(getAvailabilityForSitePagesConfig.getAppName(),
					getAvailabilityForSitePagesConfig.getConfigType());

			if (dynamicConfigDto == null) {
				return false;
			}

			for (Object config : dynamicConfigDto.getConfigValue()) {
				if (null != config && config instanceof LinkedHashMap 
						&& ((LinkedHashMap)config).containsKey("fulfillmentType") && ((LinkedHashMap)config).containsKey("storeIds")) {
					if (fulfillmentType.equals(((LinkedHashMap) config).get("fulfillmentType"))) {
						List<String> rampUpStoreIds = (List<String>) ((LinkedHashMap) config).get("storeIds");
						return null != rampUpStoreIds && rampUpStoreIds.containsAll(storeIds);
					}
				}
			}
		} catch(Exception ex) {
			log.error("An excepion occured while fetching rampup store id list: ", ex);
		}
		return false;
	}
			
	@PostConstruct
	public void init() {
		availabilityServiceMap = Collections.synchronizedMap(new HashMap<String, AvailabilityService>());
		availabilityServiceMap.put(AvailabilityConstants.AVAILABILITY_HUB, availabilityHubAvailabilityService);
		availabilityServiceMap.put(AvailabilityConstants.COSMOSE_DB, cosmosDbAvailabilityService);
		
	}
	
	/**
	 * TO handle exception senarios. 
	 * @param ex
	 * @param request
	 * @throws AvailabilityServiceException
	 */
	private void handleException(Exception ex, SitePageAvailabilityDtoV2 request) throws AvailabilityServiceException {
		if (ex instanceof TimeoutException) {
			throw new AvailabilityServiceException(HttpStatus.REQUEST_TIMEOUT.value(), ErrorResponseDTO.builder()
					.error(ErrorDetails.builder().code(MessagesAndCodes.AVAILABILITY_SITE_PAGE_SERVER_TIMEOUT_CODE)
							.message(MessagesAndCodes.AVAILABILITY_SITE_PAGE_SERVER_TIMEOUT_CODE_MESSAGE).build())
					.build());
		} else if (ex instanceof InterruptedException || ex instanceof ExecutionException) {
			log.error("Task execution exception", ex);
			throw new AvailabilityServiceException(HttpStatus.REQUEST_TIMEOUT.value(), ErrorResponseDTO.builder()
					.error(ErrorDetails.builder().code(MessagesAndCodes.AVAILABILITY_SITE_PAGE_UNKNOWN_ERROR_CODE)
							.code(MessagesAndCodes.AVAILABILITY_SITE_PAGE_UNKNOWN_ERROR_CODE_MESSAGE).build())
					.build());
		} else if (ex instanceof SepValidationException) {
			SepValidationException sepValidationException = (SepValidationException) ex;
			if (null != sepValidationException.getViolations() && !sepValidationException.getViolations().isEmpty()) {
				List<ErrorDetailInfo> errorDetailInfos = new ArrayList<>();
				sepValidationException.getViolations().stream().forEach(violation -> {
					log.error(
							" Validation failed for instance of class:'{}'" + " with property path: '{}'"
									+ " with property value: '{}'" + " and error message is '{}'",
							request.getClass().toString(), violation.getPropertyPath(), violation.getInvalidValue(),
							violation.getMessage());

					ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder()
							.reason(String.valueOf(HttpStatus.BAD_REQUEST.value()))
							.message(violation.getPropertyPath().toString() + ": " + violation.getMessage()).build();
					errorDetailInfos.add(errorDetailInfo);
				});

				throw new AvailabilityServiceException(HttpStatus.BAD_REQUEST.value(),
						ErrorResponseDTO.builder()
								.error(ErrorDetails.builder()
										.code(MessagesAndCodes.AVAILABILITY_SITE_PAGE_VALIDATION_ERROR_CODE)
										.message(MessagesAndCodes.AVAILABILITY_SITE_PAGE_VALIDATION_ERROR_CODE_MESSAGE)
										.errors(errorDetailInfos).build())
								.build());
			}
		} else {
			throw new AvailabilityServiceException(HttpStatus.INTERNAL_SERVER_ERROR.value(), ErrorResponseDTO.builder()
					.error(ErrorDetails.builder().code(MessagesAndCodes.AVAILABILITY_SITE_PAGE_UNKNOWN_ERROR_CODE)
							.code(MessagesAndCodes.AVAILABILITY_SITE_PAGE_UNKNOWN_ERROR_CODE_MESSAGE).build())
					.build());
		}
	}
}
