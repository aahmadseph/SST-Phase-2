package com.sephora.services.sourcingoptions.client;

import com.github.tomakehurst.wiremock.common.ConsoleNotifier;
import com.github.tomakehurst.wiremock.junit.WireMockClassRule;
import com.sephora.services.sourcingoptions.TestConfig;
import com.sephora.services.sourcingoptions.config.feign.InventoryServiceClientConfiguration;
import com.sephora.services.sourcingoptions.model.dto.UpdateShipNodesStatusDto;
import feign.FeignException;
import feign.RetryableException;
import org.hamcrest.FeatureMatcher;
import org.hamcrest.Matcher;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.autoconfigure.RefreshAutoConfiguration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static com.github.tomakehurst.wiremock.http.Fault.CONNECTION_RESET_BY_PEER;
import static com.sephora.services.sourcingoptions.client.InventoryServiceClientTest.INVENTORY_SERVICE_PORT;
import static com.sephora.services.sourcingoptions.client.InventoryServiceClientTest.INVENTORY_SERVICE_URL;
import static com.sephora.services.sourcingoptions.client.InventoryServiceClientTest.MAX_RETRY_ATTEMPTS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

@RunWith(SpringRunner.class)
@EnableConfigurationProperties(InventoryServiceClientConfiguration.class)
@ImportAutoConfiguration(RefreshAutoConfiguration.class)
@ContextConfiguration(classes = {
    InventoryServiceClientConfiguration.class,
    TestConfig.class
})
@TestPropertySource(properties = {
    "sourcing.options.feign.inventory.serviceUrl=" + INVENTORY_SERVICE_URL + ":" + INVENTORY_SERVICE_PORT,
    "sourcing.options.feign.inventory.retryMaxAttempts=" + MAX_RETRY_ATTEMPTS
})
public class InventoryServiceClientTest {

    public static final String UPDATE_SHIP_NODES_SERVICE_URL = "/inventory/v1/nodes/status";
    public static final String INVENTORY_SERVICE_URL = "http://localhost";
    public static final int INVENTORY_SERVICE_PORT = 8484;
    public static final int MAX_RETRY_ATTEMPTS = 1;

    @ClassRule
    public static WireMockClassRule wiremock = new WireMockClassRule(
            wireMockConfig().port(INVENTORY_SERVICE_PORT).notifier(new ConsoleNotifier(true)));

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    InventoryServiceClient inventoryServiceClient;

    @Test
    public void shouldProcessWithoutErrorsInCaseOfOkResponse() {
        stubFor(put(
                urlMatching(UPDATE_SHIP_NODES_SERVICE_URL))
                .willReturn(aResponse()
                        .withStatus(OK.value())));

        inventoryServiceClient.updateShipNodesStatus(new UpdateShipNodesStatusDto(), "correlationId1");
    }

    @Test
    public void shouldThrowFeignExceptionInCaseOfNotFoundResponse() {
        thrown.expect(FeignException.class);
        thrown.expect(status(equalTo(NOT_FOUND.value())));

        stubFor(put(
                urlMatching(UPDATE_SHIP_NODES_SERVICE_URL))
                .willReturn(aResponse()
                        .withStatus(NOT_FOUND.value())));

        inventoryServiceClient.updateShipNodesStatus(new UpdateShipNodesStatusDto(), "correlationId2");
    }

    @Test
    public void shouldRetryRequestInCaseOfError() {
        wiremock.resetRequests();

        stubFor(put(
                urlMatching(UPDATE_SHIP_NODES_SERVICE_URL))
                .willReturn(aResponse()
                        .withFault(CONNECTION_RESET_BY_PEER)));

        try {
            inventoryServiceClient.updateShipNodesStatus(new UpdateShipNodesStatusDto(), "correlationId3");
        } catch (Exception e) {
            assertThat(e).isExactlyInstanceOf(FeignException.InternalServerError.class);
        }

        verify(MAX_RETRY_ATTEMPTS, putRequestedFor(urlEqualTo(UPDATE_SHIP_NODES_SERVICE_URL)));
    }

    private FeatureMatcher<FeignException, Integer> status(Matcher<Integer> matcher) {
        return new FeatureMatcher<FeignException, Integer>(matcher, "name", "name") {
            @Override
            protected Integer featureValueOf(FeignException actual) {
                return actual.status();
            }
        };
    }
}