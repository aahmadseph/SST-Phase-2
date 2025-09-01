package com.sephora.services.sourcingoptions.controller.impl;

import static com.sephora.services.sourcingoptions.TestUtils.generateRandomString;
import static com.sephora.services.sourcingoptions.model.ShipNodeStatusEnum.ACTIVE;
import static com.sephora.services.sourcingoptions.service.impl.ShipNodeServiceImpl.SHIP_NODE_NOT_FOUND_ERROR;
import static com.sephora.services.sourcingoptions.validation.ValidationConstants.SHIP_NODE_KEY_MAX_LENGTH;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sephora.platform.common.utils.ApplicationUtils;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
//import com.sephora.services.commons.config.discovery.LocalServiceInstanceConfig;
import com.sephora.services.sourcingoptions.client.InventoryAvailabilityServiceClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.autoconfigure.RefreshAutoConfiguration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.sephora.services.sourcingoptions.client.InventoryServiceClient;
import com.sephora.services.sourcingoptions.config.MessageConfig;
import com.sephora.services.sourcingoptions.controller.SourcingResponseEntityExceptionHandler;
import com.sephora.services.sourcingoptions.exception.NotFoundException;
import com.sephora.services.sourcingoptions.service.ShipNodeService;

@RunWith(SpringRunner.class)
@WebMvcTest(ShipNodeControllerImpl.class)
@ImportAutoConfiguration(RefreshAutoConfiguration.class)
@ContextConfiguration(classes = {
        MessageConfig.class,
        ShipNodeControllerImpl.class,
        SourcingResponseEntityExceptionHandler.class,
        RequestLoggingFilterConfig.class,
        ApplicationUtils.class
})
public class ShipNodeControllerImplTest {

    private static final String CHANGE_SHIP_NODES_STATUS_URL = "/v1/sourcing/nodes/status";
    private static final String TEST_SHIP_NODE_NAME = "testShipNode";
    private static final String STATUS = "status";
    private static final String SHIP_NODES = "shipNodes";
    private static final String SHIP_NODES_STATUSES = "shipNodesStatuses";

    @Autowired
    private MockMvc mvc;

    @MockBean
    private ShipNodeService shipNodeService;

    @MockBean
    private InventoryServiceClient inventoryServiceClient;

    @MockBean
    private InventoryAvailabilityServiceClient inventoryAvailabilityServiceClient;

    private JSONObject json;

    private JSONObject shipNodeStatusElement;

    @Before
    public void before() throws JSONException {
        shipNodeStatusElement = new JSONObject()
                .put(STATUS, ACTIVE)
                .put(SHIP_NODES, new JSONArray()
                        .put(TEST_SHIP_NODE_NAME));

        json = new JSONObject()
                .put(SHIP_NODES_STATUSES, new JSONArray()
                        .put(shipNodeStatusElement));
    }

    @Test
    public void whenUpdateShipNodesStatus_thenOk() throws Exception {
        
        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL)
                .content(json.toString())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());

        ArgumentCaptor<String> acCorrelationId = ArgumentCaptor.forClass(String.class);

        verify(inventoryServiceClient).updateShipNodesStatus(any(), acCorrelationId.capture());

        String correlationId = acCorrelationId.getValue();

        assertThat(correlationId).isNotNull();

    }

    @Test
    public void whenUpdateShipNodesStatusWithEmptyPayload_then400() throws Exception {
        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL)
                .content("")
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40000")))
                .andExpect(jsonPath("$..errorMessage", hasItem("Invalid format")));
    }

    @Test
    public void whenUpdateShipNodesStatus_withoutShipNodesSpecified_then400() throws Exception {
        shipNodeStatusElement.remove(SHIP_NODES);

        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL)
                .content(json.toString())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40002")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'shipNodesStatuses.shipNodes' must have at least 1 element")));
    }

    @Test
    public void whenUpdateShipNodesStatus_withInvalidShipNodesSpecified_then400() throws Exception {
        shipNodeStatusElement.put(SHIP_NODES, "");

        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL)
                .content(json.toString())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40000")))
                .andExpect(jsonPath("$..errorMessage", hasItem("Invalid format")));
    }

    @Test
    public void whenUpdateShipNodesStatus_withNodeNameLongerThanMax_then400() throws Exception {
        shipNodeStatusElement.put(SHIP_NODES, new JSONArray()
                .put(generateRandomString(SHIP_NODE_KEY_MAX_LENGTH + 1)));

        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL)
                .content(json.toString())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40005")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The fields element 'shipNodesStatuses.shipNodes' length must be less than or equal to 40 symbols")));
    }

    @Test
    public void whenUpdateShipNodesStatus_withEmptyStatus_then400() throws Exception {
        shipNodeStatusElement.put(STATUS, EMPTY);

        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL)
                .content(json.toString())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40004")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'shipNodesStatuses.status' cannot be null or blank")));
    }

    @Test
    public void whenUpdateShipNodesStatus_withInvalidStatus_then400() throws Exception {
        shipNodeStatusElement.put(STATUS, "1");

        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL)
                .content(json.toString())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40003")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'shipNodesStatuses.status' value is not an identified one. List of possible values: 'LOCKED', 'ACTIVE'")));
    }

    @Test
    public void whenUpdateShipNodesStatus_ifAllShipNodesNotFound_then400() throws Exception {
        doThrow(new NotFoundException(SHIP_NODE_NOT_FOUND_ERROR, TEST_SHIP_NODE_NAME))
                .when(shipNodeService).updateShipNodesStatus(any(), any());

        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL, TEST_SHIP_NODE_NAME)
                .content(json.toString())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40400")))
                .andExpect(jsonPath("$..errorMessage", hasItem("Unable to find 'ShipNodes' with ids=[testShipNode]")));
    }

    @Test
    public void whenUpdateShipNodesStatus_ifStatusesIsNull_then400() throws Exception {
        json.remove(SHIP_NODES_STATUSES);

        mvc.perform(put(CHANGE_SHIP_NODES_STATUS_URL, TEST_SHIP_NODE_NAME)
                .content(json.toString())
                .accept(APPLICATION_JSON)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40006")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'shipNodesStatuses' must have at least 1 element")));
    }

}
