package com.sephora.services.confighub.controller;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.springframework.http.ResponseEntity;

import com.sephora.services.confighub.validation.dto.ErrorListDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Configuration Util API", description = "API related to configuration utils")
public interface ConfighubUtilController {

  @Operation(
      summary = "Retrieve channels",
      description = "End point to get configurations by channel")
  @ApiResponse(responseCode = "200", description = "Channels Retrieved")
  @ApiResponse(
      responseCode = "404",
      description = "Channels Not Found",
      content = {
        @Content(
            mediaType = APPLICATION_JSON_VALUE,
            schema = @Schema(implementation = ErrorListDto.class))
      })
  @ApiResponse(
      responseCode = "500",
      description = "Internal Server Error",
      content = {
        @Content(
            mediaType = APPLICATION_JSON_VALUE,
            schema = @Schema(implementation = ErrorListDto.class))
      })
  ResponseEntity<Object> fetchExposedConfigs(
      String channel, String siteLocale, String siteLanguage);
}
