package com.sephora.services.inventoryavailability.service;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.platform.common.utils.ApplicationUtils;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.availabilityhub.client.AvailabilityClient;
import com.sephora.services.availabilityhub.client.AvailabilityHubAsyncConfig;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.AvailabilityServicePartialFailureException;
import com.sephora.services.inventoryavailability.mapping.GetAvailabilityMapper;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.GetAvailabilityResponseData;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestLocation;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestProduct;
import feign.FeignException;
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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Arrays;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
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
@ComponentScan(basePackages = { "com.sephora.services.inventoryavailability.mapping"})
@ContextConfiguration(classes = {
        AvailabilityConfig.class, InventoryApplicationConfig.class, 
        AvailabilityHubAsyncConfig.class, 
        RequestLoggingFilterConfig.class, 
        ApplicationUtils.class,
        AvailabilityHubMissConfiguration.class}, initializers = ConfigDataApplicationContextInitializer.class)
@TestPropertySource("classpath:application-test.yaml")
public class AvailabilityHubInventoryServiceTests {

    @Autowired
    AvailabilityHubInventoryService availabilityHubInventoryService;

    @MockBean
    AvailabilityClient availabilityClient;

    @Autowired
    GetAvailabilityMapper getAvailabilityMapper;

    @Autowired
    InventoryApplicationConfig applicationConfig;

    @Test
    public void testValidRequest() throws AvailabilityServicePartialFailureException, AvailabilityServiceException {
        AvailabilityRequestDto requestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        Mockito.when(availabilityClient.getItemsInventoryAvailability(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any()))
                .thenReturn(TestUtils.buildMockAvailabilityResponseData());
        availabilityHubInventoryService.getItemsInventoryAvailability(getAvailabilityMapper.convert(requestDto, applicationConfig));
        Mockito.verify(availabilityClient, Mockito.times(1))
                .getItemsInventoryAvailability(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any());
    }


    @Test(expected=AvailabilityServiceException.class)
    public void test4XXErrorFromYantriksRequest() throws AvailabilityServicePartialFailureException, AvailabilityServiceException {
        AvailabilityRequestDto requestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        Mockito.when(availabilityClient.getItemsInventoryAvailability(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any()))
                .thenThrow(
                        new FeignException.FeignClientException(HttpStatus.BAD_REQUEST.value(),
                                "Mock error",
                                TestUtils.getMockRequest(),
                                "".getBytes(),null));

        availabilityHubInventoryService.getItemsInventoryAvailability(getAvailabilityMapper.convert(requestDto, applicationConfig));
        /*Mockito.verify(availabilityClient, Mockito.times(1))
                .getItemsInventoryAvailability(ArgumentMatchers.any());*/
    }

    @Test(expected = AvailabilityServicePartialFailureException.class)
    public void testPartialFailure() throws AvailabilityServicePartialFailureException, AvailabilityServiceException {
        AvailabilityRequestDto requestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        //creating request with multiple products
        ArrayList<AvailabilityRequestProduct> products = new ArrayList();
        products.addAll(requestDto.getProducts());
        for(int i =0; i<6; i++){
            products.add(AvailabilityRequestProduct.builder()
                    .productId("test" + i)
                    .uom("EACH")
                    .fulfillmentType("SHIPTOHOME")
                    .locations(Arrays.asList(new AvailabilityRequestLocation("0701")))
                    .build());
        }

        requestDto.setProducts(products);
        //first time, mockito will return valid request, second time will throw exception
        Mockito.when(availabilityClient.getItemsInventoryAvailability(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any()))
                .thenReturn(TestUtils.buildMockAvailabilityResponseData())
                .thenThrow(
                        new FeignException.FeignClientException(HttpStatus.BAD_REQUEST.value(),
                                "Mock error",
                                TestUtils.getMockRequest(),
                                "".getBytes(),null));
        availabilityHubInventoryService.getItemsInventoryAvailability(getAvailabilityMapper.convert(requestDto, applicationConfig));
    }

    @Test
    public void testFindAvailabilityForCacheMiss() {
    	GetAvailabilityResponseData getAvailabilityResponseData = TestUtils.readObjectFromJsonFile("response/ah_availability/GetAvailabilityAHResponse.json", GetAvailabilityResponseData.class);
    	Mockito.when(availabilityClient.getItemsInventoryAvailability(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any()))
        	.thenReturn(getAvailabilityResponseData);
    	availabilityHubInventoryService.findAvailabilityForCacheMiss(Arrays.asList("1", "2"), "0770", "SEPHORAUS", "SAMEDAY");
    }

}
