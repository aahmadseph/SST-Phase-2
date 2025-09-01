package com.sephora.services.confighub.service.impl;

import com.sephora.services.confighub.client.ATGUtilConfigClient;
import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.exception.ConfigurationServiceException;
import com.sephora.services.confighub.repository.ConfigurationRepository;
import com.sephora.services.confighub.service.ATGConfigUtilService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.assertEquals;

public class ConfigurationUtilServiceImplTest {

    @Mock
    ConfigurationRepository repository;

    @Mock
    ATGUtilConfigClient client;

    @Mock
    ATGConfigUtilService atgConfigUtilService;

    @InjectMocks
    ConfigurationUtilServiceImpl service;

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
        Map<String, Object> testMap = new HashMap<>();
    }

//    @Test
//    public void fetchExposedConfigs() throws ConfigurationServiceException {
//        Map<String, Object> result = service.fetchExposedConfigs(String.valueOf(CONFIG_ID), "us", "en");
//        //assertEquals("test1", result.get("test1"));
//    }
}