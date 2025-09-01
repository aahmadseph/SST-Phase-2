package com.sephora.productexpservice.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import com.sephora.platform.common.model.dto.ErrorListDto;
import com.sephora.productexpservice.dto.ReferenceDto;
import com.sephora.productexpservice.dto.request.ReferenceItemCreateRequestDto;
import com.sephora.productexpservice.dto.request.ReferenceItemsUpdateStatusRequest;
import com.sephora.productexpservice.dto.response.ReferenceItemResponse;
import com.sephora.productexpservice.dto.response.ReferenceItemsResponse;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Api(tags = "Productexpservice API", description = "API to get Reference Values")
public interface ProductexpserviceController {

   @ApiOperation(value = "${ProductexpserviceController.referenceItems.value}",
         notes = "${ProductexpserviceController.referenceItems.notes}")
   @ApiResponses(value = {
         @ApiResponse(code = 200, message = "Reference Item Details", response = ReferenceItemResponse.class),
         @ApiResponse(code = 400, message = "Invalid Reference Item request", response = ErrorListDto.class),
         @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class),
         @ApiResponse(code = 503, message = "Service Unavailable", response = ErrorListDto.class),
   })
   ResponseEntity addReferenceItems(
         @ApiParam(
               name = "ReferenceItemCreateRequestDto",
               required = true)
         @RequestBody ReferenceItemCreateRequestDto referenceItemCreateRequestDto);


   @ApiOperation(value = "${ProductexpserviceController.updateReferenceItems.value}",
         notes = "${ProductexpserviceController.updateReferenceItems.notes}")
   @ApiResponses(value = {
         @ApiResponse(code = 200, message = "Reference Item Details", response = ReferenceItemsResponse.class),
         @ApiResponse(code = 400, message = "Invalid Reference Item request", response = ErrorListDto.class),
         @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class),
         @ApiResponse(code = 503, message = "Service Unavailable", response = ErrorListDto.class),
   })
   ResponseEntity updateReferenceItems(
         @ApiParam(
               name = "ReferenceItemsUpdateStatusRequest",
               required = true)
         @RequestBody @Valid ReferenceItemsUpdateStatusRequest referenceItemsUpdateStatusRequest);


   @ApiOperation(value = "${ProductexpserviceController.getReferenceItem.value}",
         notes = "${ProductexpserviceController.getReferenceItem.notes}")
   @ApiResponses(value = {
         @ApiResponse(code = 200, message = "Reference Item details", response = ReferenceDto.class),
         @ApiResponse(code = 404, message = "Reference Item not found"),
         @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class),
   })
   ResponseEntity getReferenceItem(
         @ApiParam(
               value = "${ProductexpserviceController.getReferenceItem.param.id.value}",
               required = true)
               String id
   );
   
   @ApiOperation(value = "${ProductexpserviceController.getReferenceItemById.value}", notes = "${ProductexpserviceController.getReferenceItemById.notes}")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Reference Item details", response = ReferenceDto.class),
			@ApiResponse(code = 404, message = "Reference Item using Id not found"),
			@ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class), })
	ResponseEntity getReferenceItemById(
			@ApiParam(value = "${ProductexpserviceController.getReferenceItem.param.id.value}", required = true) String id);
}
