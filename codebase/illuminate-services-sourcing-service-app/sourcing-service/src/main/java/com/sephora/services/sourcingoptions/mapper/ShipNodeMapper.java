package com.sephora.services.sourcingoptions.mapper;

import org.mapstruct.Mapper;

import com.sephora.services.inventory.model.cache.ShipNodeCache;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;

@Mapper
public interface ShipNodeMapper {
	ShipNode convert(ShipNodeCache shipNodeCache);
}
