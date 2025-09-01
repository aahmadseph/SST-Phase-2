package com.sephora.services.sourcingoptions.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.sephora.services.sourcingoptions.config.AvailabilityCheckConfiguration;
import org.apache.commons.collections4.MapUtils;
import org.slf4j.MDC;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.platform.common.validation.exception.ValidationException;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.sourcingoptions.SourcingOptionConstants;
import com.sephora.services.sourcingoptions.client.AvailabilityHubClient;
import com.sephora.services.sourcingoptions.config.CommitsAsyncConfig;
import com.sephora.services.sourcingoptions.config.SourcingOptionsAHConfiguration;
import com.sephora.services.sourcingoptions.config.SourcingOptionsConfiguration;
import com.sephora.services.sourcingoptions.exception.AHBadRequestException;
import com.sephora.services.sourcingoptions.exception.AHPromiseDateException;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.mapper.SourcingAHPromiseDateMapper;
import com.sephora.services.sourcingoptions.mapper.SourcingPromiseDateMapper;
import com.sephora.services.sourcingoptions.model.CountryEnum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import com.sephora.services.sourcingoptions.model.SellerCodeEnum;
import com.sephora.services.sourcingoptions.model.SourcingOptionsMapperContext;
import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import com.sephora.services.sourcingoptions.model.dto.ShippingAddressConfig;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestItemDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseDto;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.AHPromiseDateResponseWithContext;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response.AHCartSourceResponse;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request.AHPromiseDateRequest;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.AHPromiseDateResponse;
import com.sephora.services.sourcingoptions.model.dto.promisedate.PromiseDateResponseDto;
import com.sephora.services.sourcingoptions.service.AHPromiseDatesService;
import com.sephora.services.sourcingoptions.service.AvailabilitySvcService;
import com.sephora.services.sourcingoptions.service.CarrierServiceService;
import com.sephora.services.sourcingoptions.service.ShipNodeService;
import com.sephora.services.sourcingoptions.service.ZipCodeRampupService;

import feign.FeignException;
import io.micrometer.core.annotation.Timed;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class AHPromiseDatesServiceImpl implements AHPromiseDatesService {
	public static final String SOURCING_LINE_TYPE_VALIDATION_ERROR = "NotNull.sourcingOptionsRequestDto.items.linetype";
	public static final String PROMISE_DATE_VALIDATION_ERROR = "NotNull.sourcingOptionsRequestDto.items.carrierServiceCode";
	public static final String LINE_TYPE_VALIDATION_ERROR = "NotNull.sourcingOptionsRequestDto.items.lineType";
	public static final String INVALID_SERVICE_CODE_ERROR = "promisdate.sourceItems.invalidservicecode";
	public static final String AH_INTERNAL_SERVER_ERROR = "ah.sourceItems.error";
	public static final String AH_BADREQUEST_ERROR = "ah.sourceItems.badrequest";
	public static final String PROMISDATE_INTERNAL_SERVER_ERROR = "promisdate.sourceItems.error";
	public static final String SERVICE_CODE_NOT_FOUND = "sourcing-service.sourceItems.serviceCodeNotFound";
	public static final String ADDRESS_NOT_FOUND = "sourcing-service.sourceItems.addressNotFound";
	public static final String INVALID_CARRIERCODE_SAMEDAY = "sourcing-service.sourceItem.invalidSamedayCarrierCode";

	@Value("${sourcing.options.availabilityhub.cartSourceServiceAuditEnabled:false}")
	private boolean cartSourceServiceAuditEnabled;
	@Value("${sourcing.options.availabilityhub.datesByServiceAuditEnabled:false}")
	private boolean datesByServiceAuditEnabled;
    @Autowired
    SourcingPromiseDateMapper sourcingPromiseDateMapper;

    @Autowired
    SourcingOptionsAHConfiguration sourcingOptionsAHConfiguration;

    @Autowired
	CarrierServiceService carrierServiceService;

    @Autowired
    @Qualifier(CommitsAsyncConfig.COMMITS_THREAD_POOL)
    Executor commitsThreadExecutor;

    @Autowired
    AvailabilityHubClient availabilityHubClient;

    @Autowired
    RequestLoggingFilterConfig requestLoggingFilterConfig;

    
    @Autowired
    private SourcingAHPromiseDateMapper sourcingAHPromiseDateMapper;

    @Autowired
    private AvailabilitySvcService availabilitySvcService;

    @Autowired
    private SourcingOptionsConfiguration sourcingOptionsConfiguration;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ShipNodeService shipNodeService;

	@Autowired
	private DynamicConfigWrapperServiceImpl dynamicConfigService;
	
	@Autowired
	private ZipCodeRampupService zipCodeRampupService;

    @Timed("get.sourcinghub.datesbyservice.overall")
    public SourcingOptionsResponseDto getPromiseDateByService(SourcingOptionsRequestDto request) throws Exception {
        log.debug("Promise date requests for sourcingOptions request {}",request);
        SourcingOptionsResponseDto sourcingOptionsResponseDto = null;
        try {
	        List<CarrierService> carrierServiceList = null;
	        Map<String, List<CarrierService>> levelOfServiceMap = null;
	        Map<String, String> itemCarrierServiceMap = null;
	        handleBorderFreeCarrierCodes(request);
	        
	        //Set default country if it is not present in non-borderfree request.
	        setDefaultCountry(request);
	        removeRepeatedCarrierCodes(request);
	        
	        if(request.getFulfillmentType().equals(FulfillmentTypeEnum.ELECTRONIC.toString())){
				log.debug("ELECTRONIC fulfillmentType detected, setting address and service Codes for shippingGroup {}", request.getCartId());
	        	request.setCarrierServiceCodes(Arrays.asList(getDefaultCarrierCode(request.getEnterpriseCode(), request.getFulfillmentType())));
				ShippingAddressConfig addressConfig = sourcingOptionsConfiguration.getElectronicFulfillmentAddressConfig().get(request.getShippingAddress().getCountry());
	        	if(addressConfig != null){
	        		if(StringUtils.isEmpty(request.getShippingAddress().getState()) && StringUtils.isEmpty(request.getShippingAddress().getZipCode())){
						request.getShippingAddress().setState(addressConfig.getState());
						request.getShippingAddress().setZipCode(addressConfig.getZipCode());
					}
				}
			} else {
				// Set default State and zipcode for no-electronic fullfilment type if those are empty
				ShippingAddressConfig addressConfig = sourcingOptionsConfiguration.getDefaultAddressConfig().get(request.getShippingAddress().getCountry());
				if(StringUtils.isEmpty(request.getShippingAddress().getState()) || StringUtils.isEmpty(request.getShippingAddress().getZipCode())){
					log.debug("shippingAddress not found in request for shippingGroup {}, setting address from configuration", request.getCartId());
					request.setCarrierServiceCodes(Arrays.asList(getDefaultCarrierCode(request.getEnterpriseCode(), request.getFulfillmentType())));
					request.getShippingAddress()
							.setState(StringUtils.isEmpty(request.getShippingAddress().getState())
									? addressConfig.getState()
									: request.getShippingAddress().getState());
					request.getShippingAddress()
							.setZipCode(StringUtils.isEmpty(request.getShippingAddress().getZipCode())
									? addressConfig.getZipCode()
									: request.getShippingAddress().getZipCode());
				}
				
			}
	        Boolean isItemLevelCarrierCodeAvailable = request.getItems().stream().allMatch(item -> !StringUtils.isEmpty(item.getCarrierServiceCode()));
	        if(isItemLevelCarrierCodeAvailable){
	        	log.debug("item level carrier code available for request with shippingGroup {}", request.getCartId());
	            itemCarrierServiceMap = request.getItems().stream().collect(Collectors.toMap(sourcingOptionsRequestItemDto -> sourcingOptionsRequestItemDto.getItemId(), sourcingOptionsRequestItemDto -> sourcingOptionsRequestItemDto.getCarrierServiceCode()));
	        } else {
	        	//DEF-1430 Handle empty carrier service codes in the Sourcing Service request
	        	if(CollectionUtils.isEmpty(request.getCarrierServiceCodes())) {
	        		request.setCarrierServiceCodes(Arrays.asList(getDefaultCarrierCode(request.getEnterpriseCode(), request.getFulfillmentType())));
	        	}
	        	//End DEF-1430
	            log.debug("carrierServiceCodes array is available for sourcing request with shippingGroup {}", request.getCartId());
	            carrierServiceList = carrierServiceService.getCarrierServices(request.getCarrierServiceCodes(),
	                    EnterpriseCodeEnum.valueOf(request.getEnterpriseCode()));
	            if(new HashSet<>(carrierServiceList).size() != request.getCarrierServiceCodes().size()){
	            	throw new ValidationException(SERVICE_CODE_NOT_FOUND);
				}
	            levelOfServiceMap = findLevelOfServiceMap(carrierServiceList);
	        }
	
	        Map<String, CarrierService> carrierCodeCarrierServiceMap = getItemCarrierServiceMap(request.getItems(), request.getEnterpriseCode(), false, request.getFulfillmentType());
	        if(carrierCodeCarrierServiceMap == null){
	            carrierCodeCarrierServiceMap = new HashMap<>();
	        }
	        if(carrierServiceList != null){
	            carrierCodeCarrierServiceMap.putAll(carrierServiceList.stream().collect(Collectors.toMap(CarrierService::getCarrierServiceCode, carrierService -> carrierService)));
	        }
	        List<AHPromiseDateResponseWithContext> promiseDates = new ArrayList<>();
	        if(sourcingOptionsConfiguration.getUseScatterGatherDateByService()) {
	        	log.debug("scatter gathering promise date requests for sourcingOptions request with cartId {}",request.getCartId());
		        List<CompletableFuture<AHPromiseDateResponseWithContext>> requests = createCallablePromiseDateRequests(request, carrierServiceList, carrierCodeCarrierServiceMap, levelOfServiceMap);
		        
	//	        List<Future<AHPromiseDateResponseWithContext>> futures = testThreadExecutor.invokeAll(requests);
		        for(int i =0; i< requests.size(); i++){
		        	Future<AHPromiseDateResponseWithContext> future = requests.get(i);
		            AHPromiseDateResponseWithContext response = future.get(10000, TimeUnit.MILLISECONDS);
		            promiseDates.add(response);
		        }
		        sourcingOptionsResponseDto = sourcingAHPromiseDateMapper.convert(promiseDates,
	        		 sourcingOptionsConfiguration, carrierCodeCarrierServiceMap, levelOfServiceMap, itemCarrierServiceMap, request.getFulfillmentType());

		        if(!sourcingOptionsResponseDto.isAvailable()){
		            log.info("sourcing is unavailable, getting availability to set maxNodeQuantity for shippingGroup {}", request.getCartId());
		            availabilitySvcService.getAvailabilityFromSourcingResponse(sourcingOptionsResponseDto, request);
		        }
		        removeRepeatedPromiseDates(sourcingOptionsResponseDto);
	        } else {
	        	sourcingOptionsResponseDto = getPromiseDateWithMultipleLevelOfService(request, levelOfServiceMap, carrierCodeCarrierServiceMap, itemCarrierServiceMap);	  
	        	
	        	if(!sourcingOptionsResponseDto.isAvailable()){
		            log.info("sourcing is unavailable, getting availability to set maxNodeQuantity for shippingGroup {}", request.getCartId());
		            availabilitySvcService.getAvailabilityFromSourcingResponse(sourcingOptionsResponseDto, request);
		        }
	        }
        } catch (Exception e) {
            log.error("conversion failed", e);
            handleException(e);
        }
		log.info("sourcing options response: {}", sourcingOptionsResponseDto);
        return sourcingOptionsResponseDto;
    }
    
    private SourcingOptionsResponseDto getPromiseDateWithMultipleLevelOfService(SourcingOptionsRequestDto sourcingOptionsRequest, 
    		Map<String, List<CarrierService>> levelOfServiceMap, 
    		Map<String, CarrierService> carrierCodeCarrierServiceMap, 
    		Map<String, String> itemCarrierServiceMap) {
    	SourcingOptionsMapperContext mapperContext = new SourcingOptionsMapperContext();
    	String fulfillmentServices = "";
    	if(null != levelOfServiceMap && !levelOfServiceMap.isEmpty()) {
    		fulfillmentServices = String.join(",", levelOfServiceMap.keySet());
    	} 
    	mapperContext.setLevelOfService(fulfillmentServices);
     	mapperContext.setItemCarrierServiceMap(carrierCodeCarrierServiceMap);
        mapperContext.setLevelOfServiceMap(levelOfServiceMap);
        mapperContext.setConfiguration(sourcingOptionsConfiguration);
        mapperContext.setCounter(0);
    	AHPromiseDateRequest promiseDateRequest = sourcingPromiseDateMapper.convert(sourcingOptionsRequest, mapperContext);
    	log.debug("Date by service request for cartId: {}", promiseDateRequest.getCartId());
		//Sending parameter "auditEnabled=true" in Yantriks url Start
		AHPromiseDateResponse ahPromiseDateResponse;
		log.info("Calling Yantriks with auditEnabled: {} ", datesByServiceAuditEnabled);
		if(getIgnoreExistingDemand(sourcingOptionsRequest.getSourceSystem())) {
			ahPromiseDateResponse = availabilityHubClient.datesByService(promiseDateRequest,datesByServiceAuditEnabled,
					true, "true", MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
		} else {
			ahPromiseDateResponse = availabilityHubClient.datesByService(promiseDateRequest,datesByServiceAuditEnabled,
				"false", MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
		}
		//Sending parameter "auditEnabled=true" in Yantriks url End
		log.debug("Converting date by service response for cartId: {}", promiseDateRequest.getCartId());
    	return sourcingAHPromiseDateMapper.convert(ahPromiseDateResponse, promiseDateRequest,carrierCodeCarrierServiceMap, 
    			levelOfServiceMap, itemCarrierServiceMap, sourcingOptionsRequest.getFulfillmentType());
    }

	private boolean getIgnoreExistingDemand(String sourceSystem) {
		boolean ignoreExistingDemand = false;
		AvailabilityCheckConfiguration availabilityCheckConfiguration = dynamicConfigService.getAvailabilityCheckConfiguration();
		if(availabilityCheckConfiguration != null
				&& !CollectionUtils.isEmpty(availabilityCheckConfiguration.getRequestOrigin())
				&& availabilityCheckConfiguration.getRequestOrigin().contains(sourceSystem)){
			log.debug("set the ignoreExistingDemand flag true for sourceSystem: {}", sourceSystem);
			ignoreExistingDemand = true;
		}
		return ignoreExistingDemand;
	}

	private void removeRepeatedCarrierCodes(SourcingOptionsRequestDto request) {
    	if(request != null && !CollectionUtils.isEmpty(request.getCarrierServiceCodes())){
    		Set<String> carrierSet = new HashSet<>(request.getCarrierServiceCodes());
    		request.getCarrierServiceCodes().clear();
    		request.getCarrierServiceCodes().addAll(carrierSet);
		}
	}

	/**
     * Set default country if the same is not present in request. 
     * It is US if EnterpriseCode is SEPHORAUS and CA otherwise. and it is applicable only for non-borderfree sellercode.
     * @param request
     */
    private void setDefaultCountry(SourcingOptionsRequestDto request) {
    	if(!request.getSellerCode().equals(SellerCodeEnum.BORDERFREE.toString()) 
        		&& StringUtils.isEmpty(request.getShippingAddress().getCountry())){
        	if(request.getEnterpriseCode().equals(EnterpriseCodeEnum.SEPHORAUS.toString())) {
        		request.getShippingAddress().setCountry("US");
        	} else if(request.getEnterpriseCode().equals(EnterpriseCodeEnum.SEPHORACA.toString())) {
        		request.getShippingAddress().setCountry("CA");
        	}
        } else if(SellerCodeEnum.BORDERFREE.toString().equals(request.getSellerCode())) {
        	//DEF-1582: Update the countryCode & zipCode of BORDERFREE checkout calls with Default values
        	ShippingAddressConfig shippingAddressConfig = sourcingOptionsConfiguration.getDefaultAddressConfig().get(SellerCodeEnum.BORDERFREE.toString());
        	request.getShippingAddress().setCountry(CountryEnum.US.toString());
        	request.getShippingAddress().setState(shippingAddressConfig.getState());
        	request.getShippingAddress().setZipCode(shippingAddressConfig.getZipCode());
        }
    }

	private void handleBorderFreeCarrierCodes(SourcingOptionsRequestDto request) {
    	if(request.getSellerCode().equals(SellerCodeEnum.BORDERFREE.toString())){
    		request.setCarrierServiceCodes(null);
    		//setting item level sellerCodes
			log.debug("setting borderfree specific carrierServiceCode for shippingGroupId {}", request.getCartId());
			request.getItems().stream()
					.forEach(sourcingOptionsRequestItemDto ->
							sourcingOptionsRequestItemDto.setCarrierServiceCode(sourcingOptionsConfiguration.getBorderFreeCarrierService()));
		}
	}

	private Map<String, List<CarrierService>> findLevelOfServiceMap(List<CarrierService> carrierServiceList) {

		List<CarrierService> filteredCarrierServiceList = new ArrayList<>();
		final Map<String, List<CarrierService>> configuredLevelOfServiceMap = new HashMap<>();
		if (sourcingOptionsConfiguration.getEnableCarrierCodeAdjustment() && MapUtils.isNotEmpty(sourcingOptionsConfiguration.getCarrierCodeAdjustments())) {
			filteredCarrierServiceList = carrierServiceList.stream().filter(carrierService -> !sourcingOptionsConfiguration.getCarrierCodeAdjustments()
					.containsKey(carrierService.getCarrierServiceCode())).collect(Collectors.toList());
			carrierServiceList.stream().filter(carrierService -> sourcingOptionsConfiguration.getCarrierCodeAdjustments()
					.containsKey(carrierService.getCarrierServiceCode())).forEach(carrierService -> {
				String configuredCarrierCode = carrierService.getCarrierServiceCode();
				String configuredLevelOfService = sourcingOptionsConfiguration.getCarrierCodeAdjustments().get(configuredCarrierCode);
				if (configuredLevelOfServiceMap.containsKey(configuredLevelOfService)) {
					configuredLevelOfServiceMap.get(configuredLevelOfService).add(carrierService);
				} else {
					ArrayList<CarrierService> carrierList = new ArrayList<>();
					carrierList.add(carrierService);
					configuredLevelOfServiceMap.put(configuredLevelOfService, carrierList);
				}
			});
		} else {
			filteredCarrierServiceList = carrierServiceList;
		}
		final Map<String, List<CarrierService>> levelOfServiceMap = filteredCarrierServiceList.stream()
				.collect(Collectors.groupingBy(CarrierService::getLevelOfService, Collectors.toList()));
		if (sourcingOptionsConfiguration.getEnableCarrierCodeAdjustment() && configuredLevelOfServiceMap.keySet().size() > 0) {
			configuredLevelOfServiceMap.keySet().stream().forEach(s -> {
				if (levelOfServiceMap.containsKey(s)) {
					levelOfServiceMap.get(s).addAll(configuredLevelOfServiceMap.get(s));
				} else {
					levelOfServiceMap.put(s, configuredLevelOfServiceMap.get(s));
				}
			});
		}
		return levelOfServiceMap;

	}

    private void removeRepeatedPromiseDates(SourcingOptionsResponseDto sourcingOptionsResponseDto) {
    	Comparator<PromiseDateResponseDto> promiseDateComparator = (o1, o2) -> o1.getDeliveryDate().compareTo(o2.getDeliveryDate());
        if(sourcingOptionsResponseDto != null){
            if(sourcingOptionsResponseDto.getPromiseDates() != null && sourcingOptionsResponseDto.getPromiseDates().size() > 1){
                List<String> distinctCarrierCodes = sourcingOptionsResponseDto.getPromiseDates()
                        .stream().map(PromiseDateResponseDto::getCarrierServiceCode).distinct().collect(Collectors.toList());
                for(String carrierCode: distinctCarrierCodes){
                    List<PromiseDateResponseDto> shipNodePromiseDates = sourcingOptionsResponseDto.getPromiseDates().stream()
                            .filter(promiseDate -> promiseDate.getCarrierServiceCode().equals(carrierCode)).collect(Collectors.toList());
                    if(shipNodePromiseDates.size() > 1){
                        shipNodePromiseDates.sort(promiseDateComparator.reversed());
                        for(int i =1; i<shipNodePromiseDates.size(); i++){
                            sourcingOptionsResponseDto.getPromiseDates().remove(shipNodePromiseDates.get(i));
                        }
                    }
                }
            }
        }
    }


    private AHPromiseDateResponseWithContext datesByService(AHPromiseDateRequest promiseDateRequest, List<CarrierService> carrierCodes,  String levelOfService,
															String sourceSystem){
        AHPromiseDateResponseWithContext context = new AHPromiseDateResponseWithContext();
        context.setRequest(promiseDateRequest);
        context.setCarrierCodes(carrierCodes);
        context.setLevelOfService(levelOfService);
		//Sending parameter "auditEnabled=true" in Yantriks url start
		log.debug("submitting promise date request to yantriks for dates by service {}", promiseDateRequest);
		if(getIgnoreExistingDemand(sourceSystem)) {
			context.setResponse(availabilityHubClient.datesByService(promiseDateRequest,datesByServiceAuditEnabled,
					true, "true", MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName())));
		} else {
			context.setResponse(availabilityHubClient.datesByService(promiseDateRequest,datesByServiceAuditEnabled,
				"false", MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName())));
		}
		log.debug("response received from yantriks for dates by service request {}", context.getResponse());
		//Sending parameter "auditEnabled=true" in Yantriks url End
		return context;
    }


    private List<CompletableFuture<AHPromiseDateResponseWithContext>> createCallablePromiseDateRequests(SourcingOptionsRequestDto request, List<CarrierService> carrierServiceList,
                                                                                               Map<String, CarrierService> itemCarrierServiceMap, Map<String, List<CarrierService>> levelOfServiceMap) throws SourcingServiceException {
        //Set<String> filteredCarrierService = new HashSet<String>(carrierServiceList.stream().map(CarrierService::getLevelOfService).collect(Collectors.toList()));
        SourcingOptionsMapperContext mapperContext = new SourcingOptionsMapperContext();
        //copying properties to context
        BeanUtils.copyProperties(sourcingOptionsAHConfiguration, mapperContext);
        List<Callable<AHPromiseDateResponseWithContext>> callables = new ArrayList<>();
        List<CompletableFuture<AHPromiseDateResponseWithContext>> futures = new ArrayList<>();
        mapperContext.setItemCarrierServiceMap(itemCarrierServiceMap);
        mapperContext.setLevelOfServiceMap(levelOfServiceMap);
        mapperContext.setConfiguration(sourcingOptionsConfiguration);
        mapperContext.setCounter(0);
        Boolean isItemLevelCarrierCodeAvailable = request.getItems().stream().allMatch(item -> !StringUtils.isEmpty(item.getCarrierServiceCode()));
		//String correlationId = MDC.get("correlationId");
        if(isItemLevelCarrierCodeAvailable){
            AHPromiseDateRequest promiseDateRequest = sourcingPromiseDateMapper.convert(request, mapperContext);
			log.debug("creating request for commits call with shippingGroup {}", request.getCartId());
			CompletableFuture<AHPromiseDateResponseWithContext> future = CompletableFuture.supplyAsync(() -> this.datesByService(promiseDateRequest, null, request.getItems().get(0).getCarrierServiceCode(), request.getSourceSystem()), commitsThreadExecutor);
			futures.add(future);
        }else if(!CollectionUtils.isEmpty(carrierServiceList)){
            for(String levelOfService: levelOfServiceMap.keySet()){
                mapperContext.setLevelOfService(levelOfService);
                AHPromiseDateRequest promiseDateRequest = sourcingPromiseDateMapper.convert(request, mapperContext);
				log.info("creating request for commits call with shippingGroup {}", request.getCartId());
				CompletableFuture<AHPromiseDateResponseWithContext> future = CompletableFuture.supplyAsync(() -> this.datesByService(promiseDateRequest, levelOfServiceMap.get(levelOfService), levelOfService, request.getSourceSystem()), commitsThreadExecutor);
				futures.add(future);
            }
        }else{
            throw new ValidationException(INVALID_SERVICE_CODE_ERROR);
        }
        log.info("submitted yantriks request for shipping group {}", request.getCartId());
        return futures;
    }

    
	/**
	 * 
	 * @param items
	 * @param enterpriseCode
	 * @return
	 */
	private Map<String, CarrierService> getItemCarrierServiceMap(List<SourcingOptionsRequestItemDto> items, String enterpriseCode, boolean cartSouce, String fulfillmentType) throws SourcingServiceException {
		Set<String> carrierCodes = new HashSet();
		for(SourcingOptionsRequestItemDto item : items) {
			if(StringUtils.isEmpty(item.getCarrierServiceCode()) && cartSouce) {
				//DEF-1430 Handle empty carrier service codes in the Sourcing Service request
				fulfillmentType = ((StringUtils.isEmpty(fulfillmentType)) ? item.getFulfillmentType() : fulfillmentType);
				if(FulfillmentTypeEnum.ELECTRONIC.toString().equals(fulfillmentType) && StringUtils.isEmpty(item.getLineType())) {
					throw new ValidationException(SOURCING_LINE_TYPE_VALIDATION_ERROR, null);
				} else {
					String defaultCarrierCode = getDefaultCarrierCode(enterpriseCode, fulfillmentType);
					carrierCodes.add(defaultCarrierCode);
					item.setCarrierServiceCode(defaultCarrierCode);
				}
				//end DEF-1430
			} else if(!StringUtils.isEmpty(item.getCarrierServiceCode())){
				carrierCodes.add(item.getCarrierServiceCode());
			}
		}

        Map<String, CarrierService> itemCarrierServiceMap = null;
        if(!CollectionUtils.isEmpty(carrierCodes)){
            List<CarrierService> itemCarrierServiceList = carrierServiceService.getCarrierServices(new ArrayList<String>(carrierCodes),
                    EnterpriseCodeEnum.valueOf(enterpriseCode));
            itemCarrierServiceMap = itemCarrierServiceList.stream()
                    .collect(Collectors.toMap(CarrierService::getCarrierServiceCode, carrierService -> carrierService));
        }
        if(itemCarrierServiceMap != null && new HashSet<>(carrierCodes).size() != itemCarrierServiceMap.size()){
        	throw new ValidationException(SERVICE_CODE_NOT_FOUND);
		}
        return itemCarrierServiceMap;
	}
	
	/**
	 * 
	 */
	@Timed("get.sourcinghub.cartsource.promisedate")
	@Override
	@Timed("get.sourcinghub.cartsource.overall")
	public SourcingOptionsResponseDto getCartSourcePromiseDates(SourcingOptionsRequestDto request) throws Exception {
		try {
			handleBorderFreeCarrierCodes(request);
			Map<String, CarrierService> itemCarrierServiceMap = null;

	        
	        //Set default country if it is not present in non-borderfree request.
	        setDefaultCountry(request);
	        handleBorderFreeCarrierCodes(request);
	        handleEmptyItemId(request);
	        removeRepeatedCarrierCodes(request);
	        
			itemCarrierServiceMap = getItemCarrierServiceMap(request.getItems(), request.getEnterpriseCode(), true, request.getFulfillmentType());
			
			//For 
			ShippingAddressConfig addressConfig = sourcingOptionsConfiguration.getDefaultAddressConfig().get(request.getShippingAddress().getCountry());
			if(StringUtils.isEmpty(request.getShippingAddress().getState())){
				request.getShippingAddress().setState(addressConfig.getState());
			}
			if(StringUtils.isEmpty(request.getShippingAddress().getZipCode())) {
				request.getShippingAddress().setZipCode(addressConfig.getZipCode());
			}
			//validating request
			validate(request);
			SourcingOptionsMapperContext mapperContext = new SourcingOptionsMapperContext();
			BeanUtils.copyProperties(sourcingOptionsAHConfiguration, mapperContext);
	        mapperContext.setItemCarrierServiceMap(itemCarrierServiceMap);
	        mapperContext.setConfiguration(sourcingOptionsConfiguration);
	        mapperContext.setCounter(0);
			AHPromiseDateRequest ahPromiseDateRequest = sourcingPromiseDateMapper.convert(request,
					mapperContext);
			//GUAR-4688
			if(request.getItems().stream().allMatch(item -> FulfillmentTypeEnum.SAMEDAY.name().equals(item.getFulfillmentType()))
					&& zipCodeRampupService.isZipCodeEligibleForSDDOpt(request.getShippingAddress().getZipCode(), request.getEnterpriseCode())) {
				ahPromiseDateRequest.setOptimizationRuleId(sourcingOptionsAHConfiguration.getOptimizationRuleId());
			}
			//GUAR-4688
			log.debug("Successfully converted cart source request: {} ", ahPromiseDateRequest);
			Boolean isOmsRequest = request.getSourceSystem() != null && request.getSourceSystem().equals(SourcingOptionConstants.OMS);
			//Sending parameter "auditEnabled=true" in Yantriks url start
			AHCartSourceResponse ahCartSourceResponse;
			if(cartSourceServiceAuditEnabled){
				log.info("Calling Yantriks with cartSourceServiceAuditEnabled: {} ", cartSourceServiceAuditEnabled);
				 ahCartSourceResponse = availabilityHubClient.cartSourceService(ahPromiseDateRequest, isOmsRequest ? "true" : "false",cartSourceServiceAuditEnabled, MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
			}else{
				 ahCartSourceResponse = availabilityHubClient.cartSourceService(ahPromiseDateRequest, isOmsRequest ? "true" : "false", MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
			}
			//Sending parameter "auditEnabled=true" in Yantriks url End
			log.debug("Cart source response: {} ", ahCartSourceResponse);
			
			if (null != ahCartSourceResponse) {
				Map<String, SourcingOptionsRequestItemDto> lineIdItemMap = request.getItems().stream().collect(Collectors
						.toMap(SourcingOptionsRequestItemDto::getLineId, item -> {return item;}));
				SourcingOptionsResponseDto sourcingOptionsResponseDto = sourcingAHPromiseDateMapper
						.convert(ahCartSourceResponse, lineIdItemMap, itemCarrierServiceMap, isOmsRequest, request.getFulfillmentType());
				if(!sourcingOptionsResponseDto.isAvailable() && !isOmsRequest){
					log.info("sourcing is unavailable, getting availability to set maxNodeQuantity for shippingGroup {}", request.getCartId());
					availabilitySvcService.getAvailabilityFromSourcingResponse(sourcingOptionsResponseDto, request);
				}
				log.info("Cart source sourcing options response: {}", sourcingOptionsResponseDto);
				return sourcingOptionsResponseDto;
			}
		}catch(Exception ex) {
			if(ex instanceof ValidationException) {
				throw ex;
			} else {
				handleException(ex);
			}
		}
		return null;
	}

	private void validate(SourcingOptionsRequestDto request) {
		validateSameDayCarrierCodes(request);
	}

	private void validateSameDayCarrierCodes(SourcingOptionsRequestDto request) {
		if(request == null){
			return;
		}
		if(request.getItems() != null){
			Boolean valid = !request.getItems()
					.stream()
					.anyMatch(sourcingOptionsRequestItemDto ->
							sourcingOptionsRequestItemDto != null &&
							sourcingOptionsRequestItemDto.getFulfillmentType() != null &&
									sourcingOptionsRequestItemDto.getFulfillmentType().equals(FulfillmentTypeEnum.SAMEDAY.toString()) &&
									!sourcingOptionsConfiguration.getSamedayCarrierCodes().contains(sourcingOptionsRequestItemDto.getCarrierServiceCode()));
			if(!valid){
				throw new ValidationException(INVALID_CARRIERCODE_SAMEDAY);
			}
		}
	}

	private void handleEmptyItemId(SourcingOptionsRequestDto request) {
		if(request == null || CollectionUtils.isEmpty(request.getItems())){
			return;
		}
		List<SourcingOptionsRequestItemDto> itemsWithoutLineId = request.getItems().stream()
				.filter(sourcingOptionsRequestItemDto ->
						StringUtils.isEmpty(sourcingOptionsRequestItemDto.getLineId()))
				.collect(Collectors.toList());
		if(!CollectionUtils.isEmpty(itemsWithoutLineId)){
			itemsWithoutLineId.forEach(sourcingOptionsRequestItemDto -> sourcingOptionsRequestItemDto.setLineId(sourcingOptionsRequestItemDto.getItemId()));
		}
	}

	private void handleException(Exception ex) throws Exception {
		FeignException feignException = null;
		if(ex instanceof ValidationException) {
        	throw ex;
        } else if (ex instanceof FeignException) {
			feignException = (FeignException) ex;
		} else if( ex.getCause() instanceof FeignException) {
			feignException = (FeignException) ex.getCause();
		}
			 
		if(null != feignException) {
			if (feignException.status() == HttpStatus.BAD_REQUEST.value()) {
				throw new AHBadRequestException(AH_BADREQUEST_ERROR, feignException.getMessage());
			} else {
				throw new AHPromiseDateException(AH_INTERNAL_SERVER_ERROR, feignException.getMessage());
			}
		} else {
			throw new AHPromiseDateException(PROMISDATE_INTERNAL_SERVER_ERROR, ex.getMessage());
		}
	}
	
	/**
	 * DEF-1430
	 * When ATG is not sending carrierService code for shiptohome/sameday promisedate requests, sourcing service should not send the date information to PromiseDate. 
	 * For SAMEDAY the default carrierService code should be 38 for SEPHORAUS and 58 for SEPHORACA 
	 * For SHIPTOHOME the default carrierService code should be 1 for SEPHORAUS and 54 for SEPHORACA 
	 * 
	 * @param enterpriseCode
	 * @param fulfillmentType
	 * @return
	 */
	private String getDefaultCarrierCode(String enterpriseCode, String fulfillmentType) {
		if(FulfillmentTypeEnum.ELECTRONIC.toString().equals(fulfillmentType)) {
			return EnterpriseCodeEnum.SEPHORACA.name().equals(enterpriseCode) ? 
					sourcingOptionsConfiguration.getElectronicFulfillmentCACarrierCode() : 
						sourcingOptionsConfiguration.getElectronicFulfillmentUSCarrierCode();
		} else if(FulfillmentTypeEnum.SAMEDAY.toString().equals(fulfillmentType)) {
			return EnterpriseCodeEnum.SEPHORACA.name().equals(enterpriseCode) ? 
					sourcingOptionsConfiguration.getSamedayFulfillmentCACarrierCode() : 
						sourcingOptionsConfiguration.getSamedayFulfillmentUSCarrierCode();
		} else {
			return EnterpriseCodeEnum.SEPHORACA.name().equals(enterpriseCode) ? 
					sourcingOptionsConfiguration.getShiptohomeFulfillmentCACarrierCode() : 
						sourcingOptionsConfiguration.getShiptohomeFulfillmentUSCarrierCode();
		}
	}
}
