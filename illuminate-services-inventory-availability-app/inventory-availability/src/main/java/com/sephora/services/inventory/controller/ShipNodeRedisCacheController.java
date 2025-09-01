package com.sephora.services.inventory.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;

import com.sephora.services.inventory.model.cache.ShipNodeCache;
import com.sephora.services.inventory.model.dto.ErrorListDto;
import com.sephora.services.inventory.model.dto.UpdateShipNodesStatusDto;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Api(tags = "Shipping Nodes API", description = "API to work with Shipping Nodes")
public interface ShipNodeRedisCacheController {

	 public String saveInRedis(ShipNodeCache value);
	 
	 public ShipNodeCache getFromRedis(String key);
	 
	 public boolean delete(String key);
	 
	 @ApiOperation(value = "${ShipNodeController.updateShipNodesStatus.value}",
	            notes = "${ShipNodeController.updateShipNodesStatus.notes}")
	    @ApiResponses(value = {
	            @ApiResponse(code = 200, message = "ShipNodes statuses updated successfully"),
	            @ApiResponse(code = 400, response = ErrorListDto.class,
	                    message = "Invalid format\n" +
	                            "The field 'shipNodesStatuses' must have at least 1 element\n" +
	                            "The field 'shipNodesStatuses.shipNodes' must have at least 1 element\n" +
	                            "The field 'shipNodesStatuses.status' cannot be null or blank\n" +
	                            "The field 'shipNodesStatuses.status' value is not an identified one. List of possible values: 'LOCKED', 'ACTIVE'\n" +
	                            "The fields element 'shipNodesStatuses.shipNodes' length must be less than or equal to 40 symbols\n"
	            ),
	            @ApiResponse(code = 404, message = "Unable to find 'ShipNodes' with keys=[{keys}]", response = ErrorListDto.class),
	            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class)
	    })
	    ResponseEntity<Object> updateShipNodesStatus(
	            @ApiParam(
	                    name = "UpdateShipNodesStatusDto",
	                    value = "${ShipNodeController.updateShipNodesStatus.param.value}",
	                    required = true)
	            @Valid UpdateShipNodesStatusDto updateShipNodeStatus);
	 
	 public ResponseEntity<Object> warmup();
}


