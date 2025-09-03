package com.sephora.services.sourcingoptions.feign;


import com.sephora.services.sourcingoptions.TestConfig;
import com.sephora.services.sourcingoptions.config.feign.InventoryServiceClientConfiguration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import static com.sephora.services.sourcingoptions.feign.InventoryServiceClientConfigurationTest.INVENTORY_SERVICE_URL;
import static com.sephora.services.sourcingoptions.feign.InventoryServiceClientConfigurationTest.MAX_RETRY_ATTEMPTS;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@EnableConfigurationProperties(InventoryServiceClientConfiguration.class)
@ContextConfiguration(classes = {
    InventoryServiceClientConfiguration.class,
    TestConfig.class
})
@TestPropertySource(properties = {
    "sourcing.options.feign.inventory.serviceUrl=" + INVENTORY_SERVICE_URL,
    "sourcing.options.feign.inventory.retryMaxAttempts=" + MAX_RETRY_ATTEMPTS
})
public class InventoryServiceClientConfigurationTest {

    public static final String INVENTORY_SERVICE_URL = "http://localhost:8099";
    public static final int MAX_RETRY_ATTEMPTS = 5;

    @Autowired
    InventoryServiceClientConfiguration inventoryServiceClientConfiguration;

    @Test
    public void serviceUrlShouldBeSet() {
        assertThat(inventoryServiceClientConfiguration)
                .extracting(InventoryServiceClientConfiguration::getServiceUrl)
                .isEqualTo(INVENTORY_SERVICE_URL);
    }

    @Test
    public void maxRetryCountShouldBeSet() {
        assertThat(inventoryServiceClientConfiguration)
                .extracting(InventoryServiceClientConfiguration::getRetryMaxAttempts)
                .isEqualTo(MAX_RETRY_ATTEMPTS);
    }
}
