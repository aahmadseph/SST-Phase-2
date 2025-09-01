package com.sephora.services.confighub.controller.impl;

import com.github.benmanes.caffeine.cache.Cache;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sephora.services.confighub.controller.ConfighubUtilController;
import com.sephora.services.confighub.service.ConfigurationUtilService;
import com.sephora.services.confighub.utils.ConfigurationUtils;
import com.sephora.services.confighub.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v2/util/configuration")
@ControllerDocumentation
@Validated
@Slf4j
public class ConfighubUtilControllerImplV2 implements ConfighubUtilController {

  @Autowired private ConfigurationUtilService utilService;

  @Autowired private CacheManager cacheManager;
  

  /**
   * Retrieve configurations based on channel value
   *
   * @param ch
   * @return A List of configurations
   */
  @Override
  @GetMapping
  public ResponseEntity<Object> fetchExposedConfigs(
      @RequestParam(required = false) @Validated String ch,
      @CookieValue(value = "site_locale", defaultValue = "us") String siteLocale,
      @CookieValue(value = "site_language", defaultValue = "en") String siteLanguage) {
    log.info("Retrieve by channel {}", ch);

    boolean isValid = ConfigurationUtils.isValid(ch);
    Map<String, Object> response;
    try {
      if (!isValid) {
        log.info("Invalid channel sent : {}", ch);
        response = utilService.fetchExposedConfigs(Constants.BASE, "us", "en", true, true);
      } else {
        response = utilService.fetchExposedConfigs(ch, siteLocale, siteLanguage, true, true);
      }
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception ex) {
      log.info("e.getMessage : {}", ex.getMessage());
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
}
