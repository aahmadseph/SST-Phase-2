package com.sephora.services.inventoryavailability.mapping;

import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyCallerResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyRequest;

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
public class InventorySupplyMapperTests {
	
	@Autowired
	InventorySupplyMapper inventorySupplyMapper;
	
	@Value("${inventory.defaultEventType:SUPPLY_UPDATE}")
	private String eventType = "SUPPLY_UPDATE";

	@Value("${inventory.defaultOrgId:SEPHORA}")
	String orgId;
	
	@Test
	public void testInventorySupplyRequest() {
		InventorySupplyDTO inventorySupplyDTO = TestUtils.getInventorySupplyFromConstants();
		
		InventorySupplyRequest request = inventorySupplyMapper.convert(inventorySupplyDTO);
		
		assertEquals(request.getOrgId(), orgId);
		assertEquals(request.getEventType(), eventType);
		assertEquals(request.getFeedType(), ADJUSTMENT_TYPE);
		assertEquals(request.getLocationId(), LOCATION_ID);
		assertEquals(request.getProductId(), PRODUCT_ID);
		assertEquals(request.getQuantity(), QUANTITY);
		assertEquals(request.getUom(), UOM);
		assertEquals(request.getUpdateTimeStamp(), UPDATE_TIME_STAMP);
		assertEquals(request.getLocationType(), "DC");
		assertEquals(request.getTo().getSupplyType(), SUPPLY_TYPE);
		assertEquals(request.getAudit().getTransactionUser(), UPDATE_USER);
		assertEquals(request.getAudit().getTransactionSystem(), REQUEST_ORGIN);
	}
	
	@Test
	public void testInventorySupplyAHResponseToCallerResponse() {
		InventorySupplyAHResponse response= TestUtils.getInventorySupplyAHResponseFromConstants();
		InventorySupplyCallerResponse callerResponse = inventorySupplyMapper.convert(response);
		
		assertEquals(callerResponse.getProductId(), PRODUCT_ID);
		assertEquals(callerResponse.getUom(), UOM);
		assertEquals(callerResponse.getSupplyType(), SUPPLY_TYPE);
		assertEquals(callerResponse.getQuantity(), QUANTITY);
	}
	
	@Test
	public void testInventorySupplyAHResponseToCallerResponseWithNull() {
		InventorySupplyAHResponse response= TestUtils.getInventorySupplyAHResponseFromConstants();
		//to test null value for PhysicalInventory
		response.setPhysicalInventory(null);
		InventorySupplyCallerResponse callerResponse = inventorySupplyMapper.convert(response);
		
		assertEquals(callerResponse.getProductId(), PRODUCT_ID);
		assertEquals(callerResponse.getUom(), UOM);
		assertEquals(callerResponse.getSupplyType(), "");
		assertEquals(callerResponse.getQuantity(), 0D);
		
		response= TestUtils.getInventorySupplyAHResponseFromConstants();
		//to test null value for Locations
		response.getPhysicalInventory().get(0).setLocations(null);
		callerResponse = inventorySupplyMapper.convert(response);
		
		assertEquals(callerResponse.getProductId(), PRODUCT_ID);
		assertEquals(callerResponse.getUom(), UOM);
		assertEquals(callerResponse.getSupplyType(), "");
		assertEquals(callerResponse.getQuantity(), 0D);
		
		response= TestUtils.getInventorySupplyAHResponseFromConstants();
		//to test null value for SupplyTypes
		response.getPhysicalInventory().get(0).getLocations().get(0).setSupplyTypes(null);
		callerResponse = inventorySupplyMapper.convert(response);
		
		assertEquals(callerResponse.getProductId(), PRODUCT_ID);
		assertEquals(callerResponse.getUom(), UOM);
		assertEquals(callerResponse.getSupplyType(), "");
		assertEquals(callerResponse.getQuantity(), 0D);
	}
}
