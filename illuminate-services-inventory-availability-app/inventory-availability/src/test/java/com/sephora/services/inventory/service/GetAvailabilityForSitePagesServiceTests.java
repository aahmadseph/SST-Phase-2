package com.sephora.services.inventory.service;

import com.sephora.platform.cache.service.CacheService;
import com.sephora.services.availabilityhub.client.AvailabilityHubReadClusterClient;
import com.sephora.services.common.dynamicconfig.model.DynamicConfigDto;
import com.sephora.services.common.dynamicconfig.service.DynamicConfigService;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.config.GetAvailabilityForSitePagesConfig;
import com.sephora.services.inventory.config.MockSitePagesConfiguration;
import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.model.networkThreshold.redis.ProductAvailability;
import com.sephora.services.inventory.service.availability.AvailabilityService;
import com.sephora.services.inventory.service.availability.NetworkAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.AvailabilityHubAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.CacheAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.CosmosDbAvailabilityService;
import com.sephora.services.inventory.validation.GetAavailabilityFSValidator;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.SitePageAvailabilityResponse;
import com.sephora.services.inventoryavailability.service.MockAvailabilityBySitePagesService;
import io.opentracing.contrib.spring.cloud.redis.RedisAutoConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.*;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest
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
@ContextConfiguration(loader = AnnotationConfigContextLoader.class, classes = {
		AvailabilityConfig.class, GetAvailabilityForSitePagesService.class,GetAavailabilityFSValidator.class}, initializers = ConfigDataApplicationContextInitializer.class)
@ComponentScan(basePackages = { "com.sephora.services.common.inventory.validators" })

@TestPropertySource("classpath:application-test.yaml")
@MockBeans({
		@MockBean(CacheAvailabilityService.class),
		@MockBean(AvailabilityHubAvailabilityService.class),
		@MockBean(CosmosDbAvailabilityService.class),
		@MockBean(AvailabilityHubReadClusterClient.class),
		@MockBean(NetworkAvailabilityService.class),
		@MockBean(DynamicConfigService.class),
		@MockBean(MockAvailabilityBySitePagesService.class),
		@MockBean(MockSitePagesConfiguration.class),
		@MockBean(AvailabilityHubMissConfiguration.class) })
@Slf4j
public class GetAvailabilityForSitePagesServiceTests {

	@Autowired
	GetAvailabilityForSitePagesService getAvailabilityForSitePagesService;

	@MockBean
	CacheService cacheService;

	@MockBean
	CacheAvailabilityService cacheAvailabilityService;

	@MockBean
	@Qualifier("AvailabilityHubAvailabilityService")
	AvailabilityService availabilityHubAvailabilityService;

	@MockBean
	@Qualifier("CosmosDbAvailabilityService")
	AvailabilityService cosmosDbAvailabilityService;
	
	@MockBean
	@Qualifier("ReaddClusterAHAvailabilityHubService")
	private AvailabilityService readdClusterAHAvailabilityHubService;
	
	@MockBean
	DynamicConfigService dynamicConfigService;
	
	@MockBean
	GetAvailabilityForSitePagesConfig getAvailabilityForSitePagesConfig;

	private final static String TEST_PRODUCT = "testProduct";

	@Test
	public void testGetAvailability() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		setUpMockito();
		when(getAvailabilityForSitePagesConfig.rampUpEnabled(Mockito.anyString())).thenReturn(true);
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfig());

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);				
	}

	private void setUpMockito() {
		CacheAvailabilityService cacheAvailabilityServiceClone = Mockito.mock(CacheAvailabilityService.class);
		Map<String, AvailabilityByProduct> availabilityByProductMap = new HashMap<>();
		availabilityByProductMap.put(TEST_PRODUCT, getMockAvailabilityByProduct());

		when(cacheAvailabilityService.clone()).thenReturn(cacheAvailabilityServiceClone);
		when(cacheAvailabilityServiceClone.getAvailabiliy(ArgumentMatchers.anySet(), ArgumentMatchers.anyString(), ArgumentMatchers.anyBoolean(),
				ArgumentMatchers.anyList(), ArgumentMatchers.anyString(), ArgumentMatchers.anyBoolean(), ArgumentMatchers.anyList())).thenReturn(availabilityByProductMap);

		when(getAvailabilityForSitePagesConfig.rampUpEnabled(Mockito.anyString())).thenReturn(true);
	}

	@Test
	public void testGetAvailabilityWithDynmicConfigDto() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		setUpMockito();
		when(dynamicConfigService.get(Mockito.any(), Mockito.any())).thenReturn(prepreDynamicConfigDto());
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfig());
		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}

	@Test
	public void testGetAvailabilityWithDynmicConfigDtoException() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		setUpMockito();
		when(dynamicConfigService.get(Mockito.any(), Mockito.any())).thenThrow(new RuntimeException(""));
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfig());

		getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);
	}
	private DynamicConfigDto<Object> prepreDynamicConfigDto() {
		DynamicConfigDto dto = new DynamicConfigDto();
		LinkedHashMap mp = new LinkedHashMap();
		mp.put("fulfillmentType", "PICK");
		mp.put("storeIds", Arrays.asList("0058"));
		dto.setConfigValue(Arrays.asList(mp));
		return dto;
	}

	@Test
	public void testGetAvailabilityExcep() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		setUpMockito();
		when(getAvailabilityForSitePagesConfig.rampUpEnabled(Mockito.anyString())).thenReturn(true);
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfig());

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}

	@Test
	public void testGetAvailabilityPriorityOrderAvailabilityHub() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		setUpMockito();
		AvailabilityHubAvailabilityService availabilityHubAvailabilityServiceClone = Mockito.mock(AvailabilityHubAvailabilityService.class);
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfigAvailabilityHub());
		when(availabilityHubAvailabilityService.clone()).thenReturn(availabilityHubAvailabilityServiceClone);

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}
	@Test
	public void testGetAvailabilityPriorityOrderAvailabilityHubForShip() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		setUpMockito();
		AvailabilityHubAvailabilityService availabilityHubAvailabilityServiceClone = Mockito.mock(AvailabilityHubAvailabilityService.class);
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfigAvailabilityHub());
		when(availabilityHubAvailabilityService.clone()).thenReturn(availabilityHubAvailabilityServiceClone);

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}

	@Test
	public void testGetAvailabilityPriorityOrderNull() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		setUpMockito();

		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfigWithOrderNull());

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}

	@Test
	public void testGetAvailabilityPriorityConfigNull() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		setUpMockito();
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(null);

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}
	@Test
	public void testGetAvailabilityProcessGetAavailabilityRequest() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE_SHIP,SitePageAvailabilityDto.class);
		setUpMockito();
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(null);

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}

	@Test
	public void testGetAvailabilityProcessGetAavailabilityRequestWithPriorityOrderCache() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE_SHIP,SitePageAvailabilityDto.class);
		setUpMockito();
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfig());

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}

	@Test
	public void testGetAvailabilityProcessGetAavailabilityRequestWithPriorityOrderAvHub() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE_SHIP,SitePageAvailabilityDto.class);
		setUpMockito();
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(getMockedPriorityConfigAvailabilityHub());
		AvailabilityHubAvailabilityService availabilityHubAvailabilityServiceClone = Mockito.mock(AvailabilityHubAvailabilityService.class);
		when(availabilityHubAvailabilityService.clone()).thenReturn(availabilityHubAvailabilityServiceClone);

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);

		assertNotNull(sitePageAvailabilityResponse);
	}

	@Test
	public void testGetAvailabilityProcessBatchAsycException() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE_SHIP,SitePageAvailabilityDto.class);
		setUpMockito();
		when(getAvailabilityForSitePagesConfig.getPriorityOrder(ArgumentMatchers.any(), ArgumentMatchers.any())).thenThrow(new RuntimeException("test"));
		try {
			getAvailabilityForSitePagesService.getAvailability(availabilityDto, true);
		} catch (Exception e) {
			log.error("An exception occurred while getting availability for site pages", e);
			e.printStackTrace();
		}
	}
	private PriorityConfig getMockedPriorityConfig() {
		PriorityConfig priorityConfig = new PriorityConfig();
		priorityConfig.setPriorityOrder(Arrays.asList("CACHE"));
		return priorityConfig;
	}

	private PriorityConfig getMockedPriorityConfigAvailabilityHub() {
		PriorityConfig priorityConfig = new PriorityConfig();
		priorityConfig.setPriorityOrder(Arrays.asList("AVAILABILITY_HUB"));
		return priorityConfig;
	}

	private PriorityConfig getMockedPriorityConfigWithOrderNull() {
		PriorityConfig priorityConfig = new PriorityConfig();
		priorityConfig.setPriorityOrder(null);
		priorityConfig.setAssumedATP(1d);
		priorityConfig.setAssumedATPStatus("INSTOCK");
		return priorityConfig;
	}

	private AvailabilityByProduct getMockAvailabilityByProduct() {
		return AvailabilityByProduct.builder()
				.productId(TEST_PRODUCT)
				.build();
	}

	@Test
	public void testGetAvailabilityWithAssumption() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile
				(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);

		Map<Object, Object> cacheData = new HashMap<>();
		cacheData.put(AVAIABILITY_CACHE_ENTRY_KEY_11113, TestUtils.readObjectFromJsonFile(
				AVAIABILITY_CACHE_ENTRY_FILE_11113, ProductAvailability.class));

		when(cacheService.getCacheItems(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(cacheData);

		SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService
				.getAvailability(availabilityDto,true);

		assertNotNull(sitePageAvailabilityResponse);
		assertNotNull(sitePageAvailabilityResponse.getAvailabilityByProducts());
		if (sitePageAvailabilityResponse.getAvailabilityByProducts() != null) {
			assertEquals(2, sitePageAvailabilityResponse.getAvailabilityByProducts().size());
		}
	}

	@Test
	public void testGetAvailabilityNetworkException() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE,
				SitePageAvailabilityDto.class);
		when(cacheService.getCacheItems(ArgumentMatchers.any(), ArgumentMatchers.any()))
				.thenThrow(new RuntimeException("Mock exception"));
		getAvailabilityForSitePagesService.getAvailability(availabilityDto,true);
	}

	@Test(expected = AvailabilityServiceException.class)
	public void testGetAvailabilityValidationException() throws AvailabilityServiceException {
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE,
				SitePageAvailabilityDto.class);
		availabilityDto.setSellingChannel(null);
		getAvailabilityForSitePagesService.getAvailability(availabilityDto,true);
	}

}
