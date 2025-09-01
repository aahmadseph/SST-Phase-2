package com.sephora.services.sourcingoptions.config;

import com.sephora.services.common.dynamicconfig.config.DynamicConfigClassConfig;
import com.sephora.services.sourcingoptions.model.cosmos.dynamiccache.ConfigValue;
import com.sephora.services.sourcingoptions.service.impl.DynamicConfigWrapperServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class DynamicAppConfiguration {

    @Bean
    public DynamicConfigClassConfig dynamicConfigClassConfig(){
        Map<String, Class> classMap = new HashMap<>();
        classMap.put(DynamicConfigWrapperServiceImpl.carrierLevelType, CarrierLevelConfiguration.class);
        classMap.put(DynamicConfigWrapperServiceImpl.commitsRampupType, ConfigValue.class);
        classMap.put(DynamicConfigWrapperServiceImpl.SDD_OPT_RAMPUP, ConfigValue.class);
        classMap.put(DynamicConfigWrapperServiceImpl.availabilityCheckType, AvailabilityCheckConfiguration.class);
        classMap.put(DynamicConfigWrapperServiceImpl.SPLIT_EDD_ZIPCODES, String.class);
        return new DynamicConfigClassConfig(classMap);
    }
}
