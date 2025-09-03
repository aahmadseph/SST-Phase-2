package com.sephora.services.confighub.controller.impl;

import java.util.Arrays;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sephora.confighubclient.enums.ConfigHubChannelEnum;
import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.confighub.controller.ConfigMigrationController;
import com.sephora.services.confighub.service.MigrateConfigService;
import com.sephora.services.confighub.utils.ConfigurationUtils;
import com.sephora.services.confighub.utils.Constants;

import lombok.extern.slf4j.Slf4j;
@CrossOrigin
@RestController
@RequestMapping("/v1/configuration")
@ControllerDocumentation
@Validated
@Slf4j
public class ConfigMigrationControllerImpl implements ConfigMigrationController {
	@Autowired
	MigrateConfigService migrateConfigService;
	
	private static String[] channels = {"base", "web", "iPhoneApp", "androidApp", "mobileWeb", "rwd"};
	
	@Override
	@GetMapping("/migrate/config")
	public ResponseEntity<Object> migrate(
			@RequestParam(required = true) @Validated String ch,
			@RequestHeader(value = "site_locale", defaultValue = "us") String siteLocale,
			@RequestHeader(value = "site_language", defaultValue = "en") String siteLanguage,
			@RequestParam(value = "updateRepository", defaultValue = "false") boolean updateRepository) {
		boolean isValid = isValid(ch);
		if(isValid) {
			Map<String, Object> response = migrateConfigService.migrateConfig(ch, siteLocale, siteLanguage, updateRepository);
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.badRequest().body("Invalid channel: please use: base, web, iPhoneApp, androidApp, mobileWeb, rwd");
		}
		
	}
	
	public static boolean isValid(String input) {
		return Arrays.stream(channels)
				.anyMatch(channel -> input.equals(channel));
	}

}
