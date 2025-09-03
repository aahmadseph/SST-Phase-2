
package com.sephora.services.inventoryavailability.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.cache.CacheException;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.platform.cache.service.CacheService;
import com.sephora.platform.common.utils.ApplicationUtils;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.availabilityhub.client.AvailabilityHubAsyncConfig;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.config.GetAvailabilityForSitePagesConfig;
import com.sephora.services.inventory.model.locationavailability.redis.LocationAvailabilityRedisCacheDto;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.config.GetAvailabilityConfig;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.config.PriorityConfig;
import com.sephora.services.inventoryavailability.mapping.GetAvailabilityMapper;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.utils.AvailabilityUtils;

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

@ComponentScan(basePackages = { "com.sephora.services.inventoryavailability.mapping" })

@ContextConfiguration(classes = { AvailabilityConfig.class, InventoryApplicationConfig.class,
		AvailabilityHubAsyncConfig.class, RequestLoggingFilterConfig.class, ApplicationUtils.class,
		AvailabilityHubMissConfiguration.class,
		GetAvailabilityConfig.class }, initializers = ConfigDataApplicationContextInitializer.class)

// @MockBeans({@MockBean(AvailabilityHubInventoryService.class) }) public
public class GetAvailabilityCacheServiceTests {

	@Autowired
	GetAvailabilityCacheService getAvailabilityCacheService;

	@MockBean
	AvailabilityHubInventoryService yantriksInventoryService;

	@Autowired
	GetAvailabilityMapper getAvailabilityMapper;

	@Autowired
	InventoryApplicationConfig applicationConfig;

	@Autowired
	private GetAvailabilityConfig getAvailabilityConfig;
	
	@MockBean(answer = Answers.RETURNS_DEEP_STUBS)
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;
	

	@Test
	public void getAvailabilityTest() {
		AvailabilityRequestDto availabilityRequestDto = TestUtils.readObjectFromJsonFile(
				"request/get_availability/GetAvailabilityRequest.json", AvailabilityRequestDto.class);
		InventoryItemsRequestDto inventoryItemsRequestDto = getAvailabilityMapper.convert(availabilityRequestDto,
				applicationConfig);
		PriorityConfig priorityConfig = getAvailabilityConfig.getPriorityConfig(availabilityRequestDto);

		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = TestUtils.readObjectFromJsonFile(
				"response/cache/locationAvailability.json", LocationAvailabilityRedisCacheDto.class);

		List<Object> cacheResp = new ArrayList<Object>();
		cacheResp.add(locationAvailabilityRedisCacheDto);

		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenReturn(cacheResp);

		Map<String, AvailabilityByProduct> availabilityByLocationMap = new HashMap<String, AvailabilityByProduct>();
		availabilityByLocationMap.put("2152668", TestUtils.buildMockAvailabilityByProduct());

		Mockito.when(yantriksInventoryService.findAvailabilityForCacheMiss(ArgumentMatchers.any(),
				ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any()))
				.thenReturn(availabilityByLocationMap);

		AvailabilityResponseDto availabilityResponseDto = getAvailabilityCacheService
				.getAvailability(inventoryItemsRequestDto, priorityConfig);
		Assert.assertNotNull(availabilityResponseDto);
	}
	
