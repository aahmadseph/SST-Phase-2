package com.sephora.services.confighub.controller.impl;

import com.sephora.services.confighub.client.ConfighubServiceClient;
import com.sephora.services.confighub.config.ConfighubServiceClientConfig;
import com.sephora.services.confighub.dto.*;
import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.entity.ConfigurationGroup;
import com.sephora.services.confighub.exception.ConfigurationServiceException;
import com.sephora.services.confighub.mapper.ConfigurationMapper;
import com.sephora.services.confighub.repository.ConfigurationGroupRepository;
import com.sephora.services.confighub.repository.ConfigurationRepository;
import com.sephora.services.confighub.service.impl.ConfigurationServiceImpl;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class ConfighubControllerImplTest {

    @Mock
    private ConfigurationServiceImpl service;

    @Mock
    private ConfigurationRepository repository;

    @Mock
    private ConfigurationMapper configurationMapper;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private ConfigurationGroupRepository groupRepository;

    @Mock
    private ConfighubServiceClient confighubServiceClient;

    @Mock
    private ConfighubServiceClientConfig confighubServiceClientConfig;

    @InjectMocks
    private ConfighubControllerImpl controller;

    private static final String BASE_URL = "/v1/configuration";

    private static final int PAGE_SIZE = 1;

    private static final int PAGE_NUMBER = 0;

    private static final Long CONFIG_ID = 1L;

    @BeforeEach
    public void setUp() throws ConfigurationServiceException, IOException {
        MockitoAnnotations.initMocks(this);
        List<Configuration> configurations = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            Configuration configuration = new Configuration();
            configuration.setProp("confighub.test");
            configuration.setConfigId(Long.valueOf(i));
            configurations.add(configuration);
            repository.save(configuration);
        }
        for (int i = 0; i < 2; i++) {
            ChannelPropertyDto channelPropertyDto = new ChannelPropertyDto();
            List<PropertyValuesDto> propertyValuesDtos = new ArrayList<>();
            channelPropertyDto.setProperties(propertyValuesDtos);
            channelPropertyDto.setUser("TestConfiguration-" + i);
        }
        List<ConfigurationGroup> groups = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            ConfigurationGroup group = new ConfigurationGroup();
            group.setConfigId(Long.valueOf(i));
            groups.add(group);
        }
        Mockito.when(groupRepository.findAll()).thenReturn(groups);
        Pageable pageable = PageRequest.of(PAGE_NUMBER, PAGE_SIZE);
        Page<Configuration> page = new PageImpl<>(configurations, pageable, configurations.size());
        Mockito.when(repository.findAll(pageable)).thenReturn(page);
        PageDTO<PropertyValuesDtoResponse> pageDTO = new PageDTO<>();
        pageDTO.setTotalPages(2);
        Mockito.when(service.fetchConfigurations(Mockito.anyInt(),Mockito.anyInt(),
                Mockito.any(), Mockito.any())).thenReturn(pageDTO);
        Mockito.when(repository.save(Mockito.any())).thenReturn(configurations.get(0));
        Mockito.when(objectMapper.writeValueAsString(Mockito.any())).thenReturn("Test");
    }

    @Test
    public void createConfiguration() throws Exception {
        Configuration configuration = createTestConfiguration();
        ChannelPropertyDto configurationRequest = createRequest();
        List<PropertyValuesDtoResponse> responseList= new ArrayList<>();
        Mockito.when(service.createConfiguration(configurationRequest)).thenReturn(responseList);
        Mockito.when(repository.findByPropKey(Mockito.any())).thenReturn(0);
        Mockito.when(configurationMapper.toConfiguration(Mockito.any(), Mockito.any(), Mockito.any())).thenReturn(configuration);
        ResponseEntity<Object> response = controller.createConfiguration(configurationRequest);
        assertNotNull(response.getBody());
    }

    @Test
    public void fetchAllConfigurations() {
        Configuration configuration = createTestConfiguration();
        Mockito.when(configurationMapper.toConfiguration(Mockito.any(), Mockito.any(), Mockito.any())).thenReturn(configuration);
        ResponseEntity<Object> response = controller.fetchAllConfigurations(PAGE_NUMBER, PAGE_SIZE, null, null);
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void getConfigurationById() throws ConfigurationServiceException {
        PropertyValuesDtoResponse configurationResponse = new PropertyValuesDtoResponse();
        Configuration configuration = createTestConfiguration();
        Mockito.when(repository.findById(Mockito.any())).thenReturn(Optional.of(configuration));
        Mockito.when(service.fetchConfiguration(Mockito.any())).thenReturn(configurationResponse);
        Mockito.when(configurationMapper.toConfiguration(Mockito.any(), Mockito.any(), Mockito.any())).thenReturn(configuration);
        ResponseEntity<Object> response = controller.getConfigurationById(CONFIG_ID);
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testGetAllConfigurationGroups() {
        ResponseEntity<Object> response = controller.getAllConfigurationGroups();
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());

    }

    @Test
    public void testGetAllConfigurationByGroup() {
        ResponseEntity<Object> response = controller.getConfigurationGroup("1");
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());

    }

    @Test
    public void testConfigurationWithInvalidConfigId() throws ConfigurationServiceException {
        Mockito.when(repository.findById(Mockito.any())).thenReturn(null);
        Mockito.when(service.fetchConfiguration(4l)).thenThrow(new NoSuchElementException("test"));
        ResponseEntity<Object> response = controller.getConfigurationById(4L);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void getAllConfigurationGroups() {
        ResponseEntity<Object> response = controller.getAllConfigurationGroups();
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void getConfigurationGroup() {
        ResponseEntity<Object> response = controller.getConfigurationGroup("1");
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    private Configuration createTestConfiguration(){
        Configuration configuration = new Configuration();
        configuration.setDescription("Test Configuration");
        configuration.setConfigId(CONFIG_ID);
        configuration.setVal("confighub.test");
        configuration.setProp("confighub.test");
        return configuration;
    }

    private ChannelPropertyDto createRequest(){
        ChannelPropertyDto propertyDtoRequest = new ChannelPropertyDto();
        List<PropertyValuesDto> propertyValuesDtos = createPropertyValuesDTOs();
        propertyDtoRequest.setUser("Test-1");
        propertyDtoRequest.setProperties(propertyValuesDtos);
        return propertyDtoRequest;
    }

    private PropertyValuesDto createPropertyValuesDto(){
        PropertyValuesDto propertyValuesDto = new PropertyValuesDto();
        propertyValuesDto.setPropValue("test");
        propertyValuesDto.setPropKey("test");
        ChannelValuesDto valuesDto = createChannelValuesDTO();
        propertyValuesDto.setPropChannelValues(valuesDto);
        propertyValuesDto.setDescription("Test Configuration");
        propertyValuesDto.setGroupId("1");
        propertyValuesDto.setPropValue("testPropValue");
        propertyValuesDto.setPropChannelValues(valuesDto);
        return propertyValuesDto;
    }

    private List<PropertyValuesDto> createPropertyValuesDTOs(){
        List<PropertyValuesDto> propertyValuesDtos = new ArrayList<>();
        PropertyValuesDto propertyValuesDto = createPropertyValuesDto();
        propertyValuesDtos.add(propertyValuesDto);
        return propertyValuesDtos;
    }

    private ChannelValuesDto createChannelValuesDTO(){
        ChannelValuesDto valuesDto = new ChannelValuesDto();
        valuesDto.setBase("test");
        valuesDto.setWeb("test");
        valuesDto.setAndroidApp("test");
        valuesDto.setRwd("test");
        valuesDto.setIphoneApp("test");
        return valuesDto;
    }

}