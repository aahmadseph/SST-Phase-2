package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ShipNodeDelayRequestDto;

public interface ShipNodeDelayService {
	void publishShipnodeDelay(ShipNodeDelayRequestDto shipNodeDelayRequestDto) throws Exception;
	void updateShipnodeDelay(ShipNodeDelayRequestDto shipNodeDelayRequestDto) throws Exception;
	void deleteShipnodeDelay(String ruleId, String levelOfService, String shipNode) throws Exception;
}
