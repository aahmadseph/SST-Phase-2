package com.sephora.services.sourcingoptions.service.impl;

import static com.sephora.services.sourcingoptions.SourcingOptionConstants.SHIP_NODE_CACHE_KEY_PREFIX;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.sephora.services.sourcingoptions.SourcingOptionConstants.CACHE_KEY_SEPARATOR;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import com.sephora.services.common.service.CacheServices;
import com.sephora.services.inventory.model.cache.ShipNodeCache;
import com.sephora.services.sourcingoptions.mapper.ShipNodeMapper;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.service.ShipNodeCacheService;

@Service
public class ShipNodeCacheServiceImpl implements ShipNodeCacheService{
	
	@Autowired
	private CacheServices cacheService;
	
	@Autowired
	private ShipNodeMapper shipNodeMapper;
	
	
	@Value("#{'${shipment.us-locations}'.split(',')}")
	List<String> usLocations = new ArrayList<>();
	
	@Value("#{'${shipment.ca-locations}'.split(',')}")
	List<String> caLocations = new ArrayList<>();
	
	@Override
	public ShipNode getById(String key) {
		
		String cachekey = SHIP_NODE_CACHE_KEY_PREFIX + CACHE_KEY_SEPARATOR + key;
		ShipNodeCache shipNode = (ShipNodeCache) cacheService.get(cachekey);
		if(!ObjectUtils.isEmpty(shipNode)) {
			return shipNodeMapper.convert(shipNode);
		} else {
			return null;	
		}		
	}
	@Override
	public List<String> getShipNodeIds(String enterpriseCode) {
		if(EnterpriseCodeEnum.SEPHORAUS.toString().equals(enterpriseCode)) {
			return usLocations;
		} else if(EnterpriseCodeEnum.SEPHORACA.toString().equals(enterpriseCode)){
			return caLocations;
		} else {
			return Collections.EMPTY_LIST;
		}
	}

}
