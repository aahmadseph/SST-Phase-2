package com.sephora.services.confighub.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.confighub.client.ConfighubServiceClient;
import com.sephora.services.confighub.dto.*;
import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.entity.ConfigurationGroup;
import com.sephora.services.confighub.exception.ConfigurationServiceException;
import com.sephora.services.confighub.exception.DataNotFoundException;
import com.sephora.services.confighub.mapper.ConfigurationMapper;
import com.sephora.services.confighub.mapper.PageToPageDTOMapper;
import com.sephora.services.confighub.repository.ConfigurationGroupRepository;
import com.sephora.services.confighub.repository.ConfigurationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

class ConfigurationServiceImplTest {

    @Mock
    private TestEntityManager entityManager;

    @Mock
    private ConfigurationRepository repository;

    @InjectMocks
    private ConfigurationServiceImpl service;

    @Mock
    private ObjectMapper mapper;

    @Mock
    private ConfigurationMapper configurationMapper;

    @Mock
    private PageToPageDTOMapper pageToPageDTOMapper;

    @Mock
    private ConfigurationGroupRepository groupRepository;

    @Mock
    private ConfighubServiceClient confighubServiceClient;

    private static final int PAGE_NUMBER = 0;
    private static final int PAGE_SIZE = 1;
    private static final Long CONFIG_ID = 1L;

