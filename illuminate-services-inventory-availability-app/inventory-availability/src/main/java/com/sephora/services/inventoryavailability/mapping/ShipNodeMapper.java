//package com.sephora.services.inventoryavailability.mapping;
//
//import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
//
//import com.sephora.platform.common.mapper.BaseMapper;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import com.sephora.services.inventoryavailability.mapping.impl.CustomMappers;
//import com.sephora.services.inventoryavailability.model.cosmos.doc.ShipNode;
//import com.sephora.services.inventoryavailability.model.shipnode.ShipNodeDto;
//
//@Mapper(uses = CustomMappers.class)
//public interface ShipNodeMapper extends BaseMapper<ShipNode, ShipNodeDto> {
//
//    @Override
//    @Mapping(target = "enterpriseCode", nullValueCheckStrategy = ALWAYS)
//    ShipNodeDto convert(ShipNode input);
//}