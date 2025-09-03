/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2020 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.inventoryavailability.service;

import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.availabilityhub.client.AvailabilityClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.util.InventoryUtils;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.AvailabilityServicePartialFailureException;
import com.sephora.services.inventoryavailability.mapping.GetAvailabilityMapper;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.*;
import com.sephora.services.inventoryavailability.model.data.AvailabilityErrorHolder;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemRequestDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.model.dto.Location;
import feign.FeignException;
import feign.RetryableException;
import lombok.extern.log4j.Log4j2;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.sephora.services.availabilityhub.client.AvailabilityHubAsyncConfig.THREAD_POOL;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.SHIPTOHOME;
import static com.sephora.services.inventoryavailability.AvailabilityConstants.FULFILLMENT_TYPE_SHIP;

/**
 * @author Vitaliy Oleksiyenko
 */
@ConditionalOnProperty(prefix = "yantriks", name = "enabled", havingValue = "true")
@Service
@Log4j2
public class AvailabilityHubInventoryService {

	@Autowired
	private AvailabilityClient availabilityClient;

	@Autowired
	private GetAvailabilityMapper getAvailabilityMapper;

	@Autowired
	private InventoryApplicationConfig applicationConfig;

	@Autowired
	@Qualifier(THREAD_POOL)
	private AsyncTaskExecutor threadPoolTaskExecutor;

	@Value("${inventory.async.waitTimeoutInSeconds}")
	private long waitTimeoutInSeconds;

	@Value("${availability.request.disableNoProductErrorHandling: false}")
	private Boolean disableNoProductErrorHandling;

	@Value("${inventory.async.batchSize:1}")
	private int batchSize;
	
	@Autowired
    RequestLoggingFilterConfig requestLoggingFilterConfig;
	
	@Autowired
	private AvailabilityHubMissConfiguration availabilityHubMissConfiguration;
	
//	@Autowired
//	private RequestLoggingFilterConfig requestLoggingFilterConfig;

	public GetAvailabilityResponseData getItemsInventoryAvailability(InventoryItemsRequestDto inventoryItemsRequestDto)
			throws AvailabilityServiceException, AvailabilityServicePartialFailureException {

		GetAvailabilityResponseData availabilityResponseData = null;
		//TODO remove unavailable productIds, as it is identified as a bug in yantriks side
		//temporarily commenting out tracking logic of unavailableProductIds.
		/*List<String> unavailableProductIds = Collections.synchronizedList(new ArrayList<>());*/
		//This is to keep track of request and the errors it received so that we can create error response
		List<AvailabilityErrorHolder> errors = Collections.synchronizedList(new ArrayList<>());

		if ((!CollectionUtils.isEmpty(inventoryItemsRequestDto.getProducts())
				&& inventoryItemsRequestDto.getProducts().size() >=1)) {

			List<GetAvailabilityResponseData> responses = performAvailabilityHubRequestsAsynchronously(inventoryItemsRequestDto,
					/*unavailableProductIds,*/ errors);

			if (responses.size() >= 1) {

				List<AvailabilityByProduct> productsAvailability = responses.stream()
						.flatMap(r -> r.getAvailabilityByProducts().stream()).collect(Collectors.toList());

				availabilityResponseData = GetAvailabilityResponseData.builder().availabilityByProducts(productsAvailability)
						.orgId(responses.get(0).getOrgId()).sellingChannel(responses.get(0).getSellingChannel())
						.transactionType(responses.get(0).getTransactionType()).build();

			} /*else {
				log.error("Response contains empty 'itemAvailabilityDetails'");
				throw new InventoryServiceException("Response contains empty 'itemAvailabilityDetails'");
			}*/
		}
		if(errors.size() > 0 /*|| unavailableProductIds.size() > 0*/){
			log.info("errors occured in getting availability, {}", inventoryItemsRequestDto);
			List<ErrorDetailInfo> errorInfos = new ArrayList<>();
			if(errors.size() > 0){
				errorInfos.addAll(getErrorsFromAvailabilityExceptions(errors));
			}
			/*if(unavailableProductIds.size() > 0){
				errorInfos.addAll(getErrorsFromUnavailableProductIds(unavailableProductIds));
			}*/
			if(inventoryItemsRequestDto.getProducts().size() == errorInfos.size()){
				//all the requests failed
				log.error("all requests failed because of multiple reasons for request {}", inventoryItemsRequestDto);
				throw new AvailabilityServiceException(HttpStatus.BAD_REQUEST.value(), ErrorResponseDTO.builder()
						.error(ErrorDetails.builder()
								.code(MessagesAndCodes.GET_AVAILABILITY_MULTIPLE_FAILURE_CODE)
								.message(MessagesAndCodes.GET_AVAILABILITY_MULTIPLE_FAILURE_CODE_MESSAGE)
								.errors(errorInfos)
								.build())
						.build());
			}
			availabilityResponseData.setError(ErrorResponseDTO.builder()
					.error(ErrorDetails.builder()
							.code(MessagesAndCodes.GET_AVAILABILITY_PARTIAL_FAILURE_CODE)
							.message(MessagesAndCodes.GET_AVAILABILITY_PARTIAL_FAILURE_CODE_MESSAGE)
							.errors(errorInfos)
							.build())
					.build());
			throw new AvailabilityServicePartialFailureException(HttpStatus.MULTI_STATUS.value(), availabilityResponseData);
		}

		return availabilityResponseData;
	}

	private List<ErrorDetailInfo> getErrorsFromUnavailableProductIds(List<String> unavailableProductIds) {
		List<ErrorDetailInfo> errorDetailInfos = new ArrayList<>();
		for(String productId: unavailableProductIds){
			errorDetailInfos.add(ErrorDetailInfo.builder().errorItemId(productId)
					.reason(MessagesAndCodes.GET_AVAILABILITY_PRODUCT_NOT_AVAILABLE_CODE)
					.message(MessagesAndCodes.GET_AVAILABILITY_PRODUCT_NOT_AVAILABLE_CODE_MESSAGE)
					.build());
		}
		return errorDetailInfos;
	}


	private List<GetAvailabilityResponseData> performAvailabilityHubRequestsAsynchronously(InventoryItemsRequestDto inventoryItemsRequestDto,
			/*List<String> unavailableProductIds,*/ List<AvailabilityErrorHolder> errors) throws
			AvailabilityServiceException {
		List<GetAvailabilityResponseData> itemAvailabilityResponseList = Collections
				.synchronizedList(new ArrayList<>());

		final AtomicInteger counter = new AtomicInteger();
		//converting requests to batches
		Collection<List<InventoryItemRequestDto>> requestBatches = inventoryItemsRequestDto.getProducts().stream()
				.collect(Collectors.groupingBy(it -> counter.getAndIncrement() / batchSize)).values();

		log.debug("Get items inventory POST performAvailabilityHubRequestsAsynchronously--BEFORE THREADPOOL SUBMISSION");

		List<CompletableFuture<Void>> completableYantrikFutures = requestBatches.stream()
				.map(requestBatch -> CompletableFuture.runAsync(() -> {

					log.debug("Get item availability for Yantrix request: {}", requestBatch);

					GetAvailabilityResponseData itemsInventoryAvailability = null;

					// AvailabilityRequestLocation specific request is supported by Yantriks POST request only. So if
					// AvailabilityRequestLocation is present, we have to call
					// POST irrespective of batch size

					long startTime = System.currentTimeMillis();

					// If batchsize is 1, we will have to call Yantriks GET APIs parallely and
					// collect the response


					InventoryItemsRequestDto request = inventoryItemsRequestDto.toBuilder().orgId(inventoryItemsRequestDto.getOrgId())
							.segment(inventoryItemsRequestDto.getSegment()).sellingChannel(inventoryItemsRequestDto.getSellingChannel())
							.transactionType(inventoryItemsRequestDto.getTransactionType()).products(requestBatch).build();

					try {
						itemsInventoryAvailability = getMultipleItemsInventoryAvailability(request/*, unavailableProductIds*/);
					} catch (AvailabilityServiceException e) {
						log.error(e);
						errors.add(AvailabilityErrorHolder.builder()
								.request(request)
								.serviceException(e)
								.build());
					}
					log.info("Get item availability from Yantrix took {}ms for {} products ",
							System.currentTimeMillis() - startTime, requestBatch.size());

					// Add result to list (If the item is INVALID, we are getting an EMPTY/NULL
					// Response from Yantrik

					if (null != itemsInventoryAvailability) {
						itemAvailabilityResponseList.add(itemsInventoryAvailability);
					}

				}, threadPoolTaskExecutor)).collect(Collectors.toList());

		CompletableFuture<Void> consolidatedCompletableYantrikFutures = CompletableFuture
				.allOf(completableYantrikFutures.toArray(new CompletableFuture[completableYantrikFutures.size()]));

		// We will not wait indefenitley.If all the result hasnt come back within
		// specific timeout, we will abort
		try {
			// Wait till all results are available or timeout
			consolidatedCompletableYantrikFutures.get(waitTimeoutInSeconds, TimeUnit.SECONDS);
		} catch (TimeoutException e) {
			log.error("All {} Yantric requests didnt get returned within {} seconds",
					inventoryItemsRequestDto.getProducts().size(), waitTimeoutInSeconds);
			throw new AvailabilityServiceException(HttpStatus.REQUEST_TIMEOUT.value(), ErrorResponseDTO.builder()
					.error(ErrorDetails.builder()
							.code(MessagesAndCodes.GET_AVAILABILITY_SERVER_TIMEOUT_CODE)
							.code(MessagesAndCodes.GET_AVAILABILITY_SERVER_TIMEOUT_CODE_MESSAGE)
							.build())
					.build());
		} catch (InterruptedException | ExecutionException e) {
			log.error("Task execution exception", e);
			throw new AvailabilityServiceException(HttpStatus.REQUEST_TIMEOUT.value(), ErrorResponseDTO.builder()
					.error(ErrorDetails.builder()
							.code(MessagesAndCodes.GET_AVAILABILITY_UNKNOWN_ERROR_CODE)
							.code(MessagesAndCodes.GET_AVAILABILITY_UNKNOWN_ERROR_CODE_MESSAGE)
							.build())
					.build());
		}
		// If the items in response list doesnt match to items requested
		int responseItemCount = itemAvailabilityResponseList.stream().map(c -> c.getAvailabilityByProducts())
				.mapToInt(List::size).sum();

		return itemAvailabilityResponseList;

	}

	private List<ErrorDetailInfo> buildErrorDetailInfoForProducts(AvailabilityErrorHolder errorHolder){
		List<InventoryItemRequestDto> products = errorHolder.getRequest().getProducts();
		List<ErrorDetailInfo> errorDetailInfos = new ArrayList<>();
		for (InventoryItemRequestDto product : errorHolder.getRequest().getProducts()) {
			ErrorDetailInfo info = ErrorDetailInfo.builder()
					.errorItemId(product.getProductId())
					.reason(String.valueOf(errorHolder.getServiceException().getHttpStatus()))
					.build();
			if (errorHolder.getServiceException().getErrorDetails() != null &&
					errorHolder.getServiceException().getErrorDetails().getError() != null) {
				info.setMessage(errorHolder.getServiceException().getErrorDetails().getError().getMessage());
			}
			errorDetailInfos.add(info);
		}
		return errorDetailInfos;
	}

	private List<ErrorDetailInfo> getErrorsFromAvailabilityExceptions(List<AvailabilityErrorHolder> errorHolders){
		List<ErrorDetailInfo> errors = new ArrayList<>();
		for(AvailabilityErrorHolder errorHolder: errorHolders){
			errors.addAll(buildErrorDetailInfoForProducts(errorHolder));
		}
		return errors;
	}

	private GetAvailabilityResponseData handleNoContentProductResponses(final InventoryItemsRequestDto request, GetAvailabilityResponseData getAvailabilityResponseData){
		if(disableNoProductErrorHandling == false){
			log.debug("handling no content responses from yantriks, {}", request);
			if(request.getProducts().size() != getAvailabilityResponseData.getAvailabilityByProducts().size()){
				log.debug("there are products unavailable in yantriks " +
						"availability response, {}", getAvailabilityResponseData);
				for(InventoryItemRequestDto product: request.getProducts()){
					Boolean isProductAvailable = getAvailabilityResponseData
							.getAvailabilityByProducts()
							.stream()
							.anyMatch(availabilityByProduct ->
							availabilityByProduct.getProductId().equals(product.getProductId()));
					if(!isProductAvailable){
						/*unavailableProductIds.add(product.getProductId());*/
						log.debug("product having id {} is not found in availability " +
								"yantriks response ", product.getProductId());
						InventoryItemRequestDto productRequest = request.getProducts()
								.stream()
								.filter(inventoryItemRequestDto ->
										inventoryItemRequestDto.getProductId().equals(product.getProductId()))
								.findFirst().get();
						log.debug(" creating response for product having productId {}",
								product.getProductId());
						AvailabilityByProduct availabilityByProduct = getAvailabilityMapper.buildNoContentProductResponse(productRequest, applicationConfig);
						log.debug("created empty response for product {} and response will be {}",
								product.getProductId(), availabilityByProduct);
						getAvailabilityResponseData.getAvailabilityByProducts().add(availabilityByProduct);
					}
				}
			}
		}
		return getAvailabilityResponseData;
	}

	private GetAvailabilityResponseData getMultipleItemsInventoryAvailability(InventoryItemsRequestDto request/*, List<String> unavailableProductIds*/) throws AvailabilityServiceException {
		try{
			Set<String> fulfillmentTypes = request.getProducts().stream().map(product -> product.getFulfillmentType()).collect(Collectors.toSet());
			StringBuffer fulfillmentTypeStr = new StringBuffer("");
			fulfillmentTypes.forEach(fulfillmentType -> {
				fulfillmentTypeStr.append(SHIPTOHOME.equals(fulfillmentType) ? (FULFILLMENT_TYPE_SHIP + ",") : (fulfillmentType +","));
			});
			//ADD CORRELATION ID FOR TRACKING - START
			String CorrelationId=UUID.randomUUID().toString();
			//ADD CORRELATION ID FOR TRACKING - END
			
			GetAvailabilityResponseData getAvailabilityResponseData = availabilityClient.getItemsInventoryAvailability(request, fulfillmentTypeStr.toString(),CorrelationId);
			//removing infinite inventory as it will be handled in oms
			/*getAvailabilityResponseData = handleInfiniteInventoryResponse(request, getAvailabilityResponseData);*/
			getAvailabilityResponseData = handleNoContentProductResponses(request, getAvailabilityResponseData);
			return getAvailabilityResponseData;
		}catch(NoContentException noContentEx){
			//for no content response, the
			log.debug("response with no content received from yantriks for request {} creating response ", request);
			GetAvailabilityResponseData responseData = getAvailabilityMapper.buildAvailabilityResponseForNoContent(request, applicationConfig);
			log.debug("response created successfully , {}", responseData);
			return responseData;
		}
		catch(Exception e){
			handleException(e, request);
		}
		return null;
	}

	private GetAvailabilityResponseData handleInfiniteInventoryResponse(InventoryItemsRequestDto request, final GetAvailabilityResponseData getAvailabilityResponseData) {
		for(AvailabilityByProduct product: getAvailabilityResponseData.getAvailabilityByProducts()){
			for(AvailabilityByFulfillmentType fulfillmentType: product.getAvailabilityByFulfillmentTypes()){
				for(AvailabilityDetail availabilityDetail: fulfillmentType.getAvailabilityDetails()){
					if (availabilityDetail.getAtp().equals(Double.valueOf("99999")) &&
									(availabilityDetail.getAvailabilityByLocations() == null ||
											availabilityDetail.getAvailabilityByLocations().size() == 0)){
						InventoryItemRequestDto inventoryItemRequestDto = request.getProducts().stream()
								.filter(inventoryItemRequestDto1 -> inventoryItemRequestDto1.getProductId().equals(product.getProductId()))
								.findFirst().get();
						List<AvailabilityByLocation> availabilityByLocations = new ArrayList<>();
						for(Location location: inventoryItemRequestDto.getLocations()){
							AvailabilityByLocation availabilityByLocation = new AvailabilityByLocation();
							availabilityByLocation.setAtp(Double.valueOf("99999"));
							availabilityByLocation.setLocationId(location.getLocationId());
							availabilityByLocation.setLocationType(
									applicationConfig.getDcLocations().contains(location.getLocationId())? AvailabilityConstants.DC: AvailabilityConstants.STORE);
							availabilityByLocations.add(availabilityByLocation);
						}
						availabilityDetail.setAvailabilityByLocations(availabilityByLocations);
					}
				}
			}
		}
		return getAvailabilityResponseData;
	}

	private void handleException(Exception e, InventoryItemsRequestDto request) throws AvailabilityServiceException {
		String code = null;
		String message = null;
		Integer httpStatus = 500;
		if(e instanceof NoContentException){
			log.error("Yantriks responded with 204 error, No content for request : {}", request);
			log.error(e);
			code = MessagesAndCodes.GET_AVAILABILITY_NO_CONTENT_CODE;
			message = MessagesAndCodes.GET_AVAILABILITY_NO_CONTENT_CODE_MESSAGE;
			httpStatus = ((NoContentException) e).status();
		}else if(e instanceof RetryableException){
			//5XX error
			log.error("Yantriks responded 5XX retryable error for request : {}", request);
			log.error(e);
			code = MessagesAndCodes.GET_AVAILABILITY_SERVER_ERROR_CODE;
			message = MessagesAndCodes.GET_AVAILABILITY_SERVER_ERROR_CODE_MESSAGE;
			httpStatus = ((RetryableException) e).status() == -1 ? 500 : ((RetryableException) e).status();
		}else if( e instanceof FeignException.FeignClientException){
			log.error("Yantriks responded with 4XX error for request: {}", request);
			log.error(e);
			code = MessagesAndCodes.GET_AVAILABILITY_CLIENT_ERROR_CODE;
			message =  MessagesAndCodes.GET_AVAILABILITY_CLIENT_ERROR_CODE_MESSAGE;
			httpStatus = ((FeignException.FeignClientException) e).status();
		}else {
			log.error("An unknown or unhandled error occured for request {}", request);
			log.error(e);
			code = MessagesAndCodes.GET_AVAILABILITY_UNKNOWN_ERROR_CODE;
			message = MessagesAndCodes.GET_AVAILABILITY_UNKNOWN_ERROR_CODE_MESSAGE;
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR.value();
		}
		ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
				.error(ErrorDetails.builder()
						.code(code)
						.message(message)
						.build()).build();
		throw new AvailabilityServiceException(httpStatus == -1 ? 500 : httpStatus, errorResponseDTO);
	}

