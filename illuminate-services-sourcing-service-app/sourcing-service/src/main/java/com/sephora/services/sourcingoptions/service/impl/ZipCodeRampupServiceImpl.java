package com.sephora.services.sourcingoptions.service.impl;

import com.sephora.services.common.dynamicconfig.config.DynamicConfigConfiguration;
import com.sephora.services.common.dynamicconfig.model.DynamicConfigDto;
import com.sephora.services.common.dynamicconfig.service.DynamicConfigService;
import com.sephora.services.sourcingoptions.config.SourcingOptionsConfiguration;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.dynamiccache.ConfigValue;
import com.sephora.services.sourcingoptions.model.cosmos.dynamiccache.ZipCodeRange;
import com.sephora.services.sourcingoptions.service.ZipCodeRampupService;

import lombok.extern.log4j.Log4j2;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Log4j2
public class ZipCodeRampupServiceImpl implements ZipCodeRampupService {

    @Autowired
    private DynamicConfigService dynamicConfigService;

    @Autowired
    private DynamicConfigConfiguration configuration;
    
    @Autowired
    private SourcingOptionsConfiguration sourcingOptionsConfiguration;

    @Override
    public Boolean isZipCodeEligibleForSourcingHubCall(String zipCode, String enterpriseCode) {
        DynamicConfigDto<ConfigValue> dynamicConfig = dynamicConfigService.get(configuration.getAppName(), DynamicConfigWrapperServiceImpl.commitsRampupType);
        if(dynamicConfig == null){
            return false;
        }
        if(CollectionUtils.isNotEmpty(dynamicConfig.getConfigValue())){
            Optional<ConfigValue> configValueOptional = dynamicConfig.getConfigValue().stream().filter(configValue -> configValue.getSellingChannel().equals(enterpriseCode)).findFirst();
            if(configValueOptional.isPresent()){
                if (enterpriseCode.equals(EnterpriseCodeEnum.SEPHORACA.toString())) {
                    zipCode = zipCode.substring(0, 3);
                }
                ConfigValue configValue = configValueOptional.get();
                for (ZipCodeRange zipCodeRange : configValue.getZipCodeRanges()) {
                    if (zipCode.compareTo(zipCodeRange.getFromZipCode()) >= 0
                            && zipCode.compareTo(zipCodeRange.getToZipCode()) <= 0) {
                        return true;
                    }
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
        return false;
    }

	@Override
	public Boolean isZipCodeEligibleForSDDOpt(String zipCode, String enterpriseCode) {
		if(sourcingOptionsConfiguration.isSddOptRampUpEnabled()) {
			DynamicConfigDto<ConfigValue> dynamicConfig = null;
			try {
				dynamicConfig = dynamicConfigService.get(configuration.getAppName(), DynamicConfigWrapperServiceImpl.SDD_OPT_RAMPUP);
			} catch(IllegalArgumentException ex) {
				log.error("An exception occured while getting dynamic config with appName: {}, configType: {}", 
						configuration.getAppName(),DynamicConfigWrapperServiceImpl.SDD_OPT_RAMPUP, ex);
			}
			
	        if(dynamicConfig == null){
	            return false;
	        }
	        if(CollectionUtils.isNotEmpty(dynamicConfig.getConfigValue())){
	            Optional<ConfigValue> configValueOptional = dynamicConfig.getConfigValue().stream()
	            		.filter(configValue -> configValue.getSellingChannel().equals(enterpriseCode)).findFirst();
	            if(configValueOptional.isPresent()){
	                if (enterpriseCode.equals(EnterpriseCodeEnum.SEPHORACA.toString())) {
	                    zipCode = zipCode.substring(0, 3);
	                }
	                ConfigValue configValue = configValueOptional.get();
	                for (ZipCodeRange zipCodeRange : configValue.getZipCodeRanges()) {
	                    if (zipCode.compareTo(zipCodeRange.getFromZipCode()) >= 0
	                            && zipCode.compareTo(zipCodeRange.getToZipCode()) <= 0) {
	                        return true;
	                    }
	                }
	            }else{
	                return false;
	            }
	        }
	        return false;
	        
		} else {
			return true;
		}
		
	}
}
