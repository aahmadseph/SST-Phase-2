package com.sephora.services.confighub.controller;

import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Configuration Migration API", description = "API related to migration configuration")
public interface ConfigMigrationController {
	@Operation(
		      summary = "Migrate configuration",
		      description = "End point to migrate from ATG to ConfigHub")
	@ApiResponse(responseCode = "200", description = "Migrated ATG configs to ConfigHub")
	public ResponseEntity<Object> migrate(String ch, String siteLocale, String siteLanguage, boolean updateRepository);
}
