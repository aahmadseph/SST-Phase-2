package com.sephora.services.confighub.controller;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.springframework.http.ResponseEntity;

import com.sephora.services.confighub.dto.ChannelPropertyDto;
import com.sephora.services.confighub.dto.UpdatePropertyValuesDto;
import com.sephora.services.confighub.validation.dto.ErrorListDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Configuration API", description = "API related to configuration")

public interface ConfighubController {
    
    @Operation(summary = "Create Configuration", description = "End point to create configuration")
    @ApiResponse(responseCode = "201", description = "Configuration Created")
    @ApiResponse(responseCode = "404", description = "Validation error",
    content = {@Content(mediaType = APPLICATION_JSON_VALUE,
        schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
        content = {@Content(mediaType = APPLICATION_JSON_VALUE,
            schema = @Schema(implementation = ErrorListDto.class))})
    ResponseEntity<Object>  createConfiguration(
            @Parameter(name = "ConfigurationRequestDto", description = "Configuration request",
                    required = true) ChannelPropertyDto configurationRequest) throws Exception;


    @Operation(summary = "Retrieve All Configurations", description = "End point to get configurations")
    @ApiResponse(responseCode = "200", description = "Configurations Retrieved")
    @ApiResponse(responseCode = "404", description = "Configurations Not Found",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    ResponseEntity<Object> fetchAllConfigurations (int pageNumber, int pageSize, String sort, String group);


    @Operation(summary = "Retrieve Configuration", description = "End point to get configuration")
    @ApiResponse(responseCode = "200", description = "Configuration Retrieved")
    @ApiResponse(responseCode = "400", description = "Validation error",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "404", description = "Configuration Not Found",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    ResponseEntity<Object> getConfigurationById(Long configurationId);


    @Operation(summary = "Delete Configuration", description = "End point to delete configuration")
    @ApiResponse(responseCode = "200", description = "Configuration deleted")
    @ApiResponse(responseCode = "400", description = "Validation error",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "404", description = "Configuration Not Found",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    ResponseEntity<Object> removeConfigurations(Long configurationId);
    
    @Operation(summary = "Update Configuration", description = "End point to update configuration")
    @ApiResponse(responseCode = "200", description = "Configuration Updated")
    @ApiResponse(responseCode = "400", description = "Validation error",
        content = {@Content(mediaType = APPLICATION_JSON_VALUE,
            schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "404", description = "Configuration not found",
        content = {
            @Content(mediaType = APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
        content = {@Content(mediaType = APPLICATION_JSON_VALUE,
            schema = @Schema(implementation = ErrorListDto.class))})
    ResponseEntity<Object> updateConfiguration(
            @Parameter(description = "Config id for which updation is required",
                    required = true) Long configurationId,
            @Parameter(name = "ChannelPropertyDto", description = "Configuration request",
                    required = true) UpdatePropertyValuesDto configurationRequest);
    
    @Operation(summary = "Retrieve All Configuration Groups", description = "End point to get configuration groups")
    @ApiResponse(responseCode = "200", description = "Configuration Groups Retrieved")
    @ApiResponse(responseCode = "404", description = "Configuration Not Found",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    ResponseEntity<Object> getAllConfigurationGroups();
    
    @Operation(summary = "Update Configuration By Property Key", description = "End point to update configuration by Property Key")
    @ApiResponse(responseCode = "200", description = "Configuration Updated")
    @ApiResponse(responseCode = "400", description = "Validation error",
        content = {@Content(mediaType = APPLICATION_JSON_VALUE,
            schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "404", description = "Configuration not found",
        content = {
            @Content(mediaType = APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
        content = {@Content(mediaType = APPLICATION_JSON_VALUE,
            schema = @Schema(implementation = ErrorListDto.class))})
    ResponseEntity<Object> updateConfigurationByPropKey(
            @Parameter(description = "property Key for which updation is required",
                    required = true) String propKey,
            @Parameter(name = "ChannelPropertyDto", description = "Configuration request",
                    required = true) UpdatePropertyValuesDto configurationRequest);

    @Operation(summary = "Retrieve All Configuration for a Single Group",
            description = "End point to get configuration by groupId")
    @ApiResponse(responseCode = "200", description = "Configurations Retrieved")
    @ApiResponse(responseCode = "404", description = "Configurations Not Found",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
            content = {@Content(mediaType = APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorListDto.class))})
    ResponseEntity<Object> getConfigurationGroup(String groupId);
}
