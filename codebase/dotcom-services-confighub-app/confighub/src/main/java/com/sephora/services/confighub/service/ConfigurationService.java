package com.sephora.services.confighub.service;

import java.util.List;

import com.sephora.services.confighub.dto.ChannelPropertyDto;
import com.sephora.services.confighub.dto.PageDTO;
import com.sephora.services.confighub.dto.PropertyValuesDtoResponse;
import com.sephora.services.confighub.dto.UpdatePropertyValuesDto;
import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.entity.ConfigurationGroup;
import com.sephora.services.confighub.exception.ConfigurationServiceException;

public interface ConfigurationService {
	
    List<PropertyValuesDtoResponse> createConfiguration(ChannelPropertyDto configurationRequest) throws Exception;

    PageDTO<PropertyValuesDtoResponse> fetchConfigurations(int pageNumber, int pageSize, String sort, String filterQuery) throws ConfigurationServiceException;

    PropertyValuesDtoResponse fetchConfiguration(Long configurationId) throws ConfigurationServiceException;

    void deleteConfigurationById(Long configurationId) throws ConfigurationServiceException;

    PropertyValuesDtoResponse updateConfiguration(Long configurationId, UpdatePropertyValuesDto updateConfigurationRequest) throws ConfigurationServiceException;

    List<ConfigurationGroup> getConfigGroups() throws ConfigurationServiceException;

    PropertyValuesDtoResponse updateConfigurationByPropKey(String propKey, UpdatePropertyValuesDto updateConfigurationRequest) throws ConfigurationServiceException;

    Configuration fetchConfigurationByPropKey(String propKey) throws ConfigurationServiceException;

    List<Configuration> getConfigGroup(String groupId) throws ConfigurationServiceException;
}
