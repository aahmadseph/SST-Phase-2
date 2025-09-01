package com.sephora.services.inventoryavailability.service;

import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.inventory.model.dto.GetInventoryAvailabilityDto;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.availability.metrics.MicroMeterMetricsRecorder;
import com.sephora.services.inventoryavailability.config.GetAvailabilityConfig;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.config.PriorityConfig;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.AvailabilityServicePartialFailureException;
import com.sephora.services.inventoryavailability.mapping.GetAvailabilityMapper;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.GetAvailabilityResponseData;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestLocation;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestProduct;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolation;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Log4j2
@RefreshScope
public class GetInventoryAvailabilityService extends AbstractAvailabilityService {
    @Autowired
    AvailabilityHubInventoryService yantriksInventoryService;
    @Autowired
    GetAvailabilityMapper getAvailabilityMapper;
    @Autowired
    InventoryApplicationConfig applicationConfig;
    @Autowired
    Validator validator;
    @Autowired
    MockAvailabilityService mockAvailabilityService;
    @Value("${availability.mock.isMockedAvailability:false}")
    private Boolean isMockedAvailability;
    
    @Autowired
    private GetAvailabilityConfig getAvailabilityConfig;
    
    @Autowired
    GetAvailabilityCacheService getAvailabilityCacheService;
    
    public AvailabilityResponseDto getInventoryAvailability(AvailabilityRequestDto request) throws AvailabilityServiceException, AvailabilityServicePartialFailureException {
        //convert and create request
        try{
            log.info("fetching inventory availability for request : {}", request);
            log.debug("validating get availability request {}", request);
            validator.validateItem(request);
            log.debug("validation successful availability request");
            log.debug("converting request to yantriks format");
            InventoryItemsRequestDto inventoryItemsRequestDto = getAvailabilityMapper.convert(request, applicationConfig);
            log.info("successfully converted request to yantriks format");
            log.debug("getting inventory availability {}", inventoryItemsRequestDto);
            
            PriorityConfig priorityConfig = getAvailabilityConfig.getPriorityConfig(request); 
            
            //Below condition is to return a mocked response
			if (isMockedAvailability) {
				log.info("Yantriks response is going to be mocked!");
				GetAvailabilityResponseData responseDate = mockAvailabilityService
						.buildMockAvailabilityResponse(inventoryItemsRequestDto);
				return getAvailabilityMapper.convert(responseDate);
			} else if(getAvailabilityConfig.isEnabled() && AvailabilityConstants.CACHE.equals(getAvailabilityConfig.getFirtPriority(request))) {
				log.info("Getting availability from redis cache for requestOrigin: {}", request.getRequestOrigin());
				return getAvailabilityCacheService.getAvailability(inventoryItemsRequestDto, priorityConfig);			
			} else {
	            GetAvailabilityResponseData getAvailabilityResponseData = yantriksInventoryService.getItemsInventoryAvailability(inventoryItemsRequestDto);
	            log.info("getting availability successful, response : {}", getAvailabilityResponseData);
	            log.debug("converting response to required format, {}", inventoryItemsRequestDto);
	            AvailabilityResponseDto availabilityResponseDto = getAvailabilityMapper.convert(getAvailabilityResponseData);
	            //return availabilityResponseDto;
	            return availabilityResponseDto;
			}
        }
        catch(AvailabilityServicePartialFailureException ex){
            //converting object to correct format before sending response
            log.debug("request was partially successful: {}", request);
            AvailabilityResponseDto availabilityResponseDto = getAvailabilityMapper.convert(ex.getAvailabilityResponseData());
            ex.setResponseData(availabilityResponseDto);
            throw ex;
        }
        catch(AvailabilityServiceException ex){
            //already handled error thrown from yantriksInventoryservice calls, re throwing.
            throw ex;
        }
        catch(Exception e){
            //probably handle validation error
            handleException(e, request);
        }

        //convert and create response
        return null;
    }
    
    public CompletableFuture<AvailabilityResponseDto> getAvailabilityAsync(GetInventoryAvailabilityDto inventoryAvailabilityBean){
    	CompletableFuture<AvailabilityResponseDto> completeableFuture = CompletableFuture.supplyAsync(()->{
    		try{
    			return getAvailability(inventoryAvailabilityBean);
    		} catch(AvailabilityServiceException | AvailabilityServicePartialFailureException ex) {
    			log.error("get availability request failed", ex);
    			return null;
    		}
    	});
    	return completeableFuture;
    }
    
    public AvailabilityResponseDto getAvailability(GetInventoryAvailabilityDto inventoryAvailabilityBean) throws AvailabilityServiceException, AvailabilityServicePartialFailureException {
		AvailabilityRequestDto requestDto = new AvailabilityRequestDto();
		requestDto.setRequestOrigin(inventoryAvailabilityBean.getRequestSourceSystem());
		requestDto.setSellingChannel(inventoryAvailabilityBean.getEnterpriseCode());
		requestDto.setTransactionType("DEFAULT");
		List<AvailabilityRequestProduct> products = new ArrayList<AvailabilityRequestProduct>();
		List<AvailabilityRequestLocation> locations = new ArrayList<AvailabilityRequestLocation>();
		if(inventoryAvailabilityBean.getShipNodes() != null){
            for(String locationId: inventoryAvailabilityBean.getShipNodes()) {
                AvailabilityRequestLocation location = new AvailabilityRequestLocation();
                location.setLocationId(locationId);
                locations.add(location);
            }
        }
		if(inventoryAvailabilityBean.getItems() != null) {
            for (String itemId : inventoryAvailabilityBean.getItems()) {
                AvailabilityRequestProduct product = new AvailabilityRequestProduct();
                product.setFulfillmentType("SHIPTOHOME");
                product.setLocations(locations);
                product.setProductId(itemId);
                product.setUom("EACH");
                products.add(product);
            }
        }
		requestDto.setProducts(products);
		return getInventoryAvailability(requestDto);
	}

    public void handleException(Exception e, AvailabilityRequestDto request) throws AvailabilityServiceException {
        String code = null;
        String message = null;
        Integer httpStatus = 500;
        if (e instanceof SepValidationException) {
        	recordMicrometerMetrics(AvailabilityConstants.GET_AVAILABILITY_URI, MicroMeterMetricsRecorder.DATA_VALIDATION_ERROR);
        	
            log.error("validation failed");
            SepValidationException sepValidationException = (SepValidationException) e;
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
            ErrorDetails errorDetails = new ErrorDetails();
            errorDetails.setCode(MessagesAndCodes.GET_AVAILABILITY_VALIDATION_ERROR_CODE);
            errorDetails.setMessage(MessagesAndCodes.GET_AVAILABILITY_VALIDATION_ERROR_CODE_MESSAGE);
            List<ErrorDetailInfo> errorDetailInfos = new ArrayList<>();
            for (ConstraintViolation<Object> violation : sepValidationException.getViolations()) {
                log.error(" Validation failed for instance of class:'{}'" +
                                " with property path: '{}'" +
                                " with property value: '{}'" +
                                " and error message is '{}'"
                        , request.getClass().toString()
                        , violation.getPropertyPath()
                        , violation.getInvalidValue()
                        , violation.getMessage()
                );
                ErrorDetailInfo info = new ErrorDetailInfo();
                info.setReason(String.valueOf(HttpStatus.BAD_REQUEST.value()));
                info.setMessage("validation failed for property '"
                        + violation.getPropertyPath()
                        + "' message : "
                        + violation.getMessage());
                errorDetailInfos.add(info);
            }
            errorDetails.setErrors(errorDetailInfos);
            errorResponseDTO.setError(errorDetails);
            throw new AvailabilityServiceException(HttpStatus.BAD_REQUEST.value(), errorResponseDTO);
        }else {
            log.error("Unknown error happened {}", e);
            recordMicrometerMetrics(AvailabilityConstants.GET_AVAILABILITY_URI, MicroMeterMetricsRecorder.UNKNOWN_ERROR);
            throw new AvailabilityServiceException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    ErrorResponseDTO.builder()
                            .error(ErrorDetails.builder()
                                    .code(MessagesAndCodes.GET_AVAILABILITY_UNKNOWN_ERROR_CODE)
                                    .message(MessagesAndCodes.GET_AVAILABILITY_UNKNOWN_ERROR_CODE_MESSAGE)
                                    .build())
                            .build());
        }
    }

}
