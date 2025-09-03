package com.sephora.services.inventoryavailability.mapping;

import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.mapping.ItemHoldMapper;
import com.sephora.services.inventoryavailability.model.itemhold.cache.ItemHoldUpdateCacheDto;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateProduct;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateRequestDto;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
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
@ComponentScan(basePackages = "com.sephora.services.inventoryavailability.mapping")
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
public class ItemHoldMapperTests {

    @Autowired
    private ItemHoldMapper itemHoldMapper;

    @Test
    public void testMapper(){
        ItemHoldUpdateRequestDto itemHoldUpdateRequestDto = TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
        ItemHoldUpdateProduct itemHoldUpdateProduct = itemHoldUpdateRequestDto.getProducts().get(0);
        ItemHoldUpdateCacheDto itemHold = itemHoldMapper.convert(itemHoldUpdateProduct, itemHoldUpdateRequestDto.getSellingChannel());
        Assert.assertEquals(itemHoldUpdateProduct.getOnhold(), itemHold.getOnHold());
        Assert.assertEquals(itemHoldUpdateProduct.getProductId(), itemHold.getProductId());
        Assert.assertEquals(itemHoldUpdateRequestDto.getSellingChannel(), itemHold.getSellingChannel());
    }
}
