package com.sephora.services.inventory.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;
/**
 * if inventory is not available in yantriks then update cache with configurable value
 */

@ConfigurationProperties(prefix = "inventory.site-page-availability.handle-availability-hub-miss")
@Data
public class AvailabilityHubMissConfiguration {
	   
      private Boolean enabled;
      private Double defaultAtp;
      private String defaultAtpStatus;
     //#send atp as 0 to ATG if cache have -ve atp due to yantriks availability miss
      private Boolean handleCacheNegetiveAtp; 
}
