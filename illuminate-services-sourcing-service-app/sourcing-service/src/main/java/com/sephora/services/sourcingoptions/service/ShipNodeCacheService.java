package com.sephora.services.sourcingoptions.service;

import java.util.List;

import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;

public interface ShipNodeCacheService {
	ShipNode getById(String shipNodeNumber);
	List<String> getShipNodeIds(String enterpriseCode);
}
