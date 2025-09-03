package com.sephora.services.inventory.config;

import com.sephora.services.common.dynamicconfig.config.DynamicConfigClassConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
public class DynamicAppConfiguration {

    @Bean
    public DynamicConfigClassConfig dynamicConfigClassConfig(@Autowired GetAvailabilityForSitePagesConfig config){
        Map<String, Class> classMap = new HashMap<>();
        classMap.put(config.getConfigType(), LinkedHashMap.class);
        return new DynamicConfigClassConfig(classMap);
    }
}
