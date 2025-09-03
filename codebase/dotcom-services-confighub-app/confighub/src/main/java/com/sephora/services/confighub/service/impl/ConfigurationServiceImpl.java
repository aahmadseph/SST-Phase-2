package com.sephora.services.confighub.service.impl;


import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import com.sephora.services.confighub.utils.ConfigurationUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.sephora.platform.common.validation.exception.ValidationException;
import com.sephora.services.confighub.client.ConfighubServiceClient;
import com.sephora.services.confighub.dto.ChannelPropertyDto;
import com.sephora.services.confighub.dto.ChannelValuesDto;
import com.sephora.services.confighub.dto.PageDTO;
import com.sephora.services.confighub.dto.PropertyValuesDto;
import com.sephora.services.confighub.dto.PropertyValuesDtoResponse;
import com.sephora.services.confighub.dto.UpdatePropertyValuesDto;
import com.sephora.services.confighub.entity.AuditConfiguration;
import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.entity.ConfigurationGroup;
import com.sephora.services.confighub.exception.ConfigurationServiceException;
import com.sephora.services.confighub.exception.DataNotFoundException;
import com.sephora.services.confighub.mapper.ConfigurationMapper;
import com.sephora.services.confighub.mapper.PageToPageDTOMapper;
import com.sephora.services.confighub.repository.AuditConfigurationRepository;
import com.sephora.services.confighub.repository.ConfigurationGroupRepository;
import com.sephora.services.confighub.repository.ConfigurationRepository;
import com.sephora.services.confighub.service.ConfigurationService;
import com.sephora.services.confighub.utils.Constants;
import org.springframework.data.domain.Sort;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class ConfigurationServiceImpl implements ConfigurationService {	

    @Autowired
    private ConfigurationRepository configurationRepository;
    
    @Autowired
    private AuditConfigurationRepository auditConfigurationRepository;


    @Autowired
    private ConfigurationMapper configurationMapper;
    @Autowired
    private PageToPageDTOMapper pageToPageDTOMapper;


    @Autowired
    private ConfighubServiceClient confighubServiceClient;
    
    @Autowired
    private ConfigurationGroupRepository configurationGroupRepository;

    /**
     * Handles multiple configuration creation based on the number of configuration items in the request
     * Once the configuration persisted it calls actuator bus refresh self end-point to broadcast the changes to all consuming services
     */
	@Override
	@Transactional(value = Transactional.TxType.REQUIRES_NEW)
	public List<PropertyValuesDtoResponse> createConfiguration(ChannelPropertyDto configurationRequest) throws Exception {
		try {
			List<PropertyValuesDtoResponse> propertiesList = new ArrayList<>();
			propertiesList = configurationRequest.getProperties()
					.stream()
					.map(properties -> create(configurationRequest, properties))
					.collect(Collectors.toList());
			if (propertiesList.isEmpty()) {
				log.error("Couldn't create configuration");
				return propertiesList;
			}
			log.info("Successfully created configuration");

			log.info("Calling bus refresh to broadcast configuration creation event...");
			confighubServiceClient.busRefresh(); // Call bus refresh end-point which publishes the event in message topic

			return propertiesList;
		} catch (ValidationException e) {
			log.info("ValidationException occurred::" + e.getMessage() + "   " + e.getField());
			throw e;
		} catch (Exception e) {
			log.error("Unexpected error occurred. Configuration could not be saved", e);
			throw e;
		}
	}

	private PropertyValuesDtoResponse create(ChannelPropertyDto configurationRequest, PropertyValuesDto property) {
		PropertyValuesDtoResponse response = PropertyValuesDtoResponse.builder().build();

		validatePropKey(property.getPropKey(), Constants.CONFIGURATION_EXISTS);

		//is property exists
		Configuration configuration = null;
		if (property.getPropChannelValues() != null) {
			String json = convertChannelValuesToJson(property.getPropChannelValues());
			configuration = configurationMapper.toConfiguration(configurationRequest, property, json);
			log.info("Property Channel Values:", json);

		} else {
			log.info("property.getPropValue()::", property.getPropValue());
			configuration = configurationMapper.toConfiguration(configurationRequest, property, property.getPropValue());
		}
		configuration = configurationRepository.save(configuration);
		log.info("Configuration={} is created", configuration.getConfigId());
		response = mapToPropertyValuesDtoResponse(configuration);
		return response;
	}

	/**
	 * Retrieve all configurations sorted unless filtered on groupId if present
	 *
	 * @param pageNumber
	 * @param pageSize
	 * @param sort
	 * @param groupId
	 * @return A page list of configurations
	 * @throws ConfigurationServiceException
	 */
	@Override
	@Transactional(value = Transactional.TxType.NOT_SUPPORTED)
	public PageDTO<PropertyValuesDtoResponse> fetchConfigurations(int pageNumber, int pageSize,
																  String sort, String groupId)
			throws ConfigurationServiceException {
		try {
			Pageable paging = getPageable(pageNumber, pageSize, sort);
			Page<Configuration> pagedResult;
			if( StringUtils.isNotBlank(groupId) && !groupId.equalsIgnoreCase(Constants.SORT_MODE_ALL) ){
				pagedResult = configurationRepository.findByGroupIdPage(groupId, paging);
			} else {
				pagedResult = configurationRepository.findAll(paging);
			}
			Configuration lastModifiedConfiguration = configurationRepository.findLastModifiedConfigurations();
			List<PropertyValuesDtoResponse> configurationDTOs = pagedResult.getContent().stream()
					.map(configuration -> mapToPropertyValuesDtoResponse(configuration))
					.collect(Collectors.toList());

			return pageToPageDTOMapper.pageToPageDTO(pagedResult.getTotalElements(),
					pagedResult.getTotalPages(), lastModifiedConfiguration.getUserId(),
					lastModifiedConfiguration.getModifiedDate(), configurationDTOs);
		} catch (Exception e) {
			log.error("Unexpected error occurred. Configurations could not be found ", e.getMessage());
			throw new ConfigurationServiceException(e.getMessage());
		}
	}

	private Pageable getPageable(int page, int size, String sortProperty) {
		if (sortProperty.equalsIgnoreCase(Constants.RECENT)) {
			Sort.Order sortOrder = Sort.Order.desc(Constants.MODIFIED_DATE);
			Sort.Order sortById = Sort.Order.asc(Constants.PROP);
			Sort sortCriteria = Sort.by(sortOrder, sortById);
			return PageRequest.of(page, size,sortCriteria);
		} else {
			Sort.Direction direction = sortProperty.length() > 1 && sortProperty.equalsIgnoreCase(Constants.DESC)
					? Sort.Direction.DESC : Sort.Direction.ASC;
			return PageRequest.of(page, size, direction, Constants.PROP);
		}
	}

    private String convertChannelValuesToJson(ChannelValuesDto channelValues) {
    	Gson gson = new Gson();
    	String jsonStr = gson.toJson(channelValues);
    	return jsonStr;
    }

	/**
	 * Retrieve a single configuration by configurationId
	 *
	 * @param configurationId The ID of the configuration to retrieve
	 * @return The configuration with the specified ID
	 */
	@Override
	@Transactional(value = Transactional.TxType.NOT_SUPPORTED)
	public PropertyValuesDtoResponse fetchConfiguration(Long configurationId) throws ConfigurationServiceException {
		try {
			PropertyValuesDtoResponse response = PropertyValuesDtoResponse.builder().build();
			Configuration configuration = getConfiguration(configurationId);
			response = mapToPropertyValuesDtoResponse(configuration);
			return response;
		} catch (NoSuchElementException e) {
			log.error("Configuration with configurationId - {} could not be found. " +
					"Error message is {}", configurationId, e.getMessage());
			throw new DataNotFoundException(e);
		} catch (Exception e) {
			log.error("Unexpected error occurred. Configuration with configurationId - {} could not be found. " +
					"Error message is {}", configurationId, e.getMessage());
			throw new ConfigurationServiceException(e.getMessage());
		}
	}

    /**
     * Delete a configuration by configurationId
     * Once the configuration deleted, it calls actuator bus refresh self end-point to broadcast the changes to all consuming services
     *
     * @param configurationId The ID of the configuration to delete
     */
    @Override
    @Transactional
    public void deleteConfigurationById(Long configurationId) throws ConfigurationServiceException {
        try {
            configurationRepository.deleteById(configurationId);

            log.info("Calling bus refresh to broadcast configuration delete event...");
            confighubServiceClient.busRefresh(); // Call bus refresh end-point which publishes the event in message topic

        } catch (NoSuchElementException e) {
            log.error("Configuration not found. Configuration with configurationId - {} could not be deleted. " +
                    "Error message is {}", configurationId, e.getMessage());
            throw new DataNotFoundException(e);
        } catch (Exception e) {
            log.error("Unexpected error occurred. Configuration with configurationId - {} could not be deleted. " +
                    "Error message is {}", configurationId, e.getMessage());
            throw new ConfigurationServiceException(e.getMessage());
        }
    }
    
  
	/**
	 * Updates the configuration, if the configuration values have changed
	 * Once the configuration updated in db, it calls actuator bus refresh self end-point to broadcast the changes to all consuming services
	 */
	@Override
	public PropertyValuesDtoResponse updateConfiguration(Long configurationId,
			UpdatePropertyValuesDto updateConfigurationRequest) throws ConfigurationServiceException {
		PropertyValuesDtoResponse response = null;
		Configuration configuration = getConfiguration(configurationId);
		AuditConfiguration auditConfiguration = configurationMapper.toAuditConfiguration(configuration);
		try {
			if (!configuration.getProp().equalsIgnoreCase(updateConfigurationRequest.getPropKey())) {
				log.info("prop Key is different");
				validatePropKey(updateConfigurationRequest.getPropKey(),Constants.UPDATE_PROP_KEY_EXISTS);
			}

			if (updateConfigurationRequest.getPropChannelValues() != null) {
				ChannelValuesDto channelValues = updateConfigurationRequest.getPropChannelValues();
	    		String json = convertChannelValuesToJson(channelValues);
				configuration = configurationMapper.toUpdateConfiguration(updateConfigurationRequest, configuration.getConfigId(), json);	
			}  else {	    			
	    		configuration = configurationMapper.toUpdateConfiguration(updateConfigurationRequest, configuration.getConfigId(), updateConfigurationRequest.getPropValue());	    		
			} 
			configuration = configurationRepository.save(configuration);
    		response = mapToPropertyValuesDtoResponse(configuration);	
			auditConfigurationRepository.save(auditConfiguration);
	    	log.info("Calling bus refresh to broadcast configuration update event...");
	        confighubServiceClient.busRefresh(); // Call bus refresh end-point which publishes the event in message topic
		} catch (ValidationException e) {
			log.info("ValidationException occurred::" + e.getMessage() + "   " + e.getArgs());
			throw e;
		} catch (Exception e) {
	        log.error("Unexpected error occurred. Configuration could not be found ", e.getMessage());
		}
			
		return response;	
	}

	private void validatePropKey(String propKey, String errorKey) {
		int configurationSize = configurationRepository.findByPropKey(configurationMapper.toPropertyKey(propKey));
		if ( configurationSize != 0) {
			log.warn("Property Key={} already has already present. Skipping",
					propKey);
			throw new ValidationException(errorKey, propKey);
//			throw new ConfigurationServiceException("prop key cannot be updated to existing prop key.");
		}
	}

	/**
	 * Updates the configuration, if the configuration values have changed
	 * Once the configuration updated in db, it calls actuator bus refresh self end-point to broadcast the changes to all consuming services
	 */
	@Override
	public PropertyValuesDtoResponse updateConfigurationByPropKey(String propKey,
			UpdatePropertyValuesDto updateConfigurationRequest) throws ConfigurationServiceException {
		PropertyValuesDtoResponse response = null;
		Configuration configuration = fetchConfigurationByPropKey(propKey);
		if (!propKey.equalsIgnoreCase(updateConfigurationRequest.getPropKey())) {
			log.info("prop Key is different");
			validatePropKey(updateConfigurationRequest.getPropKey(),Constants.UPDATE_PROP_KEY_EXISTS);
		}

		log.info("configuration::" + configuration);
		AuditConfiguration auditConfiguration = configurationMapper.toAuditConfiguration(configuration);
		try {
			log.info("config Id::" + configuration.getConfigId());
			if (updateConfigurationRequest.getPropChannelValues() != null) {
				ChannelValuesDto channelValues = updateConfigurationRequest.getPropChannelValues();
	    		String json = convertChannelValuesToJson(channelValues);
				configuration = configurationMapper.toUpdateConfiguration(updateConfigurationRequest, configuration.getConfigId(), json);				
			} else {
				configuration = configurationMapper.toUpdateConfiguration(updateConfigurationRequest, configuration.getConfigId(), updateConfigurationRequest.getPropValue());        		
			}
			configuration = configurationRepository.save(configuration);
    		response = mapToPropertyValuesDtoResponse(configuration);	
			auditConfigurationRepository.save(auditConfiguration);
            log.info("Calling bus refresh to broadcast configuration update event...");
            confighubServiceClient.busRefresh(); // Call bus refresh end-point which publishes the event in message topic
		 } catch (Exception e) {
            log.error("Unexpected error occurred. Configuration could not be found ", e.getMessage());
		 }
		 log.info("response"+ response);					
		return response;	
	}

	 /**
     * Retrieve a single configuration by configurationId
     *
     * @param propKey The ID of the configuration to retrieve
     * @return The configuration with the specified ID
     */
    @Override
    @Transactional(value = Transactional.TxType.NOT_SUPPORTED)
    public Configuration fetchConfigurationByPropKey(String propKey) throws ConfigurationServiceException {
        try {

        	propKey = configurationMapper.toPropertyKey(propKey);
        	log.info("propKey {}",propKey);
        	Configuration configuration = configurationRepository.findConfigurationByPropKey(propKey);
        
	        	log.info("configuration {}", configuration);
	        	if (configuration != null) {        		
	        		log.info("Configuration found");
	                
	                return configuration;
	        	}
        	
            
        } catch (NoSuchElementException e) {
            log.error("Configuration with propKey - {} could not be found. " +
                    "Error message is {}", propKey, e.getMessage());
            throw new DataNotFoundException(e);
        } catch (Exception e) {
            log.error("Unexpected error occurred. Configuration with propKey - {} could not be found. " +
                    "Error message is {}", propKey, e.getMessage());
            throw new ConfigurationServiceException(e.getMessage());
        }
		return null;
    }

	/**
	 * Removes prefix from propKey
	 *
	 * @param configuration The configuration to be modified
	 * @param prefix        The prefix to remove
	 */
	private void editPropKey(Configuration configuration, String prefix) {
		configuration.setProp(ConfigurationUtils.removePrefix(configuration.getProp(), prefix));
	}

	/**
	 *
	 * @param configurationId
	 * @return
	 */
	private Configuration getConfiguration(Long configurationId) {
		Configuration configuration = configurationRepository.findById(configurationId).get();
		log.info("Configuration found", configuration.getConfigId());
		editPropKey(configuration, Constants.CONFIGHUB_PREFIX);
		return configuration;
	}


	/**
	 * Returns all the Configuration groups
	 */
	@Override
	public List<ConfigurationGroup> getConfigGroups() throws ConfigurationServiceException {
		try {
			
			List<ConfigurationGroup> configGroups = configurationGroupRepository.findAll();
			
			if(CollectionUtils.isEmpty(configGroups)) {
	            log.error("No config Groups found");
	            throw new DataNotFoundException("No config Groups found");
			}
			return configGroups;
			
		} catch (Exception e) {
            log.error("Unexpected error occurred, while fetching Config Groups ", e);
            throw new ConfigurationServiceException(e.getMessage());
        }

	}

	/**
	 * Converts configuration to propertyValuesDtoResponse
	 *
	 * @param configuration
	 * @return
	 */
	private PropertyValuesDtoResponse mapToPropertyValuesDtoResponse(Configuration configuration) {
		PropertyValuesDtoResponse response;
		if(ConfigurationUtils.determineJsonType(configuration.getVal())){
			ChannelValuesDto channelValuesDto = ConfigurationUtils.convertJsonToChannelValuesDTO(configuration.getVal());
			response = configurationMapper.toResponse(configuration, channelValuesDto, null);
		} else {
			response = configurationMapper.toResponse(configuration, null, configuration.getVal());
		}
		return response;
	}

	/**
	 * Returns all the Configuration belonging to a groupId
	 * @param groupId
	 * @return
	 * @throws ConfigurationServiceException
	 */
	@Override
	public List<Configuration> getConfigGroup(String groupId) throws ConfigurationServiceException {
		try {
			List<Configuration> configurations = configurationRepository.findByGroupId(groupId);
			if(CollectionUtils.isEmpty(configurations)) {
				log.error("Found no configs for this GroupId - {}", groupId);
				throw new DataNotFoundException("Found no configs for this GroupId - " + groupId);
			}
			return configurations;
		} catch (Exception e) {
			log.error("Unexpected error occurred, while fetching Config Groups ", e);
			throw new ConfigurationServiceException(e.getMessage());
		}

	}

}