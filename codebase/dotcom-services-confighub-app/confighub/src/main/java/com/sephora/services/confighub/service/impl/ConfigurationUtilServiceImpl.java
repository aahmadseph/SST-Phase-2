package com.sephora.services.confighub.service.impl;

import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import com.sephora.services.confighub.config.ATGUtilClientConfig;
import com.sephora.services.confighub.dto.ChannelValuesDto;
import com.sephora.services.confighub.dto.ValueTypeEnum;
import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.entity.MigratedConfiguration;
import com.sephora.services.confighub.exception.ConfigurationServiceException;
import com.sephora.services.confighub.repository.ConfigurationRepository;
import com.sephora.services.confighub.repository.MigratedConfigurationRepository;
import com.sephora.services.confighub.service.ATGConfigUtilService;
import com.sephora.services.confighub.service.ConfigurationUtilService;
import com.sephora.services.confighub.utils.ConfigurationUtils;
import com.sephora.services.confighub.utils.Constants;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.StopWatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ConfigurationUtilServiceImpl implements ConfigurationUtilService {

  @Autowired private ConfigurationRepository configurationRepository;
  
  @Autowired private MigratedConfigurationRepository migratedconfigurationRepository;

  @Autowired private ATGConfigUtilService atgConfigUtilService;
  
  @Autowired private ATGUtilClientConfig atgUtilClientConfig;

    @Override
    public Map<String, Object> fetchExposedConfigs(
            String channel, String siteLocale, String siteLanguage) throws ConfigurationServiceException{
        return fetchExposedConfigs(channel, siteLocale, siteLanguage,
                atgUtilClientConfig.isAtgEnabled(), atgUtilClientConfig.isMigratedConfigEnabled());
    }
  /**
   * Retrieve all configurations filtered on channel
   *
   * @param channel
   * @return A map of channel name and values
   * @throws ConfigurationServiceException
   */
  @Override
  public Map<String, Object> fetchExposedConfigs(
      String channel, String siteLocale, String siteLanguage, boolean atgEnabled, boolean migratedConfigEnabled) 
    		  throws ConfigurationServiceException {
    try {
      // Retrieve all exposed configurations
      List<Configuration> configurations =
          configurationRepository.findExposedConfigurations(Constants.UICONSUME);

      Map<String, Object> configMap = new HashMap<>();
      for (Configuration configuration : configurations) {
        String value = extractValue(configuration, channel);
        
        if (value != null && !value.isEmpty()) {
          if(StringUtils.isNoneEmpty(configuration.getValType())) {
              if(ValueTypeEnum.BOOLEAN.getType().equals(configuration.getValType())) {
            	  configMap.put(
      	                ConfigurationUtils.removePrefix(
      	                    configuration.getProp(), Constants.CONFIGHUB_PREFIX),
      	                Boolean.parseBoolean(value));
              } else if(ValueTypeEnum.INTEGER.getType().equals(configuration.getValType())) {
            	  configMap.put(
        	                ConfigurationUtils.removePrefix(
        	                    configuration.getProp(), Constants.CONFIGHUB_PREFIX),
        	                Integer.parseInt(value));
              }else if(ValueTypeEnum.DOUBLE.getType().equals(configuration.getValType())){
            	  configMap.put(
        	                ConfigurationUtils.removePrefix(
        	                    configuration.getProp(), Constants.CONFIGHUB_PREFIX),
        	                Double.parseDouble(value));
              } else {
            	  configMap.put(
      	                ConfigurationUtils.removePrefix(
      	                    configuration.getProp(), Constants.CONFIGHUB_PREFIX),
      	                value);
              }
          } else {	
	          if ("true".equalsIgnoreCase(value) || "false".equalsIgnoreCase(value)) {
	            // If the value is configured as either true or false
	            configMap.put(
	                ConfigurationUtils.removePrefix(
	                    configuration.getProp(), Constants.CONFIGHUB_PREFIX),
	                Boolean.parseBoolean(value));
	          } else if (value.startsWith("[") && value.endsWith("]")) {
	            // If the value is configured as a comma separated String surrounded by square brackets
                  List<String> valueToBeAdded = Lists.newArrayList(Splitter.on(",").split(value
                          .substring(1, value.length() - 1)));
                  valueToBeAdded.removeIf(StringUtils::isBlank);
                  configMap.put(
	                ConfigurationUtils.removePrefix(
	                    configuration.getProp(), Constants.CONFIGHUB_PREFIX), valueToBeAdded);
	          }else {
	            configMap.put(
	                ConfigurationUtils.removePrefix(
	                    configuration.getProp(), Constants.CONFIGHUB_PREFIX),
	                value);
	          }
          }
        }
      }
      Map<String, Object> atgResponsMap = null;
      
      if(atgEnabled) {
    	  atgResponsMap = atgConfigUtilService.getATGUtils(channel, siteLocale, siteLanguage);
      }
      
      if(migratedConfigEnabled) {
          StopWatch time = StopWatch.createStarted();
    	  Map<String, Object> migratedConfigMap = getMigratedConfigMap(channel);
          log.debug("Time taken in getting migrated configs {}", time.getTime(TimeUnit.MILLISECONDS));
    	  atgResponsMap = buildResponse(migratedConfigMap, atgResponsMap);
      }

      // Check if ATG configurations could not be found
      if (atgUtilClientConfig.isATGdependent() && null != atgResponsMap && atgResponsMap.isEmpty()) {
        log.error("ATG configurations could not be found");
        throw new ConfigurationServiceException("ATG configurations could not be found");
      }

      // Generate the response
      return buildResponse(configMap, atgResponsMap);

    } catch (Exception e) {
      log.error("Unexpected error occurred. Configurations could not be found ", e.getMessage());
      throw new ConfigurationServiceException(e.getMessage());
    }
  }

  /**
   * @param configuration
   * @param channel
   * @return
   */
  private String extractValue(Configuration configuration, String channel) {
    if (ConfigurationUtils.determineJsonType(configuration.getVal())) {
      ChannelValuesDto channelValuesDto =
          ConfigurationUtils.convertJsonToChannelValuesDTO(configuration.getVal());
      return retrieveChannelValue(channelValuesDto, channel);
    } else {
      return configuration.getVal();
    }
  }

  /**
   * @param channelValues
   * @param channel
   * @return
   */
  public String retrieveChannelValue(ChannelValuesDto channelValues, String channel) {
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

    if (channelValue == null && StringUtils.isNotBlank(channelValues.getBase())) {
      channelValue = channelValues.getBase();
    }
    return channelValue;
  }

  /**
   * Builds response with values from database and ATG, giving precedence to database values
   *
   * @param configMap
   * @return
   */
  private Map<String, Object> buildResponse(
      Map<String, Object> configMap, Map<String, Object> atgResponsMap) {
    Map<String, Object> response = new HashMap<>();

    if (null != atgResponsMap && !atgResponsMap.isEmpty()) {
      response = new HashMap<>(atgResponsMap);
    }

    // Iterate over the input map entries
    for (Map.Entry<String, Object> entry : configMap.entrySet()) {
      String key = entry.getKey();
      Object value = entry.getValue();

      // Split the key by dot (.) to get the levels
      String[] levels = key.split("\\.");

      // Skip if the key is empty or doesn't have at least one level
      if (levels.length < 1) {
        continue;
      }

      // Get or create the outer map in the response
      Map<String, Object> outerMap = response;

      for (int i = 0; i < levels.length - 1; i++) {
        String level = levels[i];
        Object innerValue = outerMap.get(level);

        if (innerValue instanceof Map) {
          outerMap = (Map<String, Object>) innerValue;
        } else {
          Map<String, Object> newMap = new HashMap<>();
          outerMap.put(level, newMap);
          outerMap = newMap;
        }
      }

      String innerKey = levels[levels.length - 1];
      outerMap.put(innerKey, value);
    }

    return response;
  }
  
	private Map<String, Object> getMigratedConfigMap(String channel) {
		List<MigratedConfiguration> configurations = migratedconfigurationRepository
				.findMigratedExposedConfigurations(Constants.UICONSUME);

		Map<String, Object> configMap = new HashMap<>();
		for (MigratedConfiguration configuration : configurations) {
			String value = extractValue(configuration, channel);
			if (value != null && !value.isEmpty()) {
				if (StringUtils.isNoneEmpty(configuration.getValType())) {
					if (ValueTypeEnum.BOOLEAN.getType()
							.equals(configuration.getValType())) {
						configMap.put(
								ConfigurationUtils.removePrefix(
										configuration.getProp(),
										Constants.CONFIGHUB_PREFIX),
								Boolean.parseBoolean(value));
					} else if (ValueTypeEnum.INTEGER.getType()
							.equals(configuration.getValType())) {
						configMap.put(
								ConfigurationUtils.removePrefix(
										configuration.getProp(),
										Constants.CONFIGHUB_PREFIX),
								Integer.parseInt(value));
					} else if (ValueTypeEnum.DOUBLE.getType()
							.equals(configuration.getValType())) {
						configMap.put(
								ConfigurationUtils.removePrefix(
										configuration.getProp(),
										Constants.CONFIGHUB_PREFIX),
								Double.parseDouble(value));
					} else {
						configMap.put(ConfigurationUtils.removePrefix(
								configuration.getProp(),
								Constants.CONFIGHUB_PREFIX), value);
					}
				} else {
					if ("true".equalsIgnoreCase(value)
							|| "false".equalsIgnoreCase(value)) {
						// If the value is configured as either true or false
						configMap.put(
								ConfigurationUtils.removePrefix(
										configuration.getProp(),
										Constants.CONFIGHUB_PREFIX),
								Boolean.parseBoolean(value));
					} else if (value.startsWith("[") && value.endsWith("]")) {
						// If the value is configured as a comma separated
						// String surrounded by square brackets
                        List<String> valueToBeAdded = Lists.newArrayList(Splitter.on(",").split(value
                                .substring(1, value.length() - 1)));
                        valueToBeAdded.removeIf(StringUtils::isBlank);
						configMap.put(
								ConfigurationUtils.removePrefix(
										configuration.getProp(),
										Constants.CONFIGHUB_PREFIX), valueToBeAdded);
					} else {
						configMap.put(ConfigurationUtils.removePrefix(
								configuration.getProp(),
								Constants.CONFIGHUB_PREFIX), value);
					}
				}
			}
		}
		return configMap;
	}
	private String extractValue(MigratedConfiguration configuration, String channel) {
	    if (ConfigurationUtils.determineJsonType(configuration.getVal())) {
	      ChannelValuesDto channelValuesDto =
	          ConfigurationUtils.convertJsonToChannelValuesDTO(configuration.getVal());
	      return retrieveChannelValue(channelValuesDto, channel);
	    } else {
	      return configuration.getVal();
	    }
	  }
}
