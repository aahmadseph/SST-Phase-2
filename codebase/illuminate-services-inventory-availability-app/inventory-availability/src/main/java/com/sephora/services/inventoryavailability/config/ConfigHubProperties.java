package com.sephora.services.inventoryavailability.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "confighub")
public class ConfigHubProperties {
  Boolean isInvAvailabilityMockEnabled;
  Double invAvailabilityAssumedAtp;
  String invAvailabilityAssumedAtpStatus;
}