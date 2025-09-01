package com.sephora.services.inventoryavailability.service;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.sephora.services.inventoryavailability.exception.LocationEligibilityException;
import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.inventoryavailability.mapping.LocationEligibilityMapper;
import com.sephora.services.inventoryavailability.model.LocationEligibilityRequest;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventoryavailability.model.dto.LocationEligibilityDTO;
import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.availabilityhub.client.AvailabilityHubClient;
import com.sephora.services.inventoryavailability.MessagesAndCodes;

import feign.FeignException;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class LocationEligibilityService {
	
	@Autowired
	AvailabilityHubClient yantriksServiceClient;
	
	@Autowired
	LocationEligibilityMapper mapper;
	
	@Autowired
	Validator validator;
	
	public void updateLocationEligibility(LocationEligibilityDTO locationEligibilityDTO) throws LocationEligibilityException {
		try {
			log.info("received location eligibility request {}", locationEligibilityDTO);
			validator.validateItem(locationEligibilityDTO);
			LocationEligibilityRequest request = mapper.convert(locationEligibilityDTO);
			log.debug("location elgibility request converted, {}", request);
			yantriksServiceClient.updateLocationEligibility(request);
			log.info("location eligibility updated successfully");
		} catch (Exception e) {
			log.error("Exception occured", e);
			handleAndConvertException(e);
		}
	}
	
	private void handleAndConvertException(Exception ex) throws LocationEligibilityException {
		if (ex instanceof FeignException) {
			FeignException feignException = (FeignException) ex;
			log.error(
					MessagesAndCodes.LOCATION_ELIGIBILITY_FAILURE);
			ErrorDetailInfo errorDetailInfo = null;
			if (feignException.status() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
				
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
				
				
			} else if(feignException.status() == HttpStatus.NO_CONTENT.value()){
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.NO_CONTENT.value())).
						message(HttpStatus.NO_CONTENT.name()).build();

			} else if(feignException.status() == HttpStatus.BAD_REQUEST.value()) {
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.BAD_REQUEST.value())).
						message(HttpStatus.BAD_REQUEST.name()).build();
			} else {
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(feignException.status())).
						message("").build();
			}
			
			throw new LocationEligibilityException(feignException.status(),
					ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
							MessagesAndCodes.LOCATION_ELIGIBILITY_FAILURE)
							.message(
									MessagesAndCodes.LOCATION_ELIGIBILITY_FAILURE_MESSAGE)
							.errors(Arrays.asList(errorDetailInfo)).
							build()).build());
			
		} else if (ex instanceof SepValidationException) {
			SepValidationException sepValidationException = (SepValidationException)ex;
			
		}

	}
}
