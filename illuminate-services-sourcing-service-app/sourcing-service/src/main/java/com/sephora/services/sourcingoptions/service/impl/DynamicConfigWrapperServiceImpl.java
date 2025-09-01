package com.sephora.services.sourcingoptions.service.impl;

import com.sephora.services.common.dynamicconfig.config.DynamicConfigConfiguration;
import com.sephora.services.common.dynamicconfig.repository.DynamicConfigRepository;
import com.sephora.services.common.dynamicconfig.service.DynamicConfigService;
import com.sephora.services.sourcingoptions.config.AvailabilityCheckConfiguration;
import com.sephora.services.sourcingoptions.config.CarrierLevelConfiguration;
import com.sephora.services.sourcingoptions.model.cosmos.dynamiccache.ConfigValue;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class DynamicConfigWrapperServiceImpl extends com.sephora.services.common.dynamicconfig.service.DynamicConfigServiceImpl{
    public static final String commitsRampupType = "commitsRampup";
    public static final String carrierLevelType = "carrierLevelShipNodeDelay";
    public static final String availabilityCheckType = "availabilityCheck";
    public static final String SDD_OPT_RAMPUP = "sddOptRampup";
    public static final String SPLIT_EDD_ZIPCODES = "splitEddZipCodes";

    //@Autowired
    //private DynamicConfigRepository repository;

    @Autowired
    private DynamicConfigService dynamicConfigService;
    @Autowired
    private DynamicConfigConfiguration dynamicConfigConfiguration;

    public ConfigValue getCommitsConfig(){
        com.sephora.services.common.dynamicconfig.model.DynamicConfigDto<ConfigValue> rawDynamicConfig = dynamicConfigService.get(dynamicConfigConfiguration.getAppName(), commitsRampupType);
        if(rawDynamicConfig != null && rawDynamicConfig.getConfigValue() != null && rawDynamicConfig.getConfigValue().size() > 0){
            return rawDynamicConfig.getConfigValue().get(0);
        }
        return null;
    }


    public CarrierLevelConfiguration getShipNodeDelayConfiguration(){
        com.sephora.services.common.dynamicconfig.model.DynamicConfigDto<CarrierLevelConfiguration> rawDynamicConfig = dynamicConfigService.get(dynamicConfigConfiguration.getAppName(), carrierLevelType);
        if(rawDynamicConfig != null && rawDynamicConfig.getConfigValue() != null && rawDynamicConfig.getConfigValue().size() > 0){
            return rawDynamicConfig.getConfigValue().get(0);
        }
        return null;
    }

    public AvailabilityCheckConfiguration getAvailabilityCheckConfiguration(){
        com.sephora.services.common.dynamicconfig.model.DynamicConfigDto<AvailabilityCheckConfiguration> availabilityCheckConfig
                = dynamicConfigService.get(dynamicConfigConfiguration.getAppName(), availabilityCheckType);
        if(availabilityCheckConfig != null && availabilityCheckConfig.getConfigValue() != null && availabilityCheckConfig.getConfigValue().size() > 0){
            return availabilityCheckConfig.getConfigValue().get(0);
        }
        return null;
    }

}
