package com.sephora.services.confighub.service.impl;

import static com.sephora.services.confighub.config.MigrationAsyncConfig.THREAD_POOL;
import static com.sephora.services.confighub.utils.Constants.CH_LIST;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.rocksdb.MutableOptionKey.ValueType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.sephora.services.confighub.config.MigrationConfig;
import com.sephora.services.confighub.dto.ChannelValuesDto;
import com.sephora.services.confighub.dto.ValueTypeEnum;
import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.entity.Configuration.ConfigurationBuilder;
import com.sephora.services.confighub.entity.MigratedConfiguration;
import com.sephora.services.confighub.entity.MigratedConfiguration.MigratedConfigurationBuilder;
import com.sephora.services.confighub.repository.ConfigurationRepository;
import com.sephora.services.confighub.repository.MigratedConfigurationRepository;
import com.sephora.services.confighub.service.ATGConfigUtilService;
import com.sephora.services.confighub.service.MigrateConfigService;
import com.sephora.services.confighub.utils.ConfigurationUtils;
import com.sephora.services.confighub.utils.Constants;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class MigrateConfigServiceImpl implements MigrateConfigService{
	
	@Autowired
	@Qualifier(THREAD_POOL)
	private AsyncTaskExecutor threadPoolTaskExecutor;
	
	@Autowired private ATGConfigUtilService atgConfigUtilService;
	
	@Autowired private MigratedConfigurationRepository configurationRepository;
	
	@Autowired private MigrationConfig migrationConfig;

	@Override
	public Map<String, Object> migrateConfig(String ch, String siteLocale, String siteLanguage, boolean updateRepository) {
		
		//Get existing config hub config from Database
		Map<String, Object> configHubMap = getConfigHubMap();
		
		//Get properties from ATG with respect to channel. 
		Map<String, Object> atgConfigResponse = atgConfigUtilService.getATGUtils(ch, siteLocale, siteLanguage);
		if(!CollectionUtils.isEmpty(atgConfigResponse)) {
		   Map<String, Object> atgConfigs = convertToConfigMap(atgConfigResponse);
		   
		   // Find the delta config (ATG Configs which are not present in ConfigHub)
		   Map<String, Object> configMapDelta = new HashMap<String, Object>();
		   for(Map.Entry<String, Object> config : atgConfigs.entrySet()) {
				String valueType = getConfigValueType(config);
				// If ATG Config is already present in ConfigHub repository and it is a JSON string.
				// then check whether the given channel present in ConfigHub, 
				// if not update configHub repository with missing channel config from ATG
				if(configHubMap.containsKey(config.getKey())) {
					if( ((Object[]) configHubMap.get(config.getKey()))[1] instanceof ChannelValuesDto) {
						ChannelValuesDto channelValue = (ChannelValuesDto)((Object[]) configHubMap.get(config.getKey()))[1];
						if(null == retrieveChannelValue(channelValue, ch)) {
							setChannelValue(channelValue, getConfigValue(config.getValue()), ch);
							configMapDelta.put(config.getKey(), new Object[] {channelValue, valueType});
						}
					}
				} else {
					ChannelValuesDto channelValuesDto;
					// If the atg config is not present in configHub repo then add to config delta map.
					channelValuesDto = ChannelValuesDto.builder().build();
					setChannelValue(channelValuesDto, getConfigValue(config.getValue()), ch);
					configMapDelta.put(config.getKey(),new Object[] {channelValuesDto, valueType});
				}
			}
			//Insert/update the delta config in Config hub repository
		   	if(updateRepository) {
				log.info("Inserting/Updating delta config in ConfigHub with: {} properties", configMapDelta.size());
				updateConfigHub(configMapDelta, configHubMap);
				log.info("Compeleted Config Migration from ATG to configHub");
			}
		   	return configMapDelta;
		} else {
			return null;
		}
	}
	
	private String getConfigValueType(Map.Entry<String, Object> config) {
		if(config.getValue() instanceof Boolean) {
			return ValueTypeEnum.BOOLEAN.getType();
		} else if(config.getValue() instanceof Integer) {
			return ValueTypeEnum.INTEGER.getType();
		} else if(config.getValue() instanceof Double) {
			return ValueTypeEnum.DOUBLE.getType();
		} else if(config.getValue() instanceof String){
			return ValueTypeEnum.STRING.getType();
		} else {
			return null;
		}
	}
	
	private void updateConfigHub(Map<String, Object> configMapDelta, Map<String, Object> configHubMap) {
		for(Map.Entry<String, Object> config : configMapDelta.entrySet()) {
			try {
				Object value = ((Object[])config.getValue())[0];
				String valueType = (String)((Object[])config.getValue())[1];
				MigratedConfigurationBuilder configEnityBuilder = MigratedConfiguration.builder();
				if(configHubMap.containsKey(config.getKey())) {
					configEnityBuilder.configId((Long)((Object[]) configHubMap.get(config.getKey()))[0]);
				}
				
				MigratedConfiguration configEnity = configEnityBuilder
					.prop(Constants.CONFIGHUB_PREFIX+config.getKey())
					.val(getConfigValue(value))
					.valType(valueType)
					.uiConsume(migrationConfig.getUiConsume())
					.description(migrationConfig.getDescription())
					.userId(migrationConfig.getUserId())
					.groupId(migrationConfig.getGroupId())
					.build();
				
				configurationRepository.save(configEnity);
				log.info("ConfigHub successfully update with key: {}, value:{}", configEnity.getProp(), configEnity.getVal());
			} catch(Exception ex) {
				log.error("An exception occured while saving configHub: {}", ex.getMessage(), ex);
			}
		}
	}
	
	private void setChannelValue(ChannelValuesDto channelValue, String value, String channel) {
		switch (channel.toLowerCase()) {
		      case Constants.IPHONE_APP:
		        channelValue.setIphoneApp(value);
		        break;
		      case Constants.ANDROID_APP:
		    	channelValue.setAndroidApp(value);
		        break;
		      case Constants.WEB:
		    	channelValue.setWeb(value);
		        break;
		      case Constants.RWD:
		    	channelValue.setRwd(value);
		        break;
		      case Constants.MOBILE_WEB:
		    	channelValue.setMobileWeb(value);
		        break;
		      case Constants.BASE:
		    	channelValue.setBase(value); 
		    	break;
		    }
	}
	
	/**
	   * Get the existing config hub config from Database and prepare map which having
	   * key: config property key
	   * value: An object array with two element, config_id as 0th element (used for update existing config later) and property value as 1st element.
	   * @param channelValues
	   * @param channel
	   * @return
	   */
	  private String retrieveChannelValue(ChannelValuesDto channelValues, String channel) {
	    String channelValue;
	    switch (channel.toLowerCase()) {
	      case Constants.IPHONE_APP:
	        channelValue =
	            StringUtils.isNotBlank(channelValues.getIphoneApp())
	                ? channelValues.getIphoneApp()
	                : null;
	        break;
	      case Constants.ANDROID_APP:
	        channelValue =
	            StringUtils.isNotBlank(channelValues.getAndroidApp())
	                ? channelValues.getAndroidApp()
	                : null;
	        break;
	      case Constants.WEB:
	        channelValue =
	            StringUtils.isNotBlank(channelValues.getWeb()) ? channelValues.getWeb() : null;
	        break;
	      case Constants.RWD:
	        channelValue =
	            StringUtils.isNotBlank(channelValues.getRwd()) ? channelValues.getRwd() : null;
	        break;
	      case Constants.MOBILE_WEB:
	        channelValue =
	            StringUtils.isNotBlank(channelValues.getMobileWeb())
	                ? channelValues.getMobileWeb()
	                : null;
	        break;
	      case Constants.BASE:
	      default:
	        channelValue =
	            StringUtils.isNotBlank(channelValues.getBase()) ? channelValues.getBase() : null;
	        break;
	    }
	    return channelValue;
	  }
	
	private Map<String, Object> getConfigHubMap() {
		 List<MigratedConfiguration> configurations =
		          configurationRepository.findMigratedExposedConfigurations(Constants.UICONSUME);
		 Map<String, Object> configHubMap = new HashMap<>();
		 for(MigratedConfiguration configuration : configurations) {
			 if (ConfigurationUtils.determineJsonType(configuration.getVal())) {
				 configHubMap.put(ConfigurationUtils.removePrefix(
                    configuration.getProp(), Constants.CONFIGHUB_PREFIX), 
						 new Object[]{configuration.getConfigId(), ConfigurationUtils.convertJsonToChannelValuesDTO(configuration.getVal())});
			 } else {
				 configHubMap.put(ConfigurationUtils.removePrefix(
		                    configuration.getProp(), Constants.CONFIGHUB_PREFIX), 
						 new Object[] {configuration.getConfigId(), configuration.getVal()});
			 }
		 }
		 return configHubMap;
	}
	
	private Map<String, Object> convertToConfigMap(Map<String, Object> atgResponsMap) {
		  Map<String, Object> configs = new HashMap<String, Object>();
		  for(Entry<String, Object> entry : atgResponsMap.entrySet()) {
			  String outeKey = entry.getKey();
			  if(entry.getValue() instanceof Map) {
				  for(Entry<String, Object> innerMapEntry : ((Map<String, Object>)entry.getValue()).entrySet()) {
					  configs.put(outeKey.concat(".").concat(innerMapEntry.getKey()), innerMapEntry.getValue());
				  }  
			  } else {
				  configs.put(outeKey, entry.getValue());
			  }
		  }
		  log.debug("Successfully fetched config from ATG with: {} configs", configs.size());
		  return configs;
	}
	private String getConfigValue(Object value) {
		  if(value instanceof List) {
				return "[" + String.join(",", (List<String>) value) + "]";
		  } else if(value instanceof ChannelValuesDto) { 
			    return ConfigurationUtils.toJson((ChannelValuesDto)value);
		  } else {
				return value.toString();
		  }
	  }
}
