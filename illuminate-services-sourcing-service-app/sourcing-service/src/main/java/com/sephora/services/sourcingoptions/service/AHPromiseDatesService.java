package com.sephora.services.sourcingoptions.service;

import java.util.List;

import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseDto;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.AHPromiseDateResponseWithContext;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.AHPromiseDateResponse;

public interface AHPromiseDatesService {
    SourcingOptionsResponseDto getPromiseDateByService(SourcingOptionsRequestDto request) throws Exception;
    
    SourcingOptionsResponseDto getCartSourcePromiseDates(SourcingOptionsRequestDto request) throws Exception;
}
