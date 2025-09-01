package com.sephora.services.productaggregationservice.productaggregationservice.controller;

import com.sephora.platform.common.model.dto.ErrorDto;
import com.sephora.platform.common.model.dto.ErrorListDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;


import com.sephora.services.productaggregationservice.productaggregationservice.dto.ReferenceDto;
import com.sephora.services.productaggregationservice.productaggregationservice.dto.request.ReferenceItemCreateRequestDto;
import com.sephora.services.productaggregationservice.productaggregationservice.dto.request.ReferenceItemsUpdateStatusRequest;
import com.sephora.services.productaggregationservice.productaggregationservice.dto.response.ReferenceItemResponse;
import com.sephora.services.productaggregationservice.productaggregationservice.dto.response.ReferenceItemsResponse;

@Tag(name = "ProductAggregationService API", description = "API to get Reference Values")
public interface ProductAggregationServiceController {

    @Operation(summary = "${ProductAggregationServiceController.referenceItems.value}", description = "${ProductAggregationServiceController.referenceItems.notes}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Reference Item Details", content = @Content(mediaType = "application/json",schema = @Schema(implementation= ReferenceItemResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid Reference Item request", content = @Content(mediaType = "application/json",array = @ArraySchema(schema = @Schema(implementation = ErrorDto.class)))),
        @ApiResponse(responseCode = "500", description = "Internal server error"),
        @ApiResponse(responseCode = "503", description = "Service Unavailable") })
    ResponseEntity addReferenceItems(@Parameter(name = "ReferenceItemCreateRequestDto",required = true)@RequestBody @Valid ReferenceItemCreateRequestDto referenceItemCreateRequestDto);


    @Operation(summary = "${ProductAggregationServiceController.updateReferenceItems.value}",description = "${ProductAggregationServiceController.updateReferenceItems.notes}")
    @ApiResponses(value = {
        @ApiResponse(responseCode  = "200", description = "Reference Item Details", content = @Content(mediaType = "application/json", schema = @Schema(implementation= ReferenceDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid Reference Item request", content = @Content(mediaType = "application/json",array = @ArraySchema(schema = @Schema(implementation = ErrorDto.class)))),
        @ApiResponse(responseCode = "500", description = "Internal server error"),
        @ApiResponse(responseCode = "503", description = "Service Unavailable") })
    ResponseEntity updateReferenceItems(@Parameter(description = "ReferenceItemsUpdateStatusRequest",required = true)@RequestBody @Valid ReferenceItemsUpdateStatusRequest referenceItemsUpdateStatusRequest);


    @Operation(summary = "${ProductAggregationServiceController.getReferenceItem.value}", description = "${ProductAggregationServiceController.getReferenceItem.notes}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reference Item details", content = @Content(mediaType = "application/json",schema = @Schema(implementation= ReferenceDto.class))),
        @ApiResponse(responseCode = "404", description = "Reference Item not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json",schema = @Schema(implementation= ErrorListDto.class))),
    })
    ResponseEntity getReferenceItem(@Parameter(description = "${ProductAggregationServiceController.getReferenceItem.param.id.value}",required = true)String id);


    @Operation(summary = "${ProductAggregationServiceController.getReferenceItemById.value}", description = "${ProductAggregationServiceController.getReferenceItemById.notes}")
        @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Reference Item details", content = @Content(mediaType = "application/json",schema = @Schema(implementation= ReferenceDto.class))),
        @ApiResponse(responseCode = "404", description = "Reference Item not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error") })
    ResponseEntity getReferenceItemById(@Parameter(description = "${ProductAggregationServiceController.getReferenceItem.param.id.value}", required = true) String id);
}
