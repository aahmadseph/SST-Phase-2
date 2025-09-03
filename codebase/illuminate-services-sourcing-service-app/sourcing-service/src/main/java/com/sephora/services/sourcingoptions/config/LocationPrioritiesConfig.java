package com.sephora.services.sourcingoptions.config;

import com.sephora.services.sourcingoptions.model.PriorityConfig;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "location-priorities")
@Data
public class LocationPrioritiesConfig {

    private Boolean isLocationsByPriorities;
    private String azureTableName;
    private List<PriorityConfig> priorityConfig;
}
