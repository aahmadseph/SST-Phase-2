package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseDto;

public interface MockSourcingOptionService {
	public SourcingOptionsResponseDto buildMockSourcingOptionResponse(SourcingOptionsRequestDto sourcingOptionsRequest);
}
