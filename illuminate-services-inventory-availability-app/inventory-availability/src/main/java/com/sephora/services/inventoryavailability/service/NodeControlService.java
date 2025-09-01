package com.sephora.services.inventoryavailability.service;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.availabilityhub.client.AvailabilityClient;
import com.sephora.services.availabilityhub.client.AvailabilityHubClient;
import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.LocationEligibilityException;
import com.sephora.services.inventoryavailability.mapping.NodeControlMapper;
import com.sephora.services.inventoryavailability.model.fiegn.ExceptionContent;
import com.sephora.services.inventoryavailability.model.nodecontrol.NodeControlDTO;
import com.sephora.services.inventoryavailability.model.nodecontrol.availabilityhub.NodeControlRequest;

import feign.FeignException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class NodeControlService {

	@Autowired
	AvailabilityClient availabilityClient;

	@Autowired
	NodeControlMapper nodeControlMapper;

	@Autowired
	Validator validator;
	
	@Autowired
    private ObjectMapper mapper;

	public void unlockSku(NodeControlDTO nodeControlDTO) throws AvailabilityServiceException {
		try {
			log.info("Received unlockSku message for the item: {}, shipNode: {}, expirationTime: {}",
					nodeControlDTO.getProductId(), nodeControlDTO.getLocationId(), nodeControlDTO.getExpirationTime());
			log.debug("Validating unlockSku message received: {}", nodeControlDTO);

			validator.validateItem(nodeControlDTO);

			log.debug("Converting unlockSku message to Yantriks format for the product:"
					+ nodeControlDTO.getProductId());
			NodeControlRequest request = nodeControlMapper.convert(nodeControlDTO);
			log.debug("Converted unlockSku control message: {} ", request);

			log.debug("Submitting  unlockSku update request to Yantriks for the product :"
					+ nodeControlDTO.getProductId());
			//request.setTdet("");
			availabilityClient.updateInventoryControl(request);
			log.info(
					"Successfully submitted unlockSku message to Yantriks for the product: {}, shipNode: {}, expirationTime: {}",
					request.getProductId(), request.getLocationId(), request.getTdet());
		} catch (Exception e) {
			log.error("Exception occuered while ulock sku", e);
			handleAndConvertException(e);
		}

	}
	
	private void handleAndConvertException(Exception ex) throws AvailabilityServiceException {
		if (ex instanceof FeignException) {
			FeignException feignException = (FeignException) ex;
			log.error(
					MessagesAndCodes.NODE_CONTROL_FAILURE);
			ErrorDetailInfo errorDetailInfo = null;
			if (feignException.status() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
				
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())).
						message(HttpStatus.INTERNAL_SERVER_ERROR.name()).build();
				
				
			} else if(feignException.status() == HttpStatus.NO_CONTENT.value()){
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.NO_CONTENT.value())).
						message(HttpStatus.NO_CONTENT.name()).build();

			} else if(feignException.status() == HttpStatus.BAD_REQUEST.value()) {
				String exceptionContent = new String(feignException.content());
				try {
					ExceptionContent content = mapper.readValue(exceptionContent, ExceptionContent.class);
					if(null != content) {
						errorDetailInfo = ErrorDetailInfo.builder().reason(content.getError()).
								message(content.getMessage()).build();
					} else {
						errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.BAD_REQUEST.value())).
								message(HttpStatus.BAD_REQUEST.name()).build();
					}
				} catch (JsonMappingException e) {
					errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.BAD_REQUEST.value())).
							message(HttpStatus.BAD_REQUEST.name()).build();
				} catch (JsonProcessingException e) {
					errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(HttpStatus.BAD_REQUEST.value())).
							message(HttpStatus.BAD_REQUEST.name()).build();
				}
			} else {
				errorDetailInfo = ErrorDetailInfo.builder().reason(String.valueOf(feignException.status())).
						message("").build();
			}
			
			throw new AvailabilityServiceException(feignException.status(),
					ErrorResponseDTO.builder().error(ErrorDetails.builder().code(
							MessagesAndCodes.NODE_CONTROL_FAILURE)
							.message(
									MessagesAndCodes.NODE_CONTROL_FAILURE_MESSAGE)
							.errors(Arrays.asList(errorDetailInfo)).
							build()).build());
			
		} else if (ex instanceof SepValidationException) {
			SepValidationException sepValidationException = (SepValidationException)ex;
			
		}

	}
}