    @BeforeEach
    void setUp() throws JsonProcessingException {
        MockitoAnnotations.initMocks(this);
        List<Configuration> configurations = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            Configuration configuration = new Configuration();
            configuration.setProp("confighub.test");
            configuration.setConfigId(Long.valueOf(i));
            configuration.setVal("test");
            configurations.add(configuration);
        }
        List<ConfigurationGroup> groups = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            ConfigurationGroup group = new ConfigurationGroup();
            group.setConfigId(Long.valueOf(i));
            groups.add(group);
        }
        Mockito.when(groupRepository.findAll()).thenReturn(groups);
        Configuration configuration = createTestConfiguration();
        Pageable pageable = PageRequest.of(PAGE_NUMBER, PAGE_SIZE, Sort.Direction.ASC, "prop");
        Page<Configuration> page = new PageImpl<>(configurations, pageable, configurations.size());
        List<PropertyValuesDtoResponse> propertyValuesDtoResponses= new ArrayList<>();
        PageDTO pageDTO = createPageDTO(propertyValuesDtoResponses);
        Mockito.when(repository.findAll(pageable)).thenReturn(page);
        Mockito.when(repository.findLastModifiedConfigurations()).thenReturn(configuration);
        Mockito.when(repository.save(Mockito.any())).thenReturn(configuration);
        Mockito.when(repository.findById(CONFIG_ID)).thenReturn(Optional.of(configuration));
        Mockito.when(repository.findByGroupId(Mockito.any())).thenReturn(configurations);
        Mockito.when(repository.findByGroupId("0")).thenReturn(configurations);
        Mockito.when(mapper.writeValueAsString(Mockito.any())).thenReturn("testString");
        Mockito.when(pageToPageDTOMapper.pageToPageDTO(Mockito.anyLong(), Mockito.anyInt(),
                Mockito.any(), Mockito.any(), Mockito.any())).thenReturn(pageDTO);

    }

    @Test
    public void createConfiguration() throws Exception {
        Configuration configuration = createTestConfiguration();
        ChannelPropertyDto propertyDtoRequest = createRequest();
        Mockito.when(repository.save(Mockito.any())).thenReturn(configuration);
        PropertyValuesDtoResponse propertyValuesDtoResponse = createPropertyValuesDtoResponse();
        Mockito.when(configurationMapper.toResponse(Mockito.any(Configuration.class), Mockito.any(),Mockito.any())).thenReturn(propertyValuesDtoResponse);
        List<PropertyValuesDtoResponse> result = service.createConfiguration(propertyDtoRequest);
        assertEquals(configuration.getConfigId(), result.get(0).getConfigId());
        assertEquals(configuration.getDescription(), result.get(0).getDescription());
    }

    @Test
    public void testGetConfigurationsWithInvalidConfigID() {
        Exception exception = assertThrows(DataNotFoundException.class, () -> {
            service.fetchConfiguration(5L);
        });
        String expectedMessage = "No value present";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    public void fetchAllConfigurations() throws ConfigurationServiceException {
        PageDTO<PropertyValuesDtoResponse> result = service.fetchConfigurations(PAGE_NUMBER, PAGE_SIZE, "asc", null);
        assertEquals(1, result.getTotalPages());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    public void testGetConfigurationsWithInvalidPageNumber() {
        assertThrows(ConfigurationServiceException.class, () -> {
            service.fetchConfigurations(5, PAGE_SIZE, null, null);
        });
    }

    @Test
    public void fetchConfiguration() throws ConfigurationServiceException {
        PropertyValuesDtoResponse response = createPropertyValuesDtoResponse();
        Mockito.when(configurationMapper.toResponse(Mockito.any(), Mockito.any(),
                Mockito.any())).thenReturn(response);
        PropertyValuesDtoResponse result = service.fetchConfiguration(CONFIG_ID);
        assertEquals(CONFIG_ID, result.getConfigId());
        assertEquals("Test Configuration", result.getDescription());
    }

    @Test
    public void deleteConfigurationById() throws ConfigurationServiceException {
        Configuration configuration = new Configuration();
        configuration.setConfigId(Long.valueOf(1));
        service.deleteConfigurationById(configuration.getConfigId());
        Mockito.verify(repository, Mockito.times(1)).deleteById(configuration.getConfigId());
    }

    @Test
    public void testDeleteNonExistingConfiguration() throws ConfigurationServiceException {
        service.deleteConfigurationById(Long.valueOf(1));
        Mockito.verify(repository, Mockito.times(1)).deleteById(Long.valueOf(1));
    }

    @Test
    public void getConfigGroups() throws ConfigurationServiceException {
        List<ConfigurationGroup> result = service.getConfigGroups();
        assertEquals(Optional.of(0L).get(), result.get(0).getConfigId());
    }

    @Test
    public void getConfigGroup() throws ConfigurationServiceException {
        List<Configuration> result = service.getConfigGroup("1");
        assertEquals(Optional.of(0L).get(), result.get(0).getConfigId());
    }

    private static PageDTO createPageDTO(List<PropertyValuesDtoResponse> configurations) {
        PageDTO pageDTO = new PageDTO();
        pageDTO.setTotalPages(1);
        pageDTO.setTotalElements(1);
        pageDTO.setContent(configurations);
        return pageDTO;
    }

    private Configuration createTestConfiguration() {
        Configuration configuration = new Configuration();
        configuration.setDescription("Test Configuration");
        configuration.setConfigId(CONFIG_ID);
        configuration.setVal("confighub.test");
        configuration.setProp("confighub.test");
        configuration.setModifiedDate(LocalDateTime.now());
        return configuration;
    }

    private ChannelPropertyDto createRequest() {
        ChannelPropertyDto propertyDtoRequest = new ChannelPropertyDto();
        List<PropertyValuesDto> propertyValuesDtos = createPropertyValuesDTOs();
        propertyDtoRequest.setUser("Test-1");
        propertyDtoRequest.setProperties(propertyValuesDtos);
        return propertyDtoRequest;
    }

    private PropertyValuesDto createPropertyValuesDto() {
        PropertyValuesDto propertyValuesDto = new PropertyValuesDto();
        ChannelValuesDto valuesDto = createChannelValuesDTO();
        propertyValuesDto.setPropChannelValues(valuesDto);
        propertyValuesDto.setDescription("testdescription");
        propertyValuesDto.setGroupId("testGroupId");
        propertyValuesDto.setPropValue("testPropValue");
        propertyValuesDto.setPropChannelValues(valuesDto);
        return propertyValuesDto;
    }

    private List<PropertyValuesDto> createPropertyValuesDTOs() {
        List<PropertyValuesDto> propertyValuesDtos = new ArrayList<>();
        PropertyValuesDto propertyValuesDto = createPropertyValuesDto();
        propertyValuesDtos.add(propertyValuesDto);
        return propertyValuesDtos;
    }

    private ChannelValuesDto createChannelValuesDTO() {
        ChannelValuesDto valuesDto = new ChannelValuesDto();
        valuesDto.setBase("test");
        valuesDto.setWeb("test");
        valuesDto.setAndroidApp("test");
        valuesDto.setRwd("test");
        valuesDto.setIphoneApp("test");
        return valuesDto;
    }

    private static PropertyValuesDtoResponse createPropertyValuesDtoResponse() {
        PropertyValuesDtoResponse propertyValuesDtoResponse = new PropertyValuesDtoResponse();
        propertyValuesDtoResponse.setConfigId(CONFIG_ID);
        propertyValuesDtoResponse.setDescription("Test Configuration");
        return propertyValuesDtoResponse;
    }

}