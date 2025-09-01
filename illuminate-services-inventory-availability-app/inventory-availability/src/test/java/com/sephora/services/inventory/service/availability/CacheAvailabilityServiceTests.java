
package com.sephora.services.inventory.service.availability;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.*;

import javax.cache.CacheException;

import org.junit.Test;
import org.junit.jupiter.api.Assertions;
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
import org.springframework.data.redis.core.RedisTemplate;
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
import com.sephora.services.inventory.service.availability.impl.AvailabilityHubAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.CacheAvailabilityService;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.config.GetAvailabilityConfig;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.mapping.GetAvailabilityMapper;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;

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

@ContextConfiguration(classes = { AvailabilityConfig.class, InventoryApplicationConfig.class,
		AvailabilityHubAsyncConfig.class, RequestLoggingFilterConfig.class, ApplicationUtils.class,
		AvailabilityHubMissConfiguration.class, GetAvailabilityConfig.class,
		GetAvailabilityMapper.class }, initializers = ConfigDataApplicationContextInitializer.class)

/**
 * Test for CacheAvailabilityService used in GetAvailabilityForSitePage
 * 
 * @author 
 *
 */
public class CacheAvailabilityServiceTests {

	@Autowired
	CacheAvailabilityService cacheAvailabilityService;
	
	@MockBean
	private CacheService cacheService;

	@MockBean(answer = Answers.RETURNS_DEEP_STUBS)
	@Qualifier("redisInventoryServiceTemplate")
	private RedisTemplate<String, Object> invRedisTemplate;

	@MockBean
	@Qualifier("AvailabilityHubAvailabilityService")
	private AvailabilityService availabilityHubAvailabilityService;

	@MockBean
	@Qualifier("ReaddClusterAHAvailabilityHubService")
	private AvailabilityService readdClusterAHAvailabilityHubService;

	@MockBean
	private AvailabilityHubMissConfiguration availabilityHubMissConfiguration;

	@MockBean
	private GetAvailabilityForSitePagesConfig getAvailabilityForSitePagesConfig;

	@Test 
	public void testGetAvailabiliyCacheHit() { 
		SitePageAvailabilityDto	sitePageAvailabilityDto = TestUtils.readObjectFromJsonFile("request/GetAvailabilityForSitePagesRquest.json",SitePageAvailabilityDto.class); 
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto111016_0058 = TestUtils.readObjectFromJsonFile("response/cache/111016_0058.json", LocationAvailabilityRedisCacheDto.class); LocationAvailabilityRedisCacheDto
		locationAvailabilityRedisCacheDto111017_0058 = TestUtils.readObjectFromJsonFile("response/cache/111017_0058.json", LocationAvailabilityRedisCacheDto.class); 
		List<String> priorityOrder = Arrays.asList("CACHE", "AVAILABILITY_HUB");
		
		List<Object> cacheItems = new ArrayList<Object>();
		cacheItems.add(locationAvailabilityRedisCacheDto111016_0058);
		cacheItems.add(locationAvailabilityRedisCacheDto111017_0058);
		
		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenReturn(cacheItems);
		
		Mockito.when(getAvailabilityForSitePagesConfig.isUseRedisTemplate()).thenReturn(true);

		cacheAvailabilityService.setRequestOrigin("PDP"); Map<String,
				AvailabilityByProduct> availabilityByProductMap = cacheAvailabilityService.getAvailabiliy(
						new HashSet(sitePageAvailabilityDto.getProducts()), sitePageAvailabilityDto.getSellingChannel(),
						false, sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getLocations(),
						sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getFulfillmentType(), true,
						priorityOrder);
		
		assertNotNull(availabilityByProductMap);
		assertEquals(sitePageAvailabilityDto.getProducts().size(),
		availabilityByProductMap.size()); 
	}
	
	@Test
	public void testGetAvailabiliyCacheMiss() {
		SitePageAvailabilityDto sitePageAvailabilityDto = TestUtils.readObjectFromJsonFile(
				"request/GetAvailabilityForSitePagesRquest.json", SitePageAvailabilityDto.class);
		List<String> priorityOrder = Arrays.asList("CACHE", "AVAILABILITY_HUB");

		Map<String, AvailabilityByLocation> availabilityByLocationMap = new HashMap<String, AvailabilityByLocation>();
		availabilityByLocationMap.put("111017", AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build());
		availabilityByLocationMap.put("111016", AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build());

		AvailabilityHubAvailabilityService ahAvailabilityService = Mockito.mock(AvailabilityHubAvailabilityService.class);

		Mockito.when(availabilityHubAvailabilityService.clone()).thenReturn(ahAvailabilityService);
		Mockito.when(ahAvailabilityService.findAvailabilityForCacheMiss(ArgumentMatchers.any(), ArgumentMatchers.any(),
				ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(availabilityByLocationMap);

		cacheAvailabilityService.setRequestOrigin("PDP");
		Map<String, AvailabilityByProduct> availabilityByProductMap = cacheAvailabilityService.getAvailabiliy(
				new HashSet(sitePageAvailabilityDto.getProducts()), sitePageAvailabilityDto.getSellingChannel(), false,
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getLocations(),
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getFulfillmentType(), true,
				priorityOrder);
		assertNotNull(availabilityByProductMap);
		assertEquals(sitePageAvailabilityDto.getProducts().size(), availabilityByProductMap.size());
	}
	
	@Test 
	public void testGetAvailabiliyCacheMissAndAHmiss() {
		SitePageAvailabilityDto sitePageAvailabilityDto = TestUtils.readObjectFromJsonFile("request/GetAvailabilityForSitePagesRquest.json", SitePageAvailabilityDto.class); 
		List<String> priorityOrder = Arrays.asList("CACHE", "AVAILABILITY_HUB");
		
		Map<String, AvailabilityByLocation> availabilityByLocationMap = new	HashMap<String, AvailabilityByLocation>();
		availabilityByLocationMap.put("111017", AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build()); 
		availabilityByLocationMap.put("111016", AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build());
		
		AvailabilityHubAvailabilityService ahAvailabilityService = Mockito.mock(AvailabilityHubAvailabilityService.class);
		
		Mockito.when(availabilityHubAvailabilityService.clone()).thenReturn(ahAvailabilityService);
		Mockito.when(ahAvailabilityService.findAvailabilityForCacheMiss(ArgumentMatchers.any(), ArgumentMatchers.any(),
				ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(availabilityByLocationMap);
		
		cacheAvailabilityService.setRequestOrigin("PDP"); 
		Map<String, AvailabilityByProduct> availabilityByProductMap = cacheAvailabilityService.getAvailabiliy(
				new HashSet(sitePageAvailabilityDto.getProducts()), sitePageAvailabilityDto.getSellingChannel(), false,
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getLocations(),
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getFulfillmentType(), true,
				priorityOrder);
		
		assertNotNull(availabilityByProductMap);
		assertEquals(sitePageAvailabilityDto.getProducts().size(),
		availabilityByProductMap.size()); }
	
	@Test
	public void testGetAvailabiliyCacheHitAndMiss() {
		SitePageAvailabilityDto sitePageAvailabilityDto = TestUtils.readObjectFromJsonFile(
				"request/GetAvailabilityForSitePagesRquest.json", SitePageAvailabilityDto.class);
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto = TestUtils
				.readObjectFromJsonFile("response/cache/111016_0058.json", LocationAvailabilityRedisCacheDto.class);
		List<String> priorityOrder = Arrays.asList("CACHE", "AVAILABILITY_HUB");

		List<Object> cacheItems = new ArrayList<Object>();
		cacheItems.add(locationAvailabilityRedisCacheDto);
		
		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenReturn(cacheItems);

		Map<String, AvailabilityByLocation> availabilityByLocationMap = new HashMap<String, AvailabilityByLocation>();
		availabilityByLocationMap.put("111017", TestUtils.buildMockAvailabilityByLocation());

		AvailabilityHubAvailabilityService ahAvailabilityService = Mockito.mock(AvailabilityHubAvailabilityService.class);

		Mockito.when(availabilityHubAvailabilityService.clone()).thenReturn(ahAvailabilityService);
		Mockito.when(ahAvailabilityService.findAvailabilityForCacheMiss(ArgumentMatchers.any(), ArgumentMatchers.any(),
				ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(availabilityByLocationMap);

		cacheAvailabilityService.setRequestOrigin("PDP");
		Map<String, AvailabilityByProduct> availabilityByProductMap = cacheAvailabilityService.getAvailabiliy(
				new HashSet(sitePageAvailabilityDto.getProducts()), sitePageAvailabilityDto.getSellingChannel(), false,
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getLocations(),
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getFulfillmentType(), true,
				priorityOrder);
		assertNotNull(availabilityByProductMap);
		assertEquals(sitePageAvailabilityDto.getProducts().size(), availabilityByProductMap.size());
	}
	
	@Test
	public void testGetAvailabiliyCacheWithMultiLoc() {
		SitePageAvailabilityDto sitePageAvailabilityDto = TestUtils.readObjectFromJsonFile(
				"request/GetAvailabilityForSitePagesRquestWithMulLoc.json", SitePageAvailabilityDto.class);
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto111016_0058 = TestUtils
				.readObjectFromJsonFile("response/cache/111016_0058.json", LocationAvailabilityRedisCacheDto.class);
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto111016_1001 = TestUtils
				.readObjectFromJsonFile("response/cache/111016_1001.json", LocationAvailabilityRedisCacheDto.class);
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto111017_0058 = TestUtils
				.readObjectFromJsonFile("response/cache/111017_0058.json", LocationAvailabilityRedisCacheDto.class);
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto111017_1001 = TestUtils
				.readObjectFromJsonFile("response/cache/111017_1001.json", LocationAvailabilityRedisCacheDto.class);
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto111018_0058 = TestUtils
				.readObjectFromJsonFile("response/cache/111018_1001.json", LocationAvailabilityRedisCacheDto.class);
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto111018_1001 = TestUtils
				.readObjectFromJsonFile("response/cache/111018_0058.json", LocationAvailabilityRedisCacheDto.class);

		List<Object> cacheResp0058 = new ArrayList<Object>();
		cacheResp0058.add(locationAvailabilityRedisCacheDto111016_0058);
		cacheResp0058.add(locationAvailabilityRedisCacheDto111017_0058);
		cacheResp0058.add(locationAvailabilityRedisCacheDto111018_0058);
		
		List<String> keyList_0058 = Arrays.asList("locationAvailability_111016_0058", "locationAvailability_111017_0058", "locationAvailability_111018_0058");

		List<Object> cacheResp1001 = new ArrayList<Object>();
		cacheResp1001.add(locationAvailabilityRedisCacheDto111016_1001);
		cacheResp1001.add(locationAvailabilityRedisCacheDto111017_1001);
		cacheResp1001.add(locationAvailabilityRedisCacheDto111018_1001);
		List<String> keyList_1001 = Arrays.asList("locationAvailability_111016_1001", "locationAvailability_111017_1001", "locationAvailability_111018_1001");

		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.argThat(arg -> null!=arg && keyList_0058.containsAll(arg)))).thenReturn(cacheResp0058);
		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.argThat(arg -> null!=arg && keyList_1001.containsAll(arg)))).thenReturn(cacheResp1001);	
		Mockito.when(getAvailabilityForSitePagesConfig.isUseRedisTemplate()).thenReturn(true);

		List<String> priorityOrder = Arrays.asList("CACHE", "AVAILABILITY_HUB");
		cacheAvailabilityService.setRequestOrigin("PDP");
		Map<String, AvailabilityByProduct> availabilityByProductMap = cacheAvailabilityService.getAvailabiliy(
				new HashSet(sitePageAvailabilityDto.getProducts()), sitePageAvailabilityDto.getSellingChannel(), false,
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getLocations(),
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getFulfillmentType(), true,
				priorityOrder);

		assertNotNull(availabilityByProductMap);
		assertEquals(sitePageAvailabilityDto.getProducts().size(), availabilityByProductMap.size());

		Map<String, AvailabilityByProduct> availabilityByProductMapNoDetails = cacheAvailabilityService.getAvailabiliy(
				new HashSet(sitePageAvailabilityDto.getProducts()), sitePageAvailabilityDto.getSellingChannel(), false,
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getLocations(),
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getFulfillmentType(), false,
				priorityOrder);

		assertNotNull(availabilityByProductMapNoDetails);
		assertEquals(sitePageAvailabilityDto.getProducts().size(), availabilityByProductMapNoDetails.size());
	}
	
	@Test
	public void getAvailabilityExceptionCacheTest() {
		SitePageAvailabilityDto sitePageAvailabilityDto = TestUtils.readObjectFromJsonFile("request/GetAvailabilityForSitePagesRquest.json", SitePageAvailabilityDto.class);
		List<String> priorityOrder = Arrays.asList("CACHE", "AVAILABILITY_HUB");

		Mockito.when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenThrow(new CacheException("Mocked cache exception"));

		Map<String, AvailabilityByLocation> availabilityByLocationMap = new HashMap<String, AvailabilityByLocation>();
		availabilityByLocationMap.put("111017", AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build());
		availabilityByLocationMap.put("111016", AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build());

		AvailabilityHubAvailabilityService ahAvailabilityService = Mockito.mock(AvailabilityHubAvailabilityService.class);

		Mockito.when(availabilityHubAvailabilityService.clone()).thenReturn(ahAvailabilityService);
		Mockito.when(ahAvailabilityService.findAvailabilityForCacheMiss(ArgumentMatchers.anyList(), ArgumentMatchers.anyString(),
				ArgumentMatchers.anyString(), ArgumentMatchers.anyString())).thenReturn(availabilityByLocationMap);

		cacheAvailabilityService.setRequestOrigin("PDP");
		Map<String, AvailabilityByProduct> availabilityByProductMap = cacheAvailabilityService.getAvailabiliy(
				new HashSet(sitePageAvailabilityDto.getProducts()), sitePageAvailabilityDto.getSellingChannel(), false,
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getLocations(),
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getFulfillmentType(), true,
				priorityOrder);
		assertNotNull(availabilityByProductMap);
		assertEquals(sitePageAvailabilityDto.getProducts().size(), availabilityByProductMap.size());
	}
	@Test
	public void testGetAvailabiliyMergeCache() {
		SitePageAvailabilityDto sitePageAvailabilityDto = TestUtils.readObjectFromJsonFile(
				"request/GetAvailabilityForSitePagesRquest.json", SitePageAvailabilityDto.class);
		List<String> priorityOrder = Arrays.asList("CACHE", "AVAILABILITY_HUB");

		Map<String, AvailabilityByLocation> availabilityByLocationMap = new HashMap<String, AvailabilityByLocation>();
		availabilityByLocationMap.put("111017", AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build());
		availabilityByLocationMap.put("111016", AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build());

		AvailabilityHubAvailabilityService ahAvailabilityService = Mockito.mock(AvailabilityHubAvailabilityService.class);

		Mockito.when(availabilityHubAvailabilityService.clone()).thenReturn(ahAvailabilityService);
		Mockito.when(ahAvailabilityService.findAvailabilityForCacheMiss(ArgumentMatchers.any(), ArgumentMatchers.any(),
				ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(availabilityByLocationMap);
		LocationAvailabilityRedisCacheDto locationAvailabilityRedisCacheDto111016_0058 = TestUtils.readObjectFromJsonFile("response/cache/111016_0058.json", LocationAvailabilityRedisCacheDto.class);
		Mockito.when(cacheService.getCacheItem(Mockito.any(), Mockito.any())).thenReturn(locationAvailabilityRedisCacheDto111016_0058);

		cacheAvailabilityService.setRequestOrigin("PDP");
		Map<String, AvailabilityByProduct> availabilityByProductMap = cacheAvailabilityService.getAvailabiliy(
				new HashSet(sitePageAvailabilityDto.getProducts()), sitePageAvailabilityDto.getSellingChannel(), false,
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getLocations(),
				sitePageAvailabilityDto.getLocationsByFulfillmentType().get(0).getFulfillmentType(), true,
				priorityOrder);
		assertNotNull(availabilityByProductMap);
		//assertEquals(sitePageAvailabilityDto.getProducts().size(), availabilityByProductMap.size());
	}


	@Test
	public void testClone(){
		CacheAvailabilityService output = cacheAvailabilityService.clone();
		Assertions.assertNotNull(output);
	}
	@Test
	public void testGetCacheMissMap() {
		Map<String, Map<String, Set<String>>> output = cacheAvailabilityService.getCacheMissMap();
		Assertions.assertNotNull(output);
	}
}
