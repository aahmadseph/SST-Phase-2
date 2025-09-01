package com.sephora.services.sourcingoptions.controller.impl;

import com.sephora.services.sourcingoptions.client.AvailabilityHubClient;
import com.sephora.services.sourcingoptions.controller.SourcingHubTestController;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response.AHCartSourceResponse;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request.AHPromiseDateRequest;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.AHPromiseDateResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@RestController
@RequestMapping("sourcingHub/test")
@Validated
@EnableSwagger2
public class SourcingHubTestControllerImpl implements SourcingHubTestController {

    @Autowired
    AvailabilityHubClient sourcingHubClient;
    @Override
    @PostMapping("/sourceItem")
    public ResponseEntity getSourceItems(AHPromiseDateRequest sourcingHubRequest) {
        AHCartSourceResponse response = sourcingHubClient.cartSourceService(sourcingHubRequest, "true", "correlationId139283");

        return ResponseEntity.ok(response);
    }
}
