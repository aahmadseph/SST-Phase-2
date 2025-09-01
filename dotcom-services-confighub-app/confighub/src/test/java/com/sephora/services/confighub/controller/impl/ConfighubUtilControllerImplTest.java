package com.sephora.services.confighub.controller.impl;

import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.exception.ConfigurationServiceException;
import com.sephora.services.confighub.repository.ConfigurationRepository;
import com.sephora.services.confighub.service.impl.ConfigurationUtilServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.*;

class ConfighubUtilControllerImplTest {

    @Mock
    ConfigurationRepository repository;

    @Mock
    ConfigurationUtilServiceImpl service;

    @InjectMocks
    ConfighubUtilControllerImpl controller;

    private static final Long CONFIG_ID = 1L;

    @BeforeEach
    public void setUp() throws ConfigurationServiceException, IOException {
        MockitoAnnotations.initMocks(this);
        List<Configuration> configurations = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            Configuration configuration = new Configuration();
            configuration.setProp("confighub.test" + i);
            configuration.setVal("test" + i );
            configuration.setConfigId(Long.valueOf(i));
            configurations.add(configuration);
            repository.save(configuration);
        }
        Mockito.when(repository.findExposedConfigurations(Mockito.any())).thenReturn(configurations);
    }

    @Test
    void fetchChannels() {
        ResponseEntity<Object> response = controller.fetchExposedConfigs(String.valueOf(CONFIG_ID), "us", "en");
        assertNotNull( response.getBody());
    }
}