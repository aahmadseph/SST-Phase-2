package com.sephora.services.inventoryavailability.exception;

import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.GetAvailabilityResponseData;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AvailabilityServicePartialFailureException extends Exception{
    private int httpStatus;
    private GetAvailabilityResponseData availabilityResponseData;
    private AvailabilityResponseDto responseData;

    public AvailabilityServicePartialFailureException(int httpStatus, GetAvailabilityResponseData availabilityResponseData) {
        this.httpStatus = httpStatus;
        this.availabilityResponseData = availabilityResponseData;
    }


}
