package com.sephora.services.confighub.service;

import java.util.Map;

public interface MigrateConfigService {
	public Map<String, Object> migrateConfig(String channel , String siteLocale, String siteLanguage, boolean updateRepository);
}
