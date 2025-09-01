package com.sephora.services.confighub.service;

import com.sephora.services.confighub.exception.ConfigurationServiceException;

import java.util.Map;

public interface ConfigurationUtilService {

  Map<String, Object> fetchExposedConfigs(String channel, String siteLocale, String siteLanguage, boolean atgEnabled, boolean migratedConfigEnabled)
      throws ConfigurationServiceException;

  Map<String, Object> fetchExposedConfigs(
          String channel, String siteLocale, String siteLanguage) throws ConfigurationServiceException;

}
