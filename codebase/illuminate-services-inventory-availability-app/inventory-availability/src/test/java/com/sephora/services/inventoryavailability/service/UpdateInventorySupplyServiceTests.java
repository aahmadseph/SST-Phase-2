package com.sephora.services.inventoryavailability.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Date;

import com.sephora.services.common.inventory.audit.service.AuditService;
import com.sephora.services.inventory.service.NotifyEventService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
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
import com.sephora.services.availabilityhub.client.AvailabilityHubClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.mapping.InventorySupplyMapper;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyRequest;

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
//@MockBeans(value = { @MockBean(InventorySupplyMapper.class)})
public class UpdateInventorySupplyServiceTests { //extends AbstractServiceTest {
	
	@Autowired
	UpdateInventorySupplyService updateInventorySupplyService;
	@MockBean
	protected AvailabilityHubClient availabilityServiceClient;
	
	@Autowired
	InventorySupplyMapper inventorySupplyMapper;
	
	@Mock
	InventorySupplyAHResponse inventorySupplyAHResponse;

	@MockBean
	AuditService auditService;

	@MockBean
	NotifyEventService notifyEventService;
	
	
	
	@Test
	public void testValidUpdateInventorySupplyRequest() throws Exception { 
		//InventorySupplyAHResponse InventorySupplyAHResponse= new InventorySupplyAHResponse();
		InventorySupplyDTO inventorySupplyDTO = TestUtils.getInventorySupplyFromConstants();
		
		when(availabilityServiceClient.updateInventorySupply(
				inventorySupplyMapper.convert(inventorySupplyDTO))).thenReturn(inventorySupplyAHResponse);
		
		updateInventorySupplyService.updateInventorySupply(inventorySupplyDTO);
		
		Mockito.verify(availabilityServiceClient, Mockito.times(1))
		.updateInventorySupply(ArgumentMatchers.any(InventorySupplyRequest.class));
	}
	
	@Test
	public void testInvalidUpdateInventorySupplyRequest() throws Exception { 
		//InventorySupplyAHResponse InventorySupplyAHResponse= new InventorySupplyAHResponse();
		InventorySupplyDTO inventorySupplyDTO = TestUtils.getInventorySupplyFromConstants();
		//To make the request invalid
		inventorySupplyDTO.setLocationId(null);
		int httpStatus = 0;
		try {
			updateInventorySupplyService.updateInventorySupply(inventorySupplyDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		
		assertEquals(HttpStatus.BAD_REQUEST.value(), httpStatus);
	}
	
	@Test
	public void test40XErrorFromFeignClient() throws Exception {
		Mockito.doThrow(new FeignException.FeignClientException(400, "mock 400 error", TestUtils.getMockRequest(),
				"mock".getBytes(),null)).when(availabilityServiceClient).updateInventorySupply(ArgumentMatchers.any());
		InventorySupplyDTO inventorySupplyDTO = TestUtils.getInventorySupplyFromConstants();
		int httpStatus = 400;
		try {
			updateInventorySupplyService.updateInventorySupply(inventorySupplyDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.BAD_REQUEST.value(), httpStatus);
	}
	
	@Test
	public void test5XXErrorFromFeignClient() throws Exception {
		Mockito.doThrow(new FeignException.FeignServerException(500, "mock 500 error", TestUtils.getMockRequest(),
				"mock".getBytes(),null)).when(availabilityServiceClient).updateInventorySupply(ArgumentMatchers.any());
		InventorySupplyDTO inventorySupplyDTO = TestUtils.getInventorySupplyFromConstants();
		int httpStatus = 500;
		try {
			updateInventorySupplyService.updateInventorySupply(inventorySupplyDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), httpStatus);
	}
	
	@Test
	public void testNoContentFromFeignClient() throws Exception {
		Mockito.doThrow(new NoContentException(204, "mock 204 error")).when(availabilityServiceClient)
				.updateInventorySupply(ArgumentMatchers.any());
		InventorySupplyDTO inventorySupplyDTO = TestUtils.getInventorySupplyFromConstants();
		int httpStatus = 204;
		try {
			updateInventorySupplyService.updateInventorySupply(inventorySupplyDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.NO_CONTENT.value(), httpStatus);
	}
	
	@Test()
	public void testIOExceptionFromFeignClient() throws Exception {
		Mockito.doThrow(new RetryableException(500, "mock retryable exception", Request.HttpMethod.POST, new IOException(), new Date(),
				TestUtils.getMockRequest())).when(availabilityServiceClient).updateInventorySupply(ArgumentMatchers.any());
		InventorySupplyDTO inventorySupplyDTO = TestUtils.getInventorySupplyFromConstants();
		int httpStatus = 500;
		try {
			updateInventorySupplyService.updateInventorySupply(inventorySupplyDTO);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), httpStatus);
	}
 }
