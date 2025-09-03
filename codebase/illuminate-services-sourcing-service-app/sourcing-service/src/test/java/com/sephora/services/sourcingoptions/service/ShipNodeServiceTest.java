package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.TestConfig;
import com.sephora.services.sourcingoptions.exception.NotFoundException;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.repository.cosmos.ShipNodeRepository;
import com.sephora.services.sourcingoptions.service.impl.ShipNodeServiceImpl;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum.SEPHORAUS;
import static com.sephora.services.sourcingoptions.model.ShipNodeStatusEnum.ACTIVE;
import static com.sephora.services.sourcingoptions.model.ShipNodeStatusEnum.LOCKED;
import static com.sephora.services.sourcingoptions.service.impl.ShipNodeServiceImpl.SHIP_NODE_NOT_FOUND_ERROR;
import static java.util.Arrays.asList;
import static java.util.Collections.emptyList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.arrayContaining;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasProperty;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {
        ShipNodeServiceImpl.class,
        TestConfig.class,
})
public class ShipNodeServiceTest {

    private static final String SHIP_NODE_NAME = "testShipNodeName";
    private static final String SHIP_NODE_ID = "testShipNodeKey";
    private static final String SHIP_NODE_TYPE = "DC";
    private static final String SHIP_NODE_TIME_ZONE = "America/New_York";
    private static final String INVALID_SHIP_NODE_KEY = "notExist";

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    private ShipNodeService shipNodeService;

    @MockBean
    private ShipNodeRepository shipNodeRepository;

    @Test
    public void testUpdateShipNodesStatus() {
        ShipNode shipNode = createTestShipNode();
        when(shipNodeRepository.findByIdIn((List)argThat(containsInAnyOrder(SHIP_NODE_ID))))
            .thenReturn(asList(shipNode));

        shipNodeService.updateShipNodesStatus(asList(SHIP_NODE_ID), LOCKED.toString());

        verify(shipNodeRepository).findByIdIn(any());
        verify(shipNodeRepository).saveAll(any());
        assertThat(shipNode)
                .isNotNull()
                .hasFieldOrPropertyWithValue("status", LOCKED.toString());
    }

    @Test
    public void whenUpdateShipNodesStatus_withValidAndInvalidShipNodeNames_shouldProcessStatusUpdate() {
        ShipNode shipNode = createTestShipNode();
        when(shipNodeRepository.findByIdIn((List)argThat(containsInAnyOrder(SHIP_NODE_ID, INVALID_SHIP_NODE_KEY))))
            .thenReturn(asList(shipNode));

        shipNodeService.updateShipNodesStatus(asList(SHIP_NODE_ID, INVALID_SHIP_NODE_KEY), LOCKED.toString());

        assertThat(shipNode)
                .isNotNull()
                .hasFieldOrPropertyWithValue("status", LOCKED.toString());
    }

    @Test
    public void whenUpdateShipNodesStatus_withInvalidShipNodes_shouldThrowException() {
        when(shipNodeRepository.findByIdIn((List)argThat(containsInAnyOrder(SHIP_NODE_ID)))).thenReturn(emptyList());

        thrown.expect(NotFoundException.class);
        thrown.expect(hasProperty("message", equalTo(SHIP_NODE_NOT_FOUND_ERROR)));
        thrown.expect(hasProperty("args", arrayContaining(INVALID_SHIP_NODE_KEY)));

        shipNodeService.updateShipNodesStatus(asList(INVALID_SHIP_NODE_KEY), ACTIVE.toString());
    }

    private ShipNode createTestShipNode() {
        ShipNode shipNode = new ShipNode();
        shipNode.setId(SHIP_NODE_ID);
        shipNode.setName(SHIP_NODE_NAME);
        shipNode.setTimeZone(SHIP_NODE_TIME_ZONE);
        shipNode.setNodeType(SHIP_NODE_TYPE);
        shipNode.setEnterpriseCode(SEPHORAUS.toString());
        shipNode.setStatus(ACTIVE.toString());
        return shipNode;
    }
}
