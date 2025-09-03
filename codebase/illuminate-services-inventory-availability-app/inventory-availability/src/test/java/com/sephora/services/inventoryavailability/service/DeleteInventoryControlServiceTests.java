package com.sephora.services.inventoryavailability.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.util.Date;

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
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.services.availabilityhub.client.AvailabilityClient;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.inventorycontrol.DeleteInventoryControlDTO;

import feign.FeignException;
import feign.Request;
import feign.RetryableException;

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
@ComponentScan(basePackages = { "com.sephora.services.common.inventory.validators"})
@ContextConfiguration(classes = { AvailabilityConfig.class}, initializers = ConfigDataApplicationContextInitializer.class)
@TestPropertySource("classpath:application-test.yaml")
public class DeleteInventoryControlServiceTests {
	@Autowired
	DeleteInventoryControlService deleteInventoryControlService;
	
	@MockBean
	AvailabilityClient availabilityClient;
	
	@Test
	public void testDeleteInventoryControl() throws Exception { 
		DeleteInventoryControlDTO deleteInventoryControlDTO = TestUtils.buildDeleteInventoryControlDTOFromConstants();
		
		deleteInventoryControlService.deleteInventoryControl(deleteInventoryControlDTO);
		
		Mockito.verify(availabilityClient, Mockito.times(1))
		.deleteInventoryControl(ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), 
				ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class));
	}
	
	@Test
	public void testInvalidUpdateInventorySupplyRequest() throws Exception { 
		DeleteInventoryControlDTO deleteInventoryControlDTO = TestUtils.buildDeleteInventoryControlDTOFromConstants();
		//To make the request invalid
		deleteInventoryControlDTO.setLocationId(null);
		int httpStatus = 0;
		try {
			deleteInventoryControlService.deleteInventoryControl(deleteInventoryControlDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityClient);
		}
		
		assertEquals(HttpStatus.BAD_REQUEST.value(), httpStatus);
	}
	
	@Test
	public void test40XErrorFromFeignClient() throws Exception {
		Mockito.doThrow(new FeignException.FeignClientException(400, "mock 400 error", TestUtils.getMockRequest(),
				"mock".getBytes(),null)).when(availabilityClient).deleteInventoryControl(ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class),
						ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class));
		DeleteInventoryControlDTO deleteInventoryControlDTO = TestUtils.buildDeleteInventoryControlDTOFromConstants();
		int httpStatus = 400;
		try {
			deleteInventoryControlService.deleteInventoryControl(deleteInventoryControlDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityClient);
		}
		assertEquals(HttpStatus.BAD_REQUEST.value(), httpStatus);
	}
	
	@Test
	public void test5XXErrorFromFeignClient() throws Exception {
		Mockito.doThrow(new FeignException.FeignServerException(500, "mock 500 error", TestUtils.getMockRequest(),
				"mock".getBytes(),null)).when(availabilityClient).deleteInventoryControl(ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class),
						ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class));
		DeleteInventoryControlDTO deleteInventoryControlDTO = TestUtils.buildDeleteInventoryControlDTOFromConstants();
		int httpStatus = 500;
		try {
			deleteInventoryControlService.deleteInventoryControl(deleteInventoryControlDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityClient);
		}
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), httpStatus);
	}
	
	
	@Test()
	public void testIOExceptionFromFeignClient() throws Exception {
		Mockito.doThrow(new RetryableException(500, "mock retryable exception", Request.HttpMethod.POST, new IOException(), new Date(),
				TestUtils.getMockRequest())).when(availabilityClient).deleteInventoryControl(ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), 
						ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class));
		DeleteInventoryControlDTO deleteInventoryControlDTO = TestUtils.buildDeleteInventoryControlDTOFromConstants();
		int httpStatus = 500;
		try {
			deleteInventoryControlService.deleteInventoryControl(deleteInventoryControlDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityClient);
		}
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), httpStatus);
	}
}
 