package com.sephora.services.inventoryavailability.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.sephora.services.inventoryavailability.config.InventorySupplyDefaultConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.sephora.services.availabilityhub.client.AvailabilityHubClient;
import com.sephora.services.availabilityhub.client.CustomAvailabilityHubClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.availability.metrics.MicroMeterMetricsRecorder;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.LocationEligibilityException;
import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.inventoryavailability.mapping.GetInventorySupplyMapper;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyCallerResponse;

import feign.FeignException;
import feign.RetryableException;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class GetInventorySupplyService extends AbstractAvailabilityService {

	@Autowired
	AvailabilityHubClient availabilityHubClient;

	@Autowired
	CustomAvailabilityHubClient customAvailabilityHubClient;

	@Autowired
	GetInventorySupplyMapper getInventorySupplyMapper;

	@Autowired
	InventorySupplyDefaultConfig supplyConfig;

	@Value("${inventory.defaultOrgId:SEPHORA}")
	private String orgId;

	@Value("#{'${shipment.dc-locations:0701,0801,1001,1021,1050,0750,1070}'.split(',')}")
	List<String> dcShipmentLocations = new ArrayList<>();

	/**
	 * This method is used to search a product in network.
	 * It returns the all matched locations details.
	 *
	 * @param productId
	 * @param uom
	 * @return
	 * @throws AvailabilityServiceException
	 */
	public GetInventorySupplyCallerResponse search(String productId, String uom) throws AvailabilityServiceException {
		GetInventorySupplyCallerResponse callerResponse = null;
		try {
			log.info("Searching inventory supply for product: {} and uom: {} in Yantriks", productId, uom);
			GetInventorySupplyAHResponse ahResponse = availabilityHubClient.getInventorySupply(orgId, productId, uom);
			log.debug("Searching inventory supply is completed with result {}", ahResponse);

			log.debug("Converting Yantriks response to caller response");
			callerResponse = getInventorySupplyMapper.convert(ahResponse);
			log.info("Converted Yantriks response to caller response: {}", callerResponse);

		} catch (Exception ex) {
			log.error("Exception occured while submiting search InventorySupply", ex);
			if (ex instanceof AvailabilityServiceException) {
				throw (AvailabilityServiceException) ex;
			} else {
				handleAndConvertException(ex, AvailabilityConstants.GET_SUPPLY_NETWORK_URI);
			}
		}
		return callerResponse;
	}

	/**
	 * This method will search a product for a particular location.
	 * And it returns matched location details
	 *
	 * @param productId
	 * @param uom
	 * @param locationId
	 * @return
	 * @throws AvailabilityServiceException
	 */
	public GetInventorySupplyCallerResponse search(String productId, String uom, String locationId) throws AvailabilityServiceException {
		GetInventorySupplyCallerResponse callerResponse = null;
		try {
			String locationType = dcShipmentLocations.contains(locationId) ? AvailabilityConstants.DC : AvailabilityConstants.STORE;

			log.info("Searching inventory supply for product: {} and uom: {} locationId: {} in Yantriks", productId, uom, locationId);
			GetInventorySupplyAHResponse ahResponse = customAvailabilityHubClient.getInventorySupply(orgId, productId, uom, locationType, locationId);
			log.debug("Searching inventory supply is completed with result {} ", ahResponse);

			log.debug("Converting Yantriks response to caller response");
			callerResponse = getInventorySupplyMapper.convert(ahResponse);
			log.info("Converted Yantriks response to caller response: {}", callerResponse);


		} catch(NoContentException noContentException){
			//no content received from yantriks
			log.error("no content response received from yantriks for get supply request with productId: {}", productId);
			log.debug("creating response for request with productId : {}", productId);
			GetInventorySupplyCallerResponse responseForNoContentResponse = getInventorySupplyMapper.createResponseForNoContentResponse(productId, uom, locationId, supplyConfig);
			log.info("response created for no content response from yantriks , {}", responseForNoContentResponse);
			return responseForNoContentResponse;
		}
		catch (Exception ex) {
			log.error("Exception occured while submiting search InventorySupply", ex);
			if (ex instanceof AvailabilityServiceException) {
				throw (AvailabilityServiceException) ex;
			} else {
				handleAndConvertException(ex, AvailabilityConstants.GET_SUPPLY_LOCATION_URI);
			}
		}
		return callerResponse;
	}

	/**
	 * The method will handle different type of exception happens while sending request to yantriks.
	 * Also prepare exception response for the respective exceptions.
	 *
	 * @param ex
	 * @throws LocationEligibilityException
	 */
	private void handleAndConvertException(Exception ex, String uri) throws AvailabilityServiceException {

		if(ex instanceof RetryableException) {
			if (ex.getCause() instanceof IOException) {

				recordMicrometerMetrics(uri, MicroMeterMetricsRecorder.COMMUNICATION_ERROR);

				ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();

				throw new AvailabilityServiceException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
						ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
								MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE)
								.message(
										MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE_MESSAGE)
								.errors(Arrays.asList(errorDetailInfo)).
								build()).build());
			} else {
				recordMicrometerMetrics(uri, MicroMeterMetricsRecorder.UNKNOWN_ERROR);
				log.error("Unexpected Error");
				// Not sure about the exact error, but we should send 500 as this is a retryable
				// exception
				ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
				throw new AvailabilityServiceException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
						ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
								MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE)
								.message(MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE_MESSAGE)
								.errors(Arrays.asList(errorDetailInfo))
								.build()).build());
			}
		} else if(ex instanceof NoContentException)	{
			recordMicrometerMetrics(uri, MicroMeterMetricsRecorder.SERVER_NO_CONTENT_ERROR);
			throw new AvailabilityServiceException(HttpStatus.NO_CONTENT.value(), null);
		} else if (ex instanceof FeignException) {
			FeignException feignException = (FeignException) ex;
			log.error(
					MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE);
			ErrorDetailInfo errorDetailInfo = null;
			if (feignException.status() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
				recordMicrometerMetrics(uri, MicroMeterMetricsRecorder.SERVER_INTERNAL_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();


			} else if(feignException.status() == HttpStatus.BAD_REQUEST.value()) {
				recordMicrometerMetrics(uri, MicroMeterMetricsRecorder.SERVER_DATA_VALIDATION_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.BAD_REQUEST.value())).
						message(HttpStatus.BAD_REQUEST.name()).build();
			} else {
				recordMicrometerMetrics(uri, MicroMeterMetricsRecorder.UNKNOWN_ERROR);
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(feignException.status())).
						message("").build();
			}

			throw new AvailabilityServiceException(feignException.status(),
					ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
							MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE)
							.message(
									MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE_MESSAGE)
							.errors(Arrays.asList(errorDetailInfo)).
							build()).build());

		} else if (ex instanceof SepValidationException) {
			recordMicrometerMetrics(uri, MicroMeterMetricsRecorder.DATA_VALIDATION_ERROR);
			SepValidationException sepValidationException = (SepValidationException) ex;
			if (null != sepValidationException.getViolations() && !sepValidationException.getViolations().isEmpty()) {
				List<ErrorDetailInfo> errorDetailInfos = new ArrayList<>();
				sepValidationException.getViolations().stream().forEach(violation -> {
					ErrorDetailInfo errorDetailInfo = ErrorDetailInfo.builder()
							.reason(String.valueOf(HttpStatus.BAD_REQUEST.value()))
							.message(violation.getPropertyPath().toString()+ ": " + violation.getMessage())
							.build();
					errorDetailInfos.add(errorDetailInfo);
				});

				throw new AvailabilityServiceException(HttpStatus.BAD_REQUEST.value(),
						ErrorResponseDTO.builder()
								.error(ErrorDetails.builder().code(MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE)
										.message(MessagesAndCodes.GET_INVENTORY_SUPPLY_FAILURE_MESSAGE)
										.errors(errorDetailInfos).build())
								.build());
			}

		}

	}
 }