	@Test
	public void getAvailabilityWithMultiLocTest() {
		AvailabilityRequestDto availabilityRequestDto = TestUtils.readObjectFromJsonFile(
				"request/get_availability/GetAvailabilityRequestMultiLoc.json", AvailabilityRequestDto.class);
		InventoryItemsRequestDto inventoryItemsRequestDto = getAvailabilityMapper.convert(availabilityRequestDto,
				applicationConfig);
		PriorityConfig priorityConfig = getAvailabilityConfig.getPriorityConfig(availabilityRequestDto);

		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = TestUtils.readObjectFromJsonFile(
				"response/cache/locationAvailability.json", LocationAvailabilityRedisCacheDto.class);
		List<String> locationAvailabilityKeys = Arrays.asList("locationAvailability_" + locationAvailabilityRedisCacheDto.getProductId()+"_"+locationAvailabilityRedisCacheDto.getLocationId());
		
		List<Object> cacheResp = new ArrayList<Object>();
		cacheResp.add(locationAvailabilityRedisCacheDto);

		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.argThat(arg -> null!=arg && locationAvailabilityKeys.containsAll(arg)))).thenReturn(cacheResp);

		Map<String, AvailabilityByProduct> availabilityByLocationMap = new HashMap<String, AvailabilityByProduct>();
		availabilityByLocationMap.put("2152668", TestUtils.buildMockAvailabilityByProduct());

		Mockito.when(yantriksInventoryService.findAvailabilityForCacheMiss(ArgumentMatchers.any(),
				ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any()))
				.thenReturn(availabilityByLocationMap);

		AvailabilityResponseDto availabilityResponseDto = getAvailabilityCacheService
				.getAvailability(inventoryItemsRequestDto, priorityConfig);
		Assert.assertNotNull(availabilityResponseDto);
	}
	
	@Test
	public void getAvailabilityNoResFromAHTest() {
		AvailabilityRequestDto availabilityRequestDto = TestUtils.readObjectFromJsonFile(
				"request/get_availability/GetAvailabilityRequestMultiLoc.json", AvailabilityRequestDto.class);
		InventoryItemsRequestDto inventoryItemsRequestDto = getAvailabilityMapper.convert(availabilityRequestDto,
				applicationConfig);
		PriorityConfig priorityConfig = getAvailabilityConfig.getPriorityConfig(availabilityRequestDto);

		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = TestUtils.readObjectFromJsonFile(
				"response/cache/locationAvailability.json", LocationAvailabilityRedisCacheDto.class);
		List<String> locationAvailabilityKeys = Arrays.asList("locationAvailability_" + locationAvailabilityRedisCacheDto.getProductId()+"_"+locationAvailabilityRedisCacheDto.getLocationId());
		
		List<Object> cacheResp = new ArrayList<Object>();
		cacheResp.add(locationAvailabilityRedisCacheDto);

		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.argThat(arg -> null!=arg && locationAvailabilityKeys.containsAll(arg)))).thenReturn(cacheResp);

		AvailabilityResponseDto availabilityResponseDto = getAvailabilityCacheService
				.getAvailability(inventoryItemsRequestDto, priorityConfig);
		Assert.assertNotNull(availabilityResponseDto);
	}
	
	@Test
	public void getAvailabilityNoResFromCacheTest() {
		AvailabilityRequestDto availabilityRequestDto = TestUtils.readObjectFromJsonFile(
				"request/get_availability/GetAvailabilityRequestMultiLoc.json", AvailabilityRequestDto.class);
		InventoryItemsRequestDto inventoryItemsRequestDto = getAvailabilityMapper.convert(availabilityRequestDto,
				applicationConfig);
		PriorityConfig priorityConfig = getAvailabilityConfig.getPriorityConfig(availabilityRequestDto);
		AvailabilityResponseDto availabilityResponseDto = getAvailabilityCacheService
				.getAvailability(inventoryItemsRequestDto, priorityConfig);
		Assert.assertNotNull(availabilityResponseDto);
	}
	
	@Test
	public void getAvailabilityExceptionCacheTest() {
		AvailabilityRequestDto availabilityRequestDto = TestUtils.readObjectFromJsonFile(
				"request/get_availability/GetAvailabilityRequestMultiLoc.json", AvailabilityRequestDto.class);
		InventoryItemsRequestDto inventoryItemsRequestDto = getAvailabilityMapper.convert(availabilityRequestDto,
				applicationConfig);
		PriorityConfig priorityConfig = getAvailabilityConfig.getPriorityConfig(availabilityRequestDto);

		//Mockito.doThrow(new CacheException()).when(cacheService).getCacheItems(ArgumentMatchers.any(),
		//		ArgumentMatchers.any());
		
		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenThrow(new CacheException());

		AvailabilityResponseDto availabilityResponseDto = getAvailabilityCacheService
				.getAvailability(inventoryItemsRequestDto, priorityConfig);
		Assert.assertNotNull(availabilityResponseDto);
	}
	
}
