package com.sephora.services.confighub.service;

import java.util.Map;

public interface ATGConfigUtilService {

  Map<String, Object> getATGUtils(String channel, String siteLocale, String siteLanguage);
}
