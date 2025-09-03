package com.sephora.services.inventory.mapper;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;

import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.sephora.platform.common.mapper.BaseMapper;
import com.sephora.services.inventory.model.doc.ShipNode;
import com.sephora.services.inventory.model.dto.ShipNodeDto;
import com.sephora.services.inventoryavailability.mapping.impl.CustomMappers;
import org.springframework.stereotype.Component;


@Mapper(uses = CustomMappers.class,builder = @Builder(disableBuilder = true))
public interface InventoryShipNodeMapper extends BaseMapper<ShipNode, ShipNodeDto> {

    @Override
    @Mapping(target = "enterpriseCode", nullValueCheckStrategy = ALWAYS)
    ShipNodeDto convert(ShipNode input);
}
