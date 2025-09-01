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
@RequestMapping("/v1/util/configuration")
@ControllerDocumentation
@Validated
@Slf4j
public class ConfighubUtilControllerImpl implements ConfighubUtilController {

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
        response = utilService.fetchExposedConfigs(Constants.BASE, "us", "en");
      } else {
        response = utilService.fetchExposedConfigs(ch, siteLocale, siteLanguage);
      }
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (Exception ex) {
      log.info("e.getMessage : {}", ex.getMessage());
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @DeleteMapping("/all/clear")
  public ResponseEntity<String> clearAllCaches() {
    List<String> clearedCaches = new ArrayList<>();
    cacheManager
        .getCacheNames()
        .forEach(
            cacheName -> {
              CaffeineCache cache = (CaffeineCache) cacheManager.getCache(cacheName);
              if (cache != null) {
                cache.clear();
                clearedCaches.add(cacheName);
                System.out.println("Cleared cache: " + cacheName);
              }
            });
    if (!clearedCaches.isEmpty()) {
      return ResponseEntity.ok("All caches cleared successfully. Caches cleared: " + clearedCaches);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No caches found to clear");
    }
  }
}
