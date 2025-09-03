package com.sephora.services.inventoryavailability.service;

import com.sephora.services.availabilityhub.client.TransitServiceClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.transit.TimeInTransitResponse;
import com.sephora.services.inventoryavailability.model.transit.postTimeInTransit.PostTimeInTransitRequest;
import feign.FeignException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;

@Service
@Log4j2
public class TimeInTransitService {
	
	@Autowired
	TransitServiceClient transitServiceClient;

	public TimeInTransitResponse getTimeInTransitDetails(
			@NotNull String orgId,
			@NotNull String countryCode,
			@NotNull String destination,
			@NotNull String locationType,
			@NotNull String locationId,
			@NotNull String fulfillmentService
	) throws AvailabilityServiceException {
		try {
			return transitServiceClient.getTimeInTransitDetails(orgId, countryCode, destination, locationType, locationId, fulfillmentService);
		} catch (NoContentException e) {
			throw new AvailabilityServiceException(
					HttpStatus.NO_CONTENT.value(),
					new ErrorResponseDTO().toBuilder()
							.error(
									ErrorDetails.builder()
											.message(e.getMessage())
											.build()
							)
							.build()
			);
		} catch (FeignException e) {
			throw new AvailabilityServiceException(
					e.status(),
					new ErrorResponseDTO().toBuilder()
							.error(
									ErrorDetails.builder()
											.message(e.getMessage())
											.build()
							)
							.build()
			);
		}
		catch (Exception e) {
			throw new AvailabilityServiceException(
					HttpStatus.INTERNAL_SERVER_ERROR.value(),
					new ErrorResponseDTO().toBuilder()
							.error(
									ErrorDetails.builder()
											.message(e.toString())
											.build()
							)
							.build()
			);
		}
	}

	public TimeInTransitResponse postTimeInTransitDetails(PostTimeInTransitRequest postTimeInTransitRequest) throws AvailabilityServiceException {
		try {
			return transitServiceClient.postTimeInTransitDetails(postTimeInTransitRequest);
		} catch (FeignException e) {
			if(HttpStatus.FOUND.value() == e.status()){
				throw new AvailabilityServiceException(
						HttpStatus.INTERNAL_SERVER_ERROR.value(),
						new ErrorResponseDTO().toBuilder()
								.error(
										ErrorDetails.builder()
												.code(e.getMessage())
												.message("Yantriks is unavailable!")
												.build()
								)
								.build()
				);
			}
			throw new AvailabilityServiceException(
					e.status(),
					new ErrorResponseDTO().toBuilder()
							.error(
									ErrorDetails.builder()
											.message(e.getMessage())
											.build()
							)
							.build()
			);
		} catch (Exception e) {
			throw new AvailabilityServiceException(
					HttpStatus.INTERNAL_SERVER_ERROR.value(),
					new ErrorResponseDTO().toBuilder()
							.error(
									ErrorDetails.builder()
											.message(e.toString())
											.build()
							)
							.build()
			);
		}
    }

	public TimeInTransitResponse updateTimeInTransitDetails(PostTimeInTransitRequest postTimeInTransitRequest) throws AvailabilityServiceException {
		try {
			return transitServiceClient.updateTimeInTransitDetails(postTimeInTransitRequest);
		} catch (FeignException e) {
			if(HttpStatus.FOUND.value() == e.status()){
				throw new AvailabilityServiceException(
						HttpStatus.INTERNAL_SERVER_ERROR.value(),
						new ErrorResponseDTO().toBuilder()
								.error(
										ErrorDetails.builder()
												.code(e.getMessage())
												.message("Yantriks is unavailable!")
												.build()
								)
								.build()
				);
			}
			throw new AvailabilityServiceException(
					e.status(),
					new ErrorResponseDTO().toBuilder()
							.error(
									ErrorDetails.builder()
											.message(e.getMessage())
											.build()
							)
							.build()
			);
		} catch (Exception e) {
			throw new AvailabilityServiceException(
					HttpStatus.INTERNAL_SERVER_ERROR.value(),
					new ErrorResponseDTO().toBuilder()
							.error(
									ErrorDetails.builder()
											.message(e.toString())
											.build()
							)
							.build()
			);
		}
	}
}