	// If location is specified for any product
	/*private boolean isLocationSpecificRequest(InventoryItemsRequestDto inventoryItemsRequestDto) {
		for (InventoryItemRequestDto p : inventoryItemsRequestDto.getProducts()) {
			if (null != p && !CollectionUtils.isEmpty(p.getLocations())
					&& p.getLocations().get(0).getLocationId() != null)
				return true;
		}

		return false;
	}

	public GetAvailabilityResponseData getSingleItemInventoryAvailability(String sellingChannel, String productId,
																		  String uom, InventoryItemsRequestDto inventoryItemsRequestDto*//*, List<String> unavailableProductIds*//*) throws AvailabilityServiceException {
		try {
			GetAvailabilityResponseData response = availabilityClient.getSingleItemInventoryAvailability(
					"", defaultOrgId, sellingChannel,
					productId, uom, defaultTransactioType);
			*//*if(inventoryItemsRequestDto.getProducts().size() != response.getAvailabilityByProducts().size()){
				for(InventoryItemRequestDto product: inventoryItemsRequestDto.getProducts()){
					Boolean isProductAvailable = response.getAvailabilityByProducts().stream().anyMatch(availabilityByProduct ->
							availabilityByProduct.getProductId().equals(product.getProductId()));
					if(!isProductAvailable){
						unavailableProductIds.add(product.getProductId());
					}
				}
			}*//*
			//MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName())
			return response;
		} catch(Exception e){
			handleException(e, inventoryItemsRequestDto);
		}
		return null;
	}*/

	public Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct> findAvailabilityForCacheMiss(List<String> productList, String locationId, String sellingChannel, String fulfillmentType) {
		Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct> availabilityByProductMap = new HashMap<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct>();
		//Check weather batch is needed
		if(productList.size() < batchSize) {
			return getAvailabilityFromAH(productList, locationId, sellingChannel, fulfillmentType);
		} else {
			// Convert product list to batches
			Collection<List<String>> productBatch = InventoryUtils.convertToBatch(productList, batchSize);
			// Get availability for each batch of product async. 
			List<CompletableFuture<Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct>>> availabilityByLocationFutureList  = 
					productBatch.stream().map(productListBatch -> CompletableFuture.supplyAsync(()-> {
				return getAvailabilityFromAH(productListBatch, locationId, sellingChannel, fulfillmentType);
			}, threadPoolTaskExecutor)).collect(Collectors.toList());
			
			//Collect get availability for each batch
			availabilityByLocationFutureList.forEach(availabilityByLocationFuture-> {
				
				try {
					Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct> availabilityByLocationMapBatch = availabilityByLocationFuture.get();
					if(null != availabilityByLocationMapBatch) {
						availabilityByProductMap.putAll(availabilityByLocationMapBatch);
					}
				} catch (InterruptedException e) {
					log.error("An exception occured while collecting response from yentriks for each batch", e);
				} catch (ExecutionException e) {
					log.error("An exception occured while collecting response from yentriks for each batch", e);
				}
				
			});
		}
							
		return availabilityByProductMap;
	}
	
	private Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct> getAvailabilityFromAH(List<String> productList, String locationId, String sellingChannel, String fulfillmentType) {		
		List<Location> locationList = new ArrayList<Location>();			
		GetAvailabilityResponseData getAvailabilityResponseData = null;
		InventoryItemsRequestDto request = buildAhAvailabilityRequest(productList, Arrays.asList(locationId), fulfillmentType, sellingChannel);	
		try {						
			getAvailabilityResponseData = availabilityClient.getItemsInventoryAvailability(request, SHIPTOHOME.equals(fulfillmentType) ? FULFILLMENT_TYPE_SHIP : fulfillmentType,  MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
			log.debug("Successfully fetched availability form next priority source (yantriks) with products: {}", getAvailabilityResponseData);
			if(null != getAvailabilityResponseData) {
				Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct> availabilityByLocationMap = buildAvailabilityByLocationMap(getAvailabilityResponseData, fulfillmentType);
				
				//AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
				if(availabilityByLocationMap.keySet().size() < productList.size()) {
					productList.removeAll(availabilityByLocationMap.keySet());
					availabilityByLocationMap.putAll(handleAvailabilityHubMiss(productList, locationId, fulfillmentType));
				}
				//AV-3166 end 
				return availabilityByLocationMap;
			}
		} catch(Exception ex) {	
			//AV-3166 Update Redis cache when Yantriks has no inventory record for a SKU
			if(ex instanceof NoContentException) {				
				log.warn("No Content exception while getting data from Yantriks for request: {}", request);
				return handleAvailabilityHubMiss(productList, locationId, fulfillmentType); 
			}
			//AV-3166 end 
			log.error("Exception while getting data from Yantriks for request: {}", request, ex);
		}
		return null;
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
							.locationType(applicationConfig.getDcLocations().contains(locationId) ? AvailabilityConstants.DC : AvailabilityConstants.STORE)
							.build())
					.collect(Collectors.toList());
			return InventoryItemRequestDto.builder()
					.productId(productId)
					.fulfillmentType(fulfillmentType)
					.uom(AvailabilityConstants.UOM_EACH).locations(ahLocations).build();
		}).collect(Collectors.toList());
		
		InventoryItemsRequestDto request = InventoryItemsRequestDto.builder().orgId(applicationConfig.getDefaultOrgId())
				.segment(applicationConfig.getDefaultSegment()).sellingChannel(sellingChannel)				
				.transactionType(applicationConfig.getDefaultTransactionType()).products(itemList).build();
		log.debug("Created availability request for yantriks: {}", request);
		return request;
	}
	
	private Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct> buildAvailabilityByLocationMap(GetAvailabilityResponseData getAvailabilityResponseData, String fulfillmentType) {
		Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct> availabilityByLocationMap = new HashMap<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct>();
		
		getAvailabilityResponseData.getAvailabilityByProducts().stream().forEach(availabilityByProduct -> {
			com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct availabilityByProductRes = com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct.builder().productId(availabilityByProduct.getProductId()).availabilityByFulfillmentTypes(new ArrayList()).build();
			availabilityByLocationMap.put(availabilityByProduct.getProductId(), availabilityByProductRes);
			availabilityByProduct.getAvailabilityByFulfillmentTypes().stream().forEach(availabilityByFulfillmentTypes -> {
				if(fulfillmentType.equals(availabilityByFulfillmentTypes.getFulfillmentType())) {
					com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByFulfillmentType availabilityByFulfillmentTypeRes = com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByFulfillmentType
							.builder().fulfillmentType(availabilityByFulfillmentTypes.getFulfillmentType()).availabilityDetails(new ArrayList()).build();
					availabilityByProductRes.getAvailabilityByFulfillmentTypes().add(availabilityByFulfillmentTypeRes);
					
					availabilityByFulfillmentTypes.getAvailabilityDetails().stream().forEach(availabilityDetails -> {
						com.sephora.services.inventoryavailability.model.availability.response.AvailabilityDetail availabilityDetailRes = com.sephora.services.inventoryavailability.model.availability.response.AvailabilityDetail.builder().availabilityByLocations(new ArrayList()).build();
						availabilityByFulfillmentTypeRes.getAvailabilityDetails().add(availabilityDetailRes);
						availabilityDetails.getAvailabilityByLocations().stream().forEach(availabilityByLocation -> {
							availabilityDetailRes.getAvailabilityByLocations().add(com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByLocation.builder()
									.atp(availabilityByLocation.getAtp())
									.locationId(availabilityByLocation.getLocationId())
									.atpStatus(availabilityByLocation.getAtpStatus())
									.build());
							
						});
					});
					
				}
			});
		});
		return availabilityByLocationMap;
	}
	
	private Map<String, com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct> handleAvailabilityHubMiss(List<String> productList, String locationId, String fulfillment) {
		return productList.stream()
				.collect(Collectors.toMap(productId -> productId, 
						productId ->
							com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct.builder()
							.productId(productId)
							.availabilityByFulfillmentTypes(Arrays.asList(com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByFulfillmentType.builder()
									.fulfillmentType(fulfillment)
									.availabilityDetails(Arrays.asList(com.sephora.services.inventoryavailability.model.availability.response.AvailabilityDetail.builder()
											.availabilityByLocations(Arrays.asList(com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByLocation.builder()
													.atp(availabilityHubMissConfiguration.getDefaultAtp())
													.atpStatus(availabilityHubMissConfiguration.getDefaultAtpStatus())
													.locationId(locationId)
													.build()))
											.build())).build()))
						.build()));			
	}
}
