package com.sephora.services.inventoryavailability.config;

import com.sephora.services.inventory.config.GetAvailabilityForSitePagesConfig;
import com.sephora.services.inventory.config.PriorityConfig;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.scope.refresh.RefreshScopeRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.*;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

import static com.sephora.services.inventoryavailability.AvailabilityConstants.*;

@Component
@Log4j2
public class ConfigHubPropertyBridge {

    @Autowired
    Environment environment;

    @Autowired
    ConfigurableEnvironment configurableEnvironment;

    @Autowired
    private ConfigHubProperties configHubProperties;

    @Autowired
    private GetAvailabilityForSitePagesConfig getAvailabilityForSitePagesConfig;

    private List<PriorityConfig> defaultPriorityConfigList = new ArrayList<>();
    private Double defaultAssumedAtp;
    private String defaultAssumedAtpStatus;
    private Boolean defaultIsMockedAvailability;

    @PostConstruct
    public void overrideSystemProperties() {
        defaultPriorityConfigList = copyPriorityConfig(getAvailabilityForSitePagesConfig.getPriorityConfig());
        defaultAssumedAtp = environment.getProperty(ASSUMED_ATP_CONFIG_PATH, Double.class, 0.0);
        defaultAssumedAtpStatus = environment.getProperty(ASSUMED_ATP_STATUS_CONFIG_PATH, String.class, "OOS");
        defaultIsMockedAvailability = environment.getProperty(IS_MOCKED_AVAILABILITY_CONFIG_PATH, Boolean.class, false);
        applyMockOrDefaultConfig(configHubProperties.getIsInvAvailabilityMockEnabled());
    }

    private List<PriorityConfig> copyPriorityConfig(List<PriorityConfig> originalList) {
        if (null == originalList) return new ArrayList<>();
        return originalList.stream()
                .filter(Objects::nonNull)
                .map(this::clonePriorityConfig)
                .collect(Collectors.toList());
    }

    private PriorityConfig clonePriorityConfig(PriorityConfig original) {
        PriorityConfig clone = new PriorityConfig();
        clone.setFulfillmentType(original.getFulfillmentType());
        clone.setPriorityOrder(original.getPriorityOrder());
        clone.setRequestOrigin(original.getRequestOrigin());
        clone.setAssumedATP(original.getAssumedATP());
        clone.setAssumedATPStatus(original.getAssumedATPStatus());
        return clone;
    }

    @EventListener(RefreshScopeRefreshedEvent.class)
    public void handleConfigRefresh() {
        applyMockOrDefaultConfig(configHubProperties.getIsInvAvailabilityMockEnabled());
    }

    private List<PriorityConfig> updatePriorityConfigList() {
        List<PriorityConfig> priorityConfigList = new ArrayList<>();
        if (null != getAvailabilityForSitePagesConfig.getPriorityConfig()) {
            priorityConfigList = getAvailabilityForSitePagesConfig.getPriorityConfig().stream()
                    .filter(Objects::nonNull)
                    .map(priorityConfig -> {
                        priorityConfig.setPriorityOrder(List.of(CACHE));
                        priorityConfig.setAssumedATP(configHubProperties.getInvAvailabilityAssumedAtp());
                        priorityConfig.setAssumedATPStatus(configHubProperties.getInvAvailabilityAssumedAtpStatus());
                        return priorityConfig;
                    }).collect(Collectors.toList());
        }
        return priorityConfigList;
    }

    private void applyMockOrDefaultConfig(Boolean mockEnabled) {
        if (Boolean.TRUE.equals(mockEnabled)) {
            log.info("Applying mock configuration from confighub with assumed atp: {} and status: {}.", configHubProperties.getInvAvailabilityAssumedAtp(), configHubProperties.getInvAvailabilityAssumedAtpStatus());
            setConfigProperty(ASSUMED_ATP_CONFIG_PATH, String.valueOf(configHubProperties.getInvAvailabilityAssumedAtp()));
            setConfigProperty(ASSUMED_ATP_STATUS_CONFIG_PATH, configHubProperties.getInvAvailabilityAssumedAtpStatus());
            setConfigProperty(IS_MOCKED_AVAILABILITY_CONFIG_PATH, String.valueOf(mockEnabled));
            getAvailabilityForSitePagesConfig.setPriorityConfig(updatePriorityConfigList());
        } else {
            log.info("Applying configuration from application.yaml since the confighub mock enabled flag is not true.");
            setConfigProperty(ASSUMED_ATP_CONFIG_PATH, String.valueOf(defaultAssumedAtp));
            setConfigProperty(ASSUMED_ATP_STATUS_CONFIG_PATH, defaultAssumedAtpStatus);
            setConfigProperty(IS_MOCKED_AVAILABILITY_CONFIG_PATH, String.valueOf(defaultIsMockedAvailability));
            getAvailabilityForSitePagesConfig.setPriorityConfig(defaultPriorityConfigList);
        }
    }

    private void setConfigProperty(String key, String value) {
        MutablePropertySources sources = configurableEnvironment.getPropertySources();
        PropertySource<?> existingBridgeSource = sources.get(CONFIGHUB_BRIDGE_PROPERTY_SOURCE);
        Map<String, Object> overrideMap;
        if (null != existingBridgeSource) {
            overrideMap = ((MapPropertySource) existingBridgeSource).getSource();
        } else {
            overrideMap = new HashMap<>();
            sources.addFirst(new MapPropertySource(CONFIGHUB_BRIDGE_PROPERTY_SOURCE, overrideMap));
        }
        overrideMap.put(key, value);
    }
}