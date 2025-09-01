/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2020 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.inventoryavailability.controller.impl;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.inventoryavailability.controller.TransitServicesController;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.transit.TimeInTransitResponse;
import com.sephora.services.inventoryavailability.model.transit.postTimeInTransit.PostTimeInTransitRequest;
import com.sephora.services.inventoryavailability.service.TimeInTransitService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.validation.constraints.NotNull;

/**
 * @author Shiljo Jose
 */
@ConditionalOnProperty(prefix = "yantriks", name = "enabled", havingValue = "true")
@RestController
@ControllerDocumentation
@Log4j2
@EnableSwagger2
public class TransitServicesControllerImpl implements TransitServicesController {

    @Autowired
    TimeInTransitService timeInTransitService;

    public ResponseEntity<Object> getTimeInTransitDetails(
            @NotNull String orgId,
            @NotNull String countryCode,
            @NotNull String destination,
            @NotNull String locationType,
            @NotNull String locationId,
            @NotNull String fulfillmentService
    ) {
        try {
            log.info("Received request to get time-in-transit details with orgId:{}, countryCode:{}, destination:{}, locationType:{}, locationId:{}, fulfillmentService:{}",
                    orgId, countryCode, destination, locationType, locationId, fulfillmentService);
            TimeInTransitResponse timeInTransitDetails = timeInTransitService.getTimeInTransitDetails(orgId, countryCode, destination, locationType, locationId, fulfillmentService);
            log.info("Received response from Yantriks : GET time-in-transit details with orgId:{}, countryCode:{}, destination:{}, locationType:{}, locationId:{}, fulfillmentService:{}. Response: {}",
                    orgId, countryCode, destination, locationType, locationId, fulfillmentService, timeInTransitDetails);
            return new ResponseEntity<Object>(timeInTransitDetails,HttpStatus.OK);
        } catch (AvailabilityServiceException availabilityServiceException) {
            log.error("Error occurred while getting time-in-transit details with orgId:{}, countryCode:{}, destination:{}, locationType:{}, locationId:{}, fulfillmentService:{}, error:  {}",
                                        orgId, countryCode, destination, locationType, locationId, fulfillmentService, availabilityServiceException);
            return new ResponseEntity<>(
                    availabilityServiceException.getErrorDetails(),
                    HttpStatus.resolve(availabilityServiceException.getHttpStatus())
            );
        }
    }

    @Override
    public ResponseEntity<Object> addTimeInTransitDetails(PostTimeInTransitRequest postTimeInTransitRequest) {
        try {
            log.info("Received request to add new time in transit detail. Payload : {}", postTimeInTransitRequest);
            TimeInTransitResponse timeInTransitResponse = timeInTransitService.postTimeInTransitDetails(postTimeInTransitRequest);
            log.info("Received response from Yantriks : POST time-in-transit details. Response```````````````` {}", timeInTransitResponse);
            return new ResponseEntity<Object>(
                    timeInTransitResponse,
                    HttpStatus.OK
            );
        }
        catch (AvailabilityServiceException availabilityServiceException) {
            log.error("Error occurred while updating time-in-transit details. Request payload: {}; {}",
                    postTimeInTransitRequest, availabilityServiceException);
            return new ResponseEntity<>(
                    availabilityServiceException.getErrorDetails(),
                    HttpStatus.resolve(availabilityServiceException.getHttpStatus())
            );
        }
    }

    @Override
    public ResponseEntity<Object> updateTimeInTransitDetails(PostTimeInTransitRequest postTimeInTransitRequest) {
        try {
            log.info("Received request to update time in transit detail. Payload : {}", postTimeInTransitRequest);
            TimeInTransitResponse timeInTransitResponse = timeInTransitService.updateTimeInTransitDetails(postTimeInTransitRequest);
            log.info("Received response from Yantriks : PUT time-in-transit details. Response {}", timeInTransitResponse);
            return new ResponseEntity<Object>(
                    timeInTransitResponse,
                    HttpStatus.OK
            );
        }
        catch (AvailabilityServiceException availabilityServiceException) {
            log.error("Error occurred while updating time-in-transit details. Request payload: {}; {}",
                    postTimeInTransitRequest, availabilityServiceException);
            return new ResponseEntity<>(
                    availabilityServiceException.getErrorDetails(),
                    HttpStatus.resolve(availabilityServiceException.getHttpStatus())
            );
        }
    }
}
