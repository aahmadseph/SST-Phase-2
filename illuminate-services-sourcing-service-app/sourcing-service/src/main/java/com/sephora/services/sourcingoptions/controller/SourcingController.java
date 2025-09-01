package com.sephora.services.sourcingoptions.controller;

import javax.validation.Valid;
import javax.websocket.server.PathParam;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.sephora.platform.common.model.dto.ErrorListDto;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapFullDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMappingFilterDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapsDto;
import com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ShipNodeDelayRequestDto;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

/**
 * @author Vitaliy Oleksiyenko
 */
@Api(tags = "Sourcing API: Zone Mapping and SourceItems APIs",
        description = "Sourcing API to work with Zone Mappings and SourceItems")
public interface SourcingController {

    @ApiOperation(value = "${SourcingController.getZoneMapping.value}",
            notes = "${SourcingController.getZoneMapping.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Zone Mappings list", response = ZoneMapDto.class, responseContainer = "List"),
            @ApiResponse(code = 400, response = ErrorListDto.class,
                    message = "The enterpriseCode value provided is not an identified one. List of possible channel values: 'SEPHORAUS', 'SEPHORACA'\n" +
                            "The field 'fromZipCode' length must be less than or equal to 5 symbols\n" +
                            "The field 'toZipCode' length must be less than or equal to 5 symbols\n" +
                            "The field 'nodePriority' length must be less than or equal to 40 symbols"),
            @ApiResponse(code = 404, message = "Zone Mappings by provided criteria not found", response = ErrorListDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class)
    })
    ResponseEntity<Object> getZoneMapping(
            @ApiParam(
                    name = "ZoneMapDto",
                    value = "${SourcingController.getZoneMapping.param.value}")
            @Valid ZoneMappingFilterDto zoneMappingFilterDto) throws SourcingServiceException;
    
    

    @ApiOperation(value = "${SourcingController.getZoneMappingCount.value}",
            notes = "${SourcingController.getZoneMappingCount.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Zone Mappings count", response = ZoneMapDto.class),
                       @ApiResponse(code = 500, message = "Internal server error")
    })
    ResponseEntity<Object> getZoneMappingCount(
            @ApiParam(
                    name = "ZoneMapDto",
                    value = "${SourcingController.getZoneMapping.param.value}")
            @Valid ZoneMappingFilterDto zoneMappingFilterDto) throws SourcingServiceException;
    
    
    @ApiOperation(value = "${SourcingController.uploadZoneMaps.value}",
             notes = "${SourcingController.uploadZoneMaps.notes}")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Zone map items updated successfully", response = ZoneMapFullDto.class, responseContainer = "List"),
        @ApiResponse(code = 400, response = ErrorListDto.class,
                     message = "The field 'nodePriority' must have at least 1 element\n" +
                               "The field 'toZipCode' should be >= 'fromZipCode' field\n" +
                               "The enterpriseCode value provided is not an identified one. List of possible channel values: 'SEPHORAUS', 'SEPHORACA'"
        ),
        @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class)

    })
    ResponseEntity<Object> uploadZoneMaps(
            @ApiParam(
                    value = "ZoneMapController", required = true)
            @Valid @RequestBody ZoneMapsDto zoneMapBean) throws SourcingServiceException;

    @ApiOperation(value = "${SourcingController.deleteZoneMaps.value}",
            notes = "${SourcingController.deleteZoneMaps.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "ZoneMaps removed successfully"),
            @ApiResponse(code = 400, response = ErrorListDto.class,
                    message = "The enterpriseCode value provided is not an identified one. List of possible channel values: 'SEPHORAUS', 'SEPHORACA'\n" +
                            "The field 'fromZipCode' length must be less than or equal to 5 symbols\n" +
                            "The field 'toZipCode' length must be less than or equal to 5 symbols\n" +
                            "The field 'nodePriority' length must be less than or equal to 40 symbols"),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class)
    })
    ResponseEntity<Object> removeZoneMapping(
            @ApiParam(
                    name = "ZoneMapDto",
                    value = "${SourcingController.removeZoneMapping.param.value}")
            @Valid ZoneMappingFilterDto zoneMappingFilterDto) throws SourcingServiceException;


    @ApiOperation(value = "${SourcingController.sourceItems.value}",
            notes = "${SourcingController.sourceItems.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "SourceItems details", response = SourcingOptionsResponseDto.class),
            @ApiResponse(code = 400, message = "Invalid SourceItems request", response = ErrorListDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class),
            @ApiResponse(code = 503, message = "Service Unavailable", response = ErrorListDto.class),
    })
    ResponseEntity getSourceItems(
            @ApiParam(
                    name = "SourceItemsRequest",
                    value = "${SourcingController.sourceItems.sourcingOptionsRequest.value}",
                    required = true)
            @RequestBody @Valid SourcingOptionsRequestDto sourcingOptionsRequest) throws Exception;
    
    @ApiOperation(value = "Uplaod file",
            notes = "csv file",
            produces = "application/json",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "TransitTimes successfully created"),
            @ApiResponse(code = 400, response = ErrorListDto.class, message =
                    "File is too big. Max limit is {size}\n" +
                    "Current request is not a multipart request. Try to specify Content-Type: multipart/form-data header\n" +
                    "Error during converting CSV file. Root cause: {actual root cause}\n" +
                    "The parameter 'file' cannot be null\n"),
            @ApiResponse(code = 404, response = ErrorListDto.class, message =
                    "Ship node with keys {shipNode} is not exist"),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class),
    })
    ResponseEntity uploadCsvFile(@ApiParam(allowableValues = "SEPHORAUS, SEPHORACA") EnterpriseCodeEnum enterpriseCode,
            @ApiParam(name = "file", value = "${SourcingController.uploadCsvFile.param.value}", required = true)
            @RequestParam("file") MultipartFile file)
            throws SourcingServiceException;

    @ApiOperation(value = "Uplaod file",
            notes = "csv file",
            produces = "application/json",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "TransitTimes successfully created"),
            @ApiResponse(code = 400, response = ErrorListDto.class, message =
                    "File is too big. Max limit is {size}\n" +
                            "Current request is not a multipart request. Try to specify Content-Type: multipart/form-data header\n" +
                            "Error during converting CSV file. Root cause: {actual root cause}\n" +
                            "The parameter 'file' cannot be null\n"),
            @ApiResponse(code = 404, response = ErrorListDto.class, message =
                    "Ship node with keys {shipNode} is not exist"),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class),
    })
    ResponseEntity uploadCsvFileForSourcingHub(@ApiParam(allowableValues = "SEPHORAUS, SEPHORACA") EnterpriseCodeEnum enterpriseCode,
                                 @ApiParam(name = "file", value = "${SourcingController.uploadCsvFile.param.value}", required = true)
                                 @RequestParam("file") MultipartFile file,
                                 @RequestParam(name = "publishExternally", defaultValue = "true") Boolean publishExternally)
            throws SourcingServiceException;
    
    @ApiOperation(value = "SourcingController.porcessZonemap.value", notes = "SourcingController.porcessZonemap.notes")            
    ResponseEntity processZoneMapCsvFile(@ApiParam(allowableValues = "SEPHORAUS, SEPHORACA") EnterpriseCodeEnum enterpriseCode) throws SourcingServiceException;
    
    ResponseEntity publishShipnodeDelay(@RequestBody @Valid ShipNodeDelayRequestDto shipNodeDelayelayRequestDto) throws Exception;
    
    ResponseEntity updateShipnodeDelay(@RequestBody @Valid ShipNodeDelayRequestDto shipNodeDelayelayRequestDto) throws Exception;
    
    ResponseEntity deleteShipnodeDelay(String ruleId, String levelOfService, String shipNode) throws Exception;
}
