package com.sephora.services.inventoryavailability.mapping;

import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.Test;

import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.*;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.model.Location;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyCallerResponse;

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
@ContextConfiguration(classes = { AvailabilityConfig.class}, initializers = ConfigDataApplicationContextInitializer.class)
@TestPropertySource("classpath:application-test.yaml")
public class GetInventorySupplyMapperTests {
	@Autowired
	GetInventorySupplyMapper getInventorySupplyMapper;
	
	@Test
	public void testGetInventorySupplyMapper() {
		GetInventorySupplyAHResponse response = TestUtils.getSearchInventorySupplyAHResponseFromConstants();
		
		GetInventorySupplyCallerResponse callerResponse = getInventorySupplyMapper.convert(response);
		
		assertEquals(callerResponse.getProductId(), PRODUCT_ID);
		assertEquals(callerResponse.getUom(), UOM);
		assertFalse(callerResponse.getInventorySupplies().isEmpty());
		
		if(!callerResponse.getInventorySupplies().isEmpty()) {
			assertFalse(callerResponse.getInventorySupplies().get(0).getLocation().isEmpty());
			if(!callerResponse.getInventorySupplies().get(0).getLocation().isEmpty()) {
				Location location = callerResponse.getInventorySupplies().get(0).getLocation().get(0);
				assertEquals(location.getLocationId(), LOCATION_ID);
				assertFalse(location.getSupplyTypes().isEmpty());
				if(location.getSupplyTypes().isEmpty()) {
					assertEquals(location.getSupplyTypes().get(0).getSupplyType(), SUPPLY_TYPE);
					assertEquals(location.getSupplyTypes().get(0).getQuantity(), QUANTITY);
				}
			}
		}
	}
}
