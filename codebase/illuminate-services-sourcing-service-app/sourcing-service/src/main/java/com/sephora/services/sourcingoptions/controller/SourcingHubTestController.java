package com.sephora.services.sourcingoptions.controller;

import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request.AHPromiseDateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

public interface SourcingHubTestController {


    @PostMapping("/sourceItems")
    public ResponseEntity getSourceItems(AHPromiseDateRequest sourcingHubRequest);
}
