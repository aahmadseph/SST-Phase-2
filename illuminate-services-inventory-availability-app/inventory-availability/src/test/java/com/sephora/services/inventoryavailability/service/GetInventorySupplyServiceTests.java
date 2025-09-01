package com.sephora.services.inventoryavailability.service;

import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;

import com.sephora.services.inventoryavailability.config.InventorySupplyDefaultConfig;
import feign.RequestTemplate;
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
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.services.availabilityhub.client.AvailabilityHubClient;
import com.sephora.services.availabilityhub.client.CustomAvailabilityHubClient;
import com.sephora.services.common.availabilityhub.exception.NoContentException;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.mapping.GetInventorySupplyMapper;

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
@ComponentScan(basePackages = { "com.sephora.services.common.inventory.validators" })
@ContextConfiguration(classes = {
		AvailabilityConfig.class, InventorySupplyDefaultConfig.class}, initializers = ConfigDataApplicationContextInitializer.class)
@TestPropertySource("classpath:application-test.yaml")
@MockBeans(value = { @MockBean(GetInventorySupplyMapper.class) })
public class GetInventorySupplyServiceTests {
	@Autowired
	GetInventorySupplyService getInventorySupplyService;

	@MockBean
	protected AvailabilityHubClient availabilityServiceClient;
	
	@MockBean
	protected CustomAvailabilityHubClient customAvailabilityServiceClient;


	private Request getMockRequest() {
		return Request.create(Request.HttpMethod.GET, "/mock-url/", new HashMap<>(), Request.Body.empty(),getRequestTemplate());
	}

	@Test
	public void testSearchInNetwork() throws AvailabilityServiceException {
		getInventorySupplyService.search(PRODUCT_ID, UOM);

		Mockito.verify(availabilityServiceClient, Mockito.times(1)).getInventorySupply(
				ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class),
				ArgumentMatchers.any(String.class));
	}

	@Test
	public void testSearchByLocation() throws AvailabilityServiceException {
		getInventorySupplyService.search(PRODUCT_ID, UOM, LOCATION_ID);

		Mockito.verify(customAvailabilityServiceClient, Mockito.times(1)).getInventorySupply(
				ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class),
				ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class),
				ArgumentMatchers.any(String.class));
	}

	@Test
	public void test40XErrorFromFeignClient() throws Exception {
		Mockito.doThrow(
				new FeignException.FeignClientException(400, "mock 400 error", getMockRequest(), "mock".getBytes(),null))
				.when(availabilityServiceClient)
				.getInventorySupply(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any());

		int httpStatus = 400;
		try {
			getInventorySupplyService.search(PRODUCT_ID, UOM);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.BAD_REQUEST.value(), httpStatus);
	}

	@Test
	public void test40XErrorFromFeignClientForSearchByLocation() throws Exception {
		Mockito.doThrow(
				new FeignException.FeignClientException(400, "mock 400 error", getMockRequest(), "mock".getBytes(),null))
				.when(customAvailabilityServiceClient).getInventorySupply(ArgumentMatchers.any(), ArgumentMatchers.any(),
						ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any());

		int httpStatus = 400;
		try {
			getInventorySupplyService.search(PRODUCT_ID, UOM, LOCATION_ID);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.BAD_REQUEST.value(), httpStatus);
	}

	@Test
	public void test5XXErrorFromFeignClient() throws Exception {
		Mockito.doThrow(
				new FeignException.FeignServerException(500, "mock 500 error", getMockRequest(), "mock".getBytes(),null))
				.when(availabilityServiceClient)
				.getInventorySupply(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any());

		int httpStatus = 500;
		try {
			getInventorySupplyService.search(PRODUCT_ID, UOM);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), httpStatus);
	}

	@Test
	public void test5XXErrorFromFeignClientForSearchByLocation() throws Exception {
		Mockito.doThrow(
				new FeignException.FeignServerException(500, "mock 500 error", getMockRequest(), "mock".getBytes(),null))
				.when(customAvailabilityServiceClient).getInventorySupply(ArgumentMatchers.any(), ArgumentMatchers.any(),
						ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any());

		int httpStatus = 500;
		try {
			getInventorySupplyService.search(PRODUCT_ID, UOM, LOCATION_ID);
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
				.getInventorySupply(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any());
		int httpStatus = 204;
		try {
			getInventorySupplyService.search(PRODUCT_ID, UOM);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.NO_CONTENT.value(), httpStatus);
	}

	@Test
	public void testNoContentFromFeignClientForSearchByLocation() throws Exception {
		Mockito.doThrow(new NoContentException(204, "mock 204 error")).when(customAvailabilityServiceClient)
				.getInventorySupply(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any(),
						ArgumentMatchers.any(), ArgumentMatchers.any());
		int httpStatus = 200;
		try {
			getInventorySupplyService.search(PRODUCT_ID, UOM, LOCATION_ID);
		} catch (AvailabilityServiceException e) {
			//this should not work
			//return 200
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.OK.value(), httpStatus);
	}

	@Test()
	public void testIOExceptionFromFeignClient() throws Exception {
		Mockito.doThrow(new RetryableException(500, "mock retryable exception", Request.HttpMethod.GET,
				new IOException(), new Date(), TestUtils.getMockRequest())).when(availabilityServiceClient)
				.getInventorySupply(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any());
		
		int httpStatus = 500;
		try {
			getInventorySupplyService.search(PRODUCT_ID, UOM);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), httpStatus);
	}

	@Test()
	public void testIOExceptionFromFeignClientForSearchByLocation() throws Exception {
		Mockito.doThrow(new RetryableException(500, "mock retryable exception", Request.HttpMethod.GET,
				new IOException(), new Date(), TestUtils.getMockRequest())).when(customAvailabilityServiceClient)
				.getInventorySupply(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any(),
						ArgumentMatchers.any(), ArgumentMatchers.any());
		
		int httpStatus = 500;
		try {
			getInventorySupplyService.search(PRODUCT_ID, UOM, LOCATION_ID);
		} catch (AvailabilityServiceException e) {
			httpStatus = e.getHttpStatus();
		} finally {
			Mockito.reset(availabilityServiceClient);
		}
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), httpStatus);
	}
	private RequestTemplate getRequestTemplate() {
		return new RequestTemplate();

	}
}
