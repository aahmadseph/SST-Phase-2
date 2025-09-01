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

package com.sephora.services.inventoryavailability.controller;

import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventoryavailability.model.transit.TimeInTransitResponse;
import com.sephora.services.inventoryavailability.model.transit.postTimeInTransit.PostTimeInTransitRequest;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;

@Api(tags = "Time in transit APIs", description = "APIs to update and validate TNT updates")
@RequestMapping(path = "v1/transit-services")
public interface TransitServicesController {

    @ApiOperation(value = "Get Time In Transit details from Yantriks")
    @GetMapping(value = "/transitTime", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiResponses({
            @ApiResponse(code=200, response= TimeInTransitResponse.class, message="Sucess"),
            @ApiResponse(code=204, response= ErrorResponseDTO.class, message="No Content"),
            @ApiResponse(code=403, response= ErrorResponseDTO.class, message="Forbidden"),
            @ApiResponse(code=401, response= ErrorResponseDTO.class, message="Unauthorized")
    })
    ResponseEntity<Object> getTimeInTransitDetails(
            @RequestParam(value = "orgId", required = true, defaultValue = "SEPHORA")
            @NotNull String orgId,

            @RequestParam(value = "countryCode", required = true, defaultValue = "US")
            @NotNull String countryCode,

            @RequestParam(value = "destination", required = true, defaultValue = "75024")
            @NotNull String destination,

            @RequestParam(value = "locationType", required = true, defaultValue = "DC")
            @NotNull String locationType,

            @RequestParam(value = "locationId", required = true, defaultValue = "0701")
            @NotNull String locationId,

            @RequestParam(value = "fulfillmentService", required = true, defaultValue = "STANDARD")
            @NotNull String fulfillmentService
    );

    @ApiOperation(value = "Add new transit time to Yantriks")
    @PostMapping(value = "/transitTime", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiResponses({
            @ApiResponse(code = 200, response = TimeInTransitResponse.class, message = "Sucess"),
            @ApiResponse(code = 204, response = ErrorResponseDTO.class, message = "No Content"),
            @ApiResponse(code = 400, message = "Bad Request"),
            @ApiResponse(code = 403, response = ErrorResponseDTO.class, message = "Forbidden"),
            @ApiResponse(code = 401, response = ErrorResponseDTO.class, message = "Unauthorized"),
            @ApiResponse(code = 409, response = ErrorResponseDTO.class, message = "Entity already exists"),
    })
    ResponseEntity<Object> addTimeInTransitDetails(@RequestBody PostTimeInTransitRequest postTimeInTransitRequest);

    @ApiOperation(value = "Update existing transit time in Yantriks")
    @PutMapping(value = "/transitTime", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiResponses({
            @ApiResponse(code = 200, response = TimeInTransitResponse.class, message = "Sucess"),
            @ApiResponse(code = 204, response = ErrorResponseDTO.class, message = "No Content"),
            @ApiResponse(code = 400, message = "Bad Request"),
            @ApiResponse(code = 403, response = ErrorResponseDTO.class, message = "Forbidden"),
            @ApiResponse(code = 401, response = ErrorResponseDTO.class, message = "Unauthorized"),
    })
    ResponseEntity<Object> updateTimeInTransitDetails(@RequestBody PostTimeInTransitRequest postTimeInTransitRequest);
}
