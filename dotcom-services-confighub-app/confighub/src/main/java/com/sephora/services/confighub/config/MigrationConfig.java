package com.sephora.services.confighub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@Data
public class MigrationConfig {
	@Value("${configserver.migration.defaultValues.uiConsume:1}")
	private String uiConsume;
	@Value("${configserver.migration.defaultValues.description: desc}")
	private String description;
	@Value("${configserver.migration.defaultValues.userId:ATG_CONFIG_MIGRATION}")
	private String userId;
	@Value("${configserver.migration.defaultValues.groupId:1}")
	private String groupId;
}
