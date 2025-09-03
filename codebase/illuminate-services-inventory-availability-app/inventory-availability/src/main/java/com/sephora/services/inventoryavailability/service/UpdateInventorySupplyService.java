package com.sephora.services.inventoryavailability.service;

import java.io.IOException;
import java.util.*;

import com.sephora.services.common.inventory.audit.model.cosmos.Audit;
import com.sephora.services.common.inventory.audit.service.AuditService;
import com.sephora.services.inventory.service.NotifyEventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.sephora.services.availabilityhub.client.AvailabilityHubClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.availability.metrics.MicroMeterMetricsRecorder;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.LocationEligibilityException;
import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.inventoryavailability.mapping.InventorySupplyMapper;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyCallerResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyRequest;
import com.sephora.services.common.inventory.validators.Validator;

import feign.FeignException;
import feign.RetryableException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class UpdateInventorySupplyService extends AbstractAvailabilityService {
	
	@Autowired
	AvailabilityHubClient yantriksServiceClient;
	
	@Autowired
	Validator validator;
	
	@Autowired
	InventorySupplyMapper supplyMapper;

	@Value("${availability.enableInventoryUi:false}")
	Boolean enableInventoryUi;

	@Autowired(required = false)
	AuditService auditService;

	@Autowired(required = false)
	NotifyEventService notifyEventService;
	
	/**
	 * This method will accept update inventory supply DTO object from caller, validate the same and submit to availability hub.
	 * if successfully updated the inventory supply then returns the updated details, otherwise build error response and return the same.
	 * 
	 * @param inventorySupplyDTO
	 * @return
	 * @throws AvailabilityServiceException
	 */
	public InventorySupplyCallerResponse updateInventorySupply(InventorySupplyDTO inventorySupplyDTO) throws AvailabilityServiceException {
		InventorySupplyCallerResponse callerResponse = null;
		try {

			log.info("Validating the inventory supply request with productId: {}", inventorySupplyDTO.getProductId());
			validator.validateItem(inventorySupplyDTO);
			
			log.debug("Converting inventory supply request to Yantriks format, request: {}", inventorySupplyDTO);
			InventorySupplyRequest request = supplyMapper.convert(inventorySupplyDTO);
			log.debug("Converted inventory supply request to Yantriks format: {} ", request);
			InventorySupplyAHResponse inventorySupplyAHResponse = yantriksServiceClient.updateInventorySupply(request);

			auditEvent(inventorySupplyDTO);
			notifyEvent(request, inventorySupplyDTO);
			log.debug("Response from Yantriks for supply update request: {} ", inventorySupplyAHResponse);
			
			log.debug("Converting inventory supply response from Yantriks to caller format");
			callerResponse = supplyMapper.convert(inventorySupplyAHResponse);
			log.debug("Converting inventory supply response from Yantriks to caller format: {} ", callerResponse);
			
							
		} catch (Exception ex) {
			log.error("Exception occured while submiting updateInventorySupply", ex);
			if (ex instanceof AvailabilityServiceException) {
				throw (AvailabilityServiceException) ex;
			} else {
				handleAndConvertException(ex, inventorySupplyDTO);
			}
		}
		return callerResponse;
	}

	private void notifyEvent(InventorySupplyRequest request, InventorySupplyDTO inventorySupplyDTO) {
		if(enableInventoryUi && inventorySupplyDTO.getRequestOrigin().equals("INVENTORY_UI")) {
			Map<String, String> parameters = new HashMap<>();
			parameters.put("itemId", request.getProductId());
			parameters.put("organizationCode", request.getOrgId());
			parameters.put("shipNode", request.getLocationId());
			parameters.put("itemType", request.getEventType());
			parameters.put("quantity", String.valueOf(request.getQuantity()));
			parameters.put("userId", inventorySupplyDTO.getUpdateUser());
			parameters.put("modifiedTime", inventorySupplyDTO.getUpdateTimeStamp());
			notifyEventService.notifyInventorySupplyEvent(parameters,
					AvailabilityConstants.INVENTORY_SUPPLY_NOTIFICATION_TEMPLATE_NAME,
					"ALERT > PROD > OMS UI Updates - InventorySupply");
		}
	}

	private void auditEvent(InventorySupplyDTO inventorySupplyDTO){
		if(enableInventoryUi && inventorySupplyDTO.getRequestOrigin().equals("INVENTORY_UI")){
			auditService.save(Audit.builder()
					.operation("UPDATE")
					//TODO mock employeeId
					.employeeId(inventorySupplyDTO.getUpdateUser())
					.createts(inventorySupplyDTO.getUpdateTimeStamp())
					.formName("inventoryAdjustment")
					.id(UUID.randomUUID().toString())
					.referenceType("itemId")
					.referenceValue(inventorySupplyDTO.getProductId())
					.changes("wareHouse:" + inventorySupplyDTO.getLocationId() + "|quantity:" + inventorySupplyDTO.getQuantity() + "|adjustQty:" + inventorySupplyDTO.getAdjustmentType())
					.build());
		}


	}
	
	/**
	 * The method will handle different type of exception happens while sending request to yantriks.
	 * Also prepare exception response for the respective exceptions.
	 * 
	 * @param ex
	 * @throws LocationEligibilityException
	 */
	private void handleAndConvertException(Exception ex, InventorySupplyDTO request) throws AvailabilityServiceException {
		
		if(ex instanceof RetryableException) {
			if (ex.getCause() instanceof IOException) {
				recordMicrometerMetrics(AvailabilityConstants.SUPPLY_UPDATE_URI, MicroMeterMetricsRecorder.COMMUNICATION_ERROR);
				
				ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
				
				throw new AvailabilityServiceException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
						ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
								MessagesAndCodes.UPDATE_INVENTORY_AVAILABILITY_HUB_FAILURE)
								.message(
										MessagesAndCodes.UPDATE_INVENTORY_FAILURE_MESSAGE)
								.errors(Arrays.asList(errorDetailInfo)).
								build()).build());
			} else {
				recordMicrometerMetrics(AvailabilityConstants.SUPPLY_UPDATE_URI, MicroMeterMetricsRecorder.UNKNOWN_ERROR);
				log.error("Unexpected Error");
				// Not sure about the exact error, but we should send 500 as this is a retryable
				// exception
				ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
				throw new AvailabilityServiceException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
						ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
								MessagesAndCodes.UPDATE_INVENTORY_AVAILABILITY_HUB_FAILURE)
								.message(MessagesAndCodes.UPDATE_INVENTORY_FAILURE_MESSAGE)
								.errors(Arrays.asList(errorDetailInfo))
								.build()).build());
			}
		} else if(ex instanceof NoContentException)	{
			recordMicrometerMetrics(AvailabilityConstants.SUPPLY_UPDATE_URI, MicroMeterMetricsRecorder.SERVER_NO_CONTENT_ERROR);
			throw new AvailabilityServiceException(HttpStatus.NO_CONTENT.value(), null);
		} else if (ex instanceof FeignException) {
			FeignException feignException = (FeignException) ex;
			log.error(
					MessagesAndCodes.UPDATE_INVENTORY_FAILURE);
			ErrorDetailInfo errorDetailInfo = null;
			if (feignException.status() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
				recordMicrometerMetrics(AvailabilityConstants.SUPPLY_UPDATE_URI, MicroMeterMetricsRecorder.SERVER_INTERNAL_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
				
				
			} else if(feignException.status() == HttpStatus.BAD_REQUEST.value()) {
				recordMicrometerMetrics(AvailabilityConstants.SUPPLY_UPDATE_URI, MicroMeterMetricsRecorder.SERVER_DATA_VALIDATION_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.BAD_REQUEST.value())).
						message(HttpStatus.BAD_REQUEST.name()).build();
			} else {
				recordMicrometerMetrics(AvailabilityConstants.SUPPLY_UPDATE_URI, MicroMeterMetricsRecorder.UNKNOWN_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(feignException.status())).
						message("").build();
			}
			
			throw new AvailabilityServiceException(feignException.status(),
					ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
							MessagesAndCodes.UPDATE_INVENTORY_AVAILABILITY_HUB_FAILURE)
							.message(
									MessagesAndCodes.UPDATE_INVENTORY_FAILURE_MESSAGE)
							.errors(Arrays.asList(errorDetailInfo)).
							build()).build());
			
		} else if (ex instanceof SepValidationException) {
			recordMicrometerMetrics(AvailabilityConstants.SUPPLY_UPDATE_URI, MicroMeterMetricsRecorder.DATA_VALIDATION_ERROR);
			SepValidationException sepValidationException = (SepValidationException) ex;
			if (null != sepValidationException.getViolations() && !sepValidationException.getViolations().isEmpty()) {
				List<ErrorDetailInfo> errorDetailInfos = new ArrayList<>();
				sepValidationException.getViolations().stream().forEach(violation -> {
					log.error(
							" Validation failed for instance of class:'{}'" 
							+ " with property path: '{}'"
							+ " with property value: '{}'" 
							+ " and error message is '{}'",
							request.getClass().toString(), violation.getPropertyPath(), violation.getInvalidValue(),
							violation.getMessage());
					
					ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder()
							.reason(String.valueOf(HttpStatus.BAD_REQUEST.value()))
							.message(violation.getPropertyPath().toString()+ ": " + violation.getMessage())
							.build();
					errorDetailInfos.add(errorDetailInfo);
				});

				throw new AvailabilityServiceException(HttpStatus.BAD_REQUEST.value(),
						ErrorResponseDTO.builder()
								.error(ErrorDetails.builder().code(MessagesAndCodes.UPDATE_INVENTORY_FAILURE)
										.message(MessagesAndCodes.UPDATE_INVENTORY_FAILURE_MESSAGE)
										.errors(errorDetailInfos).build())
								.build());
			}

		}

	}
	
}
