package com.sephora.services.sourcingoptions.mapper;

import com.sephora.platform.common.mapper.BaseMapper;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.dto.ShipNodeDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SourcingShipNodeMapper extends BaseMapper<ShipNode, ShipNodeDto> {

    SourcingShipNodeMapper INSTANCE = Mappers.getMapper(SourcingShipNodeMapper.class);

    ShipNodeDto convert(ShipNode input);
}