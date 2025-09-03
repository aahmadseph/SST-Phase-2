package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.exception.SourcingItemsServiceException;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseDto;

import java.util.Map;

/**
 * @author Vitaliy Oleksiyenko
 */
public interface SourcingOptionsService {

    SourcingOptionsResponseDto getSourcingOptions(SourcingOptionsRequestDto sourcingOptionsRequestDto) throws Exception;

    Map<String, Integer> getItemsQuantityMap(SourcingOptionsRequestDto sourcingOptionsRequest);
}
