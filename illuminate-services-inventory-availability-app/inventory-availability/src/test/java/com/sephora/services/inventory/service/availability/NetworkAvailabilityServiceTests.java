package com.sephora.services.inventory.service.availability;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
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
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.services.availabilityhub.client.AvailabilityHubAsyncConfig;
import com.sephora.services.inventory.model.networkThreshold.redis.NetworkThresholdCacheDto;
import com.sephora.services.inventory.service.availability.impl.AvailabilityHubAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.NetworkAvailabilityServiceImpl;
import com.sephora.services.inventoryavailability.AvailabilityConfig;

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
@ContextConfiguration(loader = AnnotationConfigContextLoader.class, classes = { AvailabilityConfig.class,
		AvailabilityHubAsyncConfig.class, NetworkAvailabilityServiceImpl.class}, initializers = ConfigDataApplicationContextInitializer.class)
public class NetworkAvailabilityServiceTests {
	@Autowired
	NetworkAvailabilityService networkAvailabilityService;
	
	@MockBean(answer = Answers.RETURNS_DEEP_STUBS)
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;
	
	@MockBean
	@Qualifier("AvailabilityHubAvailabilityService")
	private AvailabilityService availabilityHubAvailabilityService;
	
	@Test
	public void testGetNetworkAvailability() {
		List<String> priorityList = Arrays.asList("CACHE", "AVAILABILITY_HUB");
		List<String> products = Arrays.asList("123456", "321456");
		List<Object> cacheData = new ArrayList<Object>();
		cacheData.add(NetworkThresholdCacheDto.builder().productId("123456").atp(1000D).atpStatus("INSTOCK").build());
		cacheData.add(NetworkThresholdCacheDto.builder().productId("321456").atp(1500D).atpStatus("INSTOCK").build());
		
		when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenReturn(cacheData);
		
		networkAvailabilityService.getNetworkAvailability(products, "SEPHORAUS", priorityList);
	}
	
	@Test
	public void testGetNetworkAvailabilityWithMissingCacheItem() {
		List<String> priorityList = Arrays.asList("CACHE", "AVAILABILITY_HUB");
		List<String> products = Arrays.asList("123456", "321456");
		List<Object> cacheData = new ArrayList<Object>();
		cacheData.add(NetworkThresholdCacheDto.builder().productId("123456").atp(1000D).atpStatus("INSTOCK").build());
	
		AvailabilityHubAvailabilityService ahAvailabilityService = Mockito.mock(AvailabilityHubAvailabilityService.class);
		when(availabilityHubAvailabilityService.clone()).thenReturn(ahAvailabilityService);
		
		Map<String, NetworkThresholdCacheDto> netWorkAvailabilityFromAhMap = new HashMap<String, NetworkThresholdCacheDto>();
		netWorkAvailabilityFromAhMap.put("123456", NetworkThresholdCacheDto.builder().productId("321456").atp(1500D).atpStatus("INSTOCK").build());
		when(ahAvailabilityService.getNetworkAvailability(ArgumentMatchers.anyList(), ArgumentMatchers.anyString(), ArgumentMatchers.anyBoolean())).thenReturn(netWorkAvailabilityFromAhMap);
		
		when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenReturn(cacheData);
		
		networkAvailabilityService.getNetworkAvailability(products, "SEPHORAUS", priorityList);
	}
	
	@Test
	public void testGetNetworkAvailabilityWithMissingCacheAndAh() {
		List<String> priorityList = Arrays.asList("CACHE", "AVAILABILITY_HUB");
		List<String> products = Arrays.asList("123456", "321456");
		List<Object> cacheData = new ArrayList<Object>();
		cacheData.add(NetworkThresholdCacheDto.builder().productId("123456").atp(1000D).atpStatus("INSTOCK").build());
	
		AvailabilityHubAvailabilityService ahAvailabilityService = Mockito.mock(AvailabilityHubAvailabilityService.class);
		when(availabilityHubAvailabilityService.clone()).thenReturn(ahAvailabilityService);
		
		Map<String, NetworkThresholdCacheDto> netWorkAvailabilityFromAhMap = new HashMap<String, NetworkThresholdCacheDto>();
		//netWorkAvailabilityFromAhMap.put("123456", NetworkThresholdCacheDto.builder().productId("321456").atp(1500D).atpStatus("INSTOCK").build());
		when(ahAvailabilityService.getNetworkAvailability(ArgumentMatchers.anyList(), ArgumentMatchers.anyString(), ArgumentMatchers.anyBoolean())).thenReturn(netWorkAvailabilityFromAhMap);
		
		when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenReturn(cacheData);
		
		networkAvailabilityService.getNetworkAvailability(products, "SEPHORAUS", priorityList);
	}
	
	@Test
	public void testGetNetworkAvailabilityWithCacheOnly() {
		List<String> priorityList = Arrays.asList("CACHE");
		List<String> products = Arrays.asList("123456", "321456");
		List<Object> cacheData = new ArrayList<Object>();
		cacheData.add(NetworkThresholdCacheDto.builder().productId("123456").atp(1000D).atpStatus("INSTOCK").build());
		
		when(invRedisTemplate.opsForValue().multiGet(ArgumentMatchers.anyCollection())).thenReturn(cacheData);
		
		networkAvailabilityService.getNetworkAvailability(products, "SEPHORAUS", priorityList);
	}
}
