package com.sephora.services.inventoryavailability.exception;


import com.sephora.services.common.inventory.model.ErrorResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LocationEligibilityException extends Exception{
	private int httpStatus;
	private ErrorResponseDTO errorDetails;
}
