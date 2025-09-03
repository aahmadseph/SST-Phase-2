package com.sephora.services.sourcingoptions.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "confighub")
public class ConfigHubProperties {
  Boolean isSourcingServiceMockEnabled;
}
