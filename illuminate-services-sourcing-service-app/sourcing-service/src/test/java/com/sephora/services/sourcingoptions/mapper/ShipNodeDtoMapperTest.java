/*
 * This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 * consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 * Copyright 2019 sephora.com, Inc. All rights reserved.
 */

package com.sephora.services.sourcingoptions.mapper;

import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.dto.ShipNodeDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import static com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum.SEPHORAUS;
import static com.sephora.services.sourcingoptions.model.ShipNodeStatusEnum.ACTIVE;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNull;

/**
 * @author Alexey Zalivko 6/11/2019
 */
@RunWith(SpringRunner.class)
public class ShipNodeDtoMapperTest {

    private SourcingShipNodeMapper shipNodeDtoConverter = SourcingShipNodeMapper.INSTANCE;

    @Test
    public void convert() {

        ShipNodeDto shipNodeDto = shipNodeDtoConverter.convert(null);

        assertNull(shipNodeDto);

        ShipNode shipNode = getShipNode();

        shipNodeDto = shipNodeDtoConverter.convert(shipNode);

        assertEquals(shipNodeDto.getId(), shipNode.getId());
        assertEquals(shipNodeDto.getEnterpriseCode(), shipNode.getEnterpriseCode());
        assertEquals(shipNodeDto.getName(), shipNode.getName());
        assertEquals(shipNodeDto.getStatus(), shipNode.getStatus());

    }

    private ShipNode getShipNode() {

        ShipNode shipNode = new ShipNode();

        shipNode.setId("0701");
        shipNode.setName("0701");
        shipNode.setEnterpriseCode(SEPHORAUS.toString());
        shipNode.setStatus(ACTIVE.toString());

        return shipNode;
    }
}