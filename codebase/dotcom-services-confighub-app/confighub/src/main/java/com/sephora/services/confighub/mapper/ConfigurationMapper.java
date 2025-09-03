package com.sephora.services.confighub.mapper;

import java.util.Collections;

import com.sephora.services.confighub.dto.ChannelValuesDto;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import com.sephora.platform.common.utils.DateTimeUtils;
import com.sephora.services.confighub.dto.ChannelPropertyDto;
import com.sephora.services.confighub.dto.PropertyValuesDto;
import com.sephora.services.confighub.dto.PropertyValuesDtoResponse;
import com.sephora.services.confighub.dto.UpdatePropertyValuesDto;
import com.sephora.services.confighub.entity.AuditConfiguration;
import com.sephora.services.confighub.entity.Configuration;

@Mapper(
    imports = {
        Collections.class,
        DateTimeUtils.class
    }
)

public abstract class ConfigurationMapper {

    public static final ConfigurationMapper INSTANCE = Mappers.getMapper(ConfigurationMapper.class);

    @Mapping(target = "configId", ignore = true)
    @Mapping(target = "modifiedDate", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "userId", source = "configurationRequest.user")
    @Mapping(target = "groupId", source = "configurationProperties.groupId")
    @Mapping(target = "prop", source = "configurationProperties.propKey", qualifiedByName = "propKey")
    @Mapping(target = "description", source = "configurationProperties.description")
    @Mapping(target = "uiConsume", source = "configurationProperties.uiConsume")
    @Mapping(target = "val", source = "values")
    
    public abstract Configuration toConfiguration(ChannelPropertyDto configurationRequest, PropertyValuesDto configurationProperties, String values);
    
    
    
    
    @Mapping(target = "modifiedDate", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "configId", source = "configId")
    @Mapping(target = "userId", source = "updateConfigurationRequest.user")
    @Mapping(target = "groupId", source = "updateConfigurationRequest.groupId")
    @Mapping(target = "prop", source = "updateConfigurationRequest.propKey", qualifiedByName = "propKey")
    @Mapping(target = "description", source = "updateConfigurationRequest.description")
    @Mapping(target = "uiConsume", source = "updateConfigurationRequest.uiConsume")
    @Mapping(target = "val", source = "values")
    public abstract Configuration toUpdateConfiguration(UpdatePropertyValuesDto updateConfigurationRequest, Long configId,
			String values);
    
    
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "configId", source = "configuration.configId")
    @Mapping(target = "user", source = "configuration.userId")
    @Mapping(target = "groupId", source = "configuration.groupId")
    @Mapping(target = "propKey", source = "configuration.prop", qualifiedByName = "removePrefix")
    @Mapping(target = "description", source = "configuration.description")    
    @Mapping(target = "propValue", source = "propValue")
    @Mapping(target = "propChannelValues", source = "channelValuesDto")
    @Mapping(target = "uiConsume", source = "configuration.uiConsume")
    @Mapping(target = "modifiedDate",  source = "configuration.modifiedDate")
    public abstract PropertyValuesDtoResponse toResponse(Configuration configuration,
                                                         ChannelValuesDto channelValuesDto, String propValue);
    
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "configId", source = "configuration.configId")
    @Mapping(target = "user", source = "configuration.userId")
    @Mapping(target = "groupId", source = "configuration.groupId")
    @Mapping(target = "propKey", source = "configuration.prop", qualifiedByName = "removePrefix")
    @Mapping(target = "description", source = "configuration.description")    
    @Mapping(target = "propChannelValues", source = "configuration.val")
    public abstract PropertyValuesDtoResponse toResponse(Configuration configuration);
    
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "configId", source = "configuration.configId")
    @Mapping(target = "user", source = "configuration.userId")
    @Mapping(target = "groupId", source = "configuration.groupId")
    @Mapping(target = "propKey", source = "configuration.prop", qualifiedByName = "removePrefix")
    @Mapping(target = "description", source = "configuration.description")    
    @Mapping(target = "propValue", source = "configuration.val")
    public abstract PropertyValuesDtoResponse toPropValueResponse(Configuration configuration);
    
    @Named("propKey")
    public String toPropertyKey(String prop) {
        return "confighub." + prop;
    }   
    
    @Named("removePrefix")
    public String toResponse(String propKey) {
    	return propKey.substring(propKey.indexOf('.')+1,propKey.length());
    }

    @Mapping(target = "configAuditId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "configId", source = "configuration.configId")
    @Mapping(target = "userId", source = "configuration.userId")  
    @Mapping(target = "val", source = "configuration.val")
	public abstract AuditConfiguration toAuditConfiguration(Configuration configuration);


	

}

