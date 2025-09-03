package com.sephora.services.inventoryavailability.service;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.config.GetAvailabilityConfig;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.AvailabilityServicePartialFailureException;
import com.sephora.services.inventoryavailability.mapping.GetAvailabilityMapper;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@EnableAutoConfiguration(exclude = {HibernateJpaAutoConfiguration.class,
		SimpleDiscoveryClientAutoConfiguration.class,
		DataSourceAutoConfiguration.class,
	      HibernateJpaAutoConfiguration.class,
	      SimpleDiscoveryClientAutoConfiguration.class,
	      RedisAutoConfiguration.class,
	      RedisRepositoriesAutoConfiguration.class,
		SecurityAutoConfiguration.class,
		ManagementWebSecurityAutoConfiguration.class,
		org.springframework.boot.actuate.autoconfigure.metrics.cache.CacheMetricsAutoConfiguration.class})
@ComponentScan(basePackages = { "com.sephora.services.common.inventoryavailability.validators" , "com.sephora.services.inventoryavailability.mapping"})
@ContextConfiguration(classes = {
        AvailabilityConfig.class, InventoryApplicationConfig.class, GetAvailabilityConfig.class, Validator.class }, initializers = ConfigDataApplicationContextInitializer.class)
@TestPropertySource("classpath:application-test.yaml")
@MockBeans(value = { @MockBean(GetAvailabilityCacheService.class) })
public class GetAvailabilityServiceTests {
    @MockBean
    AvailabilityHubInventoryService yantriksInventoryService;
    @Autowired
    GetAvailabilityMapper getAvailabilityMapper;
    @Autowired
    InventoryApplicationConfig applicationConfig;
    @Autowired
    GetInventoryAvailabilityService getAvailabilityService;
    @MockBean
    MockAvailabilityService mockAvailabilityService;
    
    @Test
    public void testValidAvailabilityRequest() throws AvailabilityServicePartialFailureException, AvailabilityServiceException {
        AvailabilityRequestDto requestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        Mockito.when(yantriksInventoryService.getItemsInventoryAvailability(ArgumentMatchers.any()))
                .thenReturn(TestUtils.buildMockAvailabilityResponseData());
        AvailabilityResponseDto inventoryAvailability = getAvailabilityService.getInventoryAvailability(requestDto);
        Mockito.verify(yantriksInventoryService, Mockito.times(1))
                .getItemsInventoryAvailability(ArgumentMatchers.any());

    }

    @Test(expected = AvailabilityServiceException.class)
    public void testAvailabilityExceptionAvailabilityRequest() throws AvailabilityServicePartialFailureException, AvailabilityServiceException {
        AvailabilityRequestDto requestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        requestDto.setSellingChannel(null);
        Mockito.when(yantriksInventoryService.getItemsInventoryAvailability(ArgumentMatchers.any()))
                .thenReturn(TestUtils.buildMockAvailabilityResponseData());
        AvailabilityResponseDto inventoryAvailability = getAvailabilityService.getInventoryAvailability(requestDto);
    }
}
