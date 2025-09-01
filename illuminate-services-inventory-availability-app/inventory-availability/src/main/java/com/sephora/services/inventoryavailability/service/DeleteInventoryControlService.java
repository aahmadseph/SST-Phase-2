package com.sephora.services.inventoryavailability.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.sephora.services.availabilityhub.client.AvailabilityClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.availability.metrics.MicroMeterMetricsRecorder;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.LocationEligibilityException;
import com.sephora.services.inventoryavailability.model.inventorycontrol.DeleteInventoryControlDTO;

import feign.FeignException;
import feign.RetryableException;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class DeleteInventoryControlService extends AbstractAvailabilityService {
	
	@Autowired
	AvailabilityClient availabilityClient;
	
	@Autowired
	Validator validator;
	
	@Value("${inventory.defaultOrgId:SEPHORA}")
	private String orgId;
	
	@Value("#{'${shipment.dc-locations:0701,0801,1001,1021,1050,0750,1070}'.split(',')}")
	List<String> dcShipmentLocations = new ArrayList<>();
	
	public void deleteInventoryControl(DeleteInventoryControlDTO deleteInventoryControlDTO) throws AvailabilityServiceException {
		try {
			log.debug("Validating the delete inventory control productid: {} request: {}",deleteInventoryControlDTO.getProductId(), deleteInventoryControlDTO);
			validator.validateItem(deleteInventoryControlDTO);
			
			String locationType = dcShipmentLocations.contains(deleteInventoryControlDTO.getLocationId()) ? AvailabilityConstants.DC : AvailabilityConstants.STORE;
			
			log.debug("Deleting inventory control from yantrisk for product: {} and locationid: {}", 
					deleteInventoryControlDTO.getProductId(), deleteInventoryControlDTO.getLocationId());
			availabilityClient.deleteInventoryControl(orgId, deleteInventoryControlDTO.getProductId(), 
					deleteInventoryControlDTO.getUom(), deleteInventoryControlDTO.getLocationId(), locationType);
			log.info("Succesfully deleted inventory control from yantriks for product: {} and locationid: {}", 
					deleteInventoryControlDTO.getProductId(), deleteInventoryControlDTO.getLocationId());
		} catch(Exception e) {
			handleAndConvertException(e, deleteInventoryControlDTO);
		}
	}
	
	/**
	 * The method will handle different type of exception happens while sending request to yantriks.
	 * Also prepare exception response for the respective exceptions.
	 * 
	 * @param ex
	 * @throws LocationEligibilityException
	 */
	private void handleAndConvertException(Exception ex, DeleteInventoryControlDTO request) throws AvailabilityServiceException {
		log.error("Exception occured while deleting inventory control: {}", request, ex);
		if(ex instanceof RetryableException) {
			if (ex.getCause() instanceof IOException) {
				recordMicrometerMetrics(AvailabilityConstants.DELETE_CONTROL_URI, MicroMeterMetricsRecorder.COMMUNICATION_ERROR);
				
				ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
				
				throw new AvailabilityServiceException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
						ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
								MessagesAndCodes.DELETE_CONTROL_HUB_FAILURE)
								.message(
										MessagesAndCodes.DELETE_CONTROL_FAILURE_MESSAGE)
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
								MessagesAndCodes.DELETE_CONTROL_HUB_FAILURE)
								.message(MessagesAndCodes.DELETE_CONTROL_FAILURE_MESSAGE)
								.errors(Arrays.asList(errorDetailInfo))
								.build()).build());
			}
		} else if(ex instanceof NoContentException)	{
			recordMicrometerMetrics(AvailabilityConstants.DELETE_CONTROL_URI, MicroMeterMetricsRecorder.SERVER_NO_CONTENT_ERROR);
			throw new AvailabilityServiceException(HttpStatus.NO_CONTENT.value(), null);
		} else if (ex instanceof FeignException) {
			FeignException feignException = (FeignException) ex;
			log.error(
					MessagesAndCodes.DELETE_CONTROL_FAILURE);
			ErrorDetailInfo errorDetailInfo = null;
			if (feignException.status() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
				recordMicrometerMetrics(AvailabilityConstants.DELETE_CONTROL_URI, MicroMeterMetricsRecorder.SERVER_INTERNAL_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
				
				
			} else if(feignException.status() == HttpStatus.BAD_REQUEST.value()) {
				recordMicrometerMetrics(AvailabilityConstants.DELETE_CONTROL_URI, MicroMeterMetricsRecorder.SERVER_DATA_VALIDATION_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.BAD_REQUEST.value())).
						message(HttpStatus.BAD_REQUEST.name()).build();
			} else {
				recordMicrometerMetrics(AvailabilityConstants.SUPPLY_UPDATE_URI, MicroMeterMetricsRecorder.UNKNOWN_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(feignException.status())).
						message("").build();
			}
			
			throw new AvailabilityServiceException(feignException.status(),
					ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
							MessagesAndCodes.DELETE_CONTROL_HUB_FAILURE)
							.message(
									MessagesAndCodes.DELETE_CONTROL_FAILURE_MESSAGE)
							.errors(Arrays.asList(errorDetailInfo)).
							build()).build());
			
		} else if (ex instanceof SepValidationException) {
			recordMicrometerMetrics(AvailabilityConstants.DELETE_CONTROL_URI, MicroMeterMetricsRecorder.DATA_VALIDATION_ERROR);
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
								.error(ErrorDetails.builder().code(MessagesAndCodes.DELETE_CONTROL_FAILURE)
										.message(MessagesAndCodes.DELETE_CONTROL_FAILURE_MESSAGE)
										.errors(errorDetailInfos).build())
								.build());
			}

		} else {
			ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
					message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
			throw new AvailabilityServiceException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
					ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
							MessagesAndCodes.DELETE_CONTROL_HUB_FAILURE)
							.message(MessagesAndCodes.DELETE_CONTROL_FAILURE_MESSAGE)
							.errors(Arrays.asList(errorDetailInfo))
							.build()).build());
		}

	}
}
