package com.sephora.services.inventoryavailability.mapping;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestLocation;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestProduct;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemRequestDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.model.dto.Location;
import org.junit.Assert;
import org.junit.Test;
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
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@ComponentScan(basePackageClasses = {GetAvailabilityMapper.class, InventoryApplicationConfig.class})
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
public class GetAvailabilityMapperTests {

    @Autowired
    private GetAvailabilityMapper getAvailabilityMapper;

    @Autowired
    private InventoryApplicationConfig config;

    @Test
    public void testAvailabilityRequestConversion(){
        AvailabilityRequestDto availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        InventoryItemsRequestDto inventoryItemsRequestDto = getAvailabilityMapper.convert(availabilityRequestDto,
                config);
        Assert.assertEquals(availabilityRequestDto.getSellingChannel(), inventoryItemsRequestDto.getSellingChannel());
        Assert.assertEquals(availabilityRequestDto.getTransactionType(), inventoryItemsRequestDto.getTransactionType());
        AvailabilityRequestProduct availabilityRequestProduct = availabilityRequestDto.getProducts().get(0);
        InventoryItemRequestDto inventoryItemRequestDto = inventoryItemsRequestDto.getProducts().get(0);
        Assert.assertEquals(availabilityRequestProduct.getProductId(), inventoryItemRequestDto.getProductId());
        Assert.assertEquals(availabilityRequestProduct.getUom(), inventoryItemRequestDto.getUom());
        AvailabilityRequestLocation availabilityRequestLocation = availabilityRequestProduct.getLocations().get(0);
        Location location = inventoryItemRequestDto.getLocations().get(0);
        Assert.assertEquals(availabilityRequestLocation.getLocationId(), location.getLocationId());
    }
}
