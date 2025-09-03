package com.sephora.services.sourcingoptions.controller.impl;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.sourcingoptions.client.InventoryAvailabilityServiceClient;
import com.sephora.services.sourcingoptions.client.InventoryServiceClient;
import com.sephora.services.sourcingoptions.controller.ShipNodeController;
import com.sephora.services.sourcingoptions.model.dto.UpdateShipNodesStatusDto;
import com.sephora.services.sourcingoptions.service.ShipNodeService;
import lombok.extern.log4j.Log4j2;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.ResponseEntity.ok;

@ControllerDocumentation
@RestController
@RequestMapping("/v1/sourcing/nodes")
@Validated
@EnableSwagger2
@Log4j2
public class ShipNodeControllerImpl implements ShipNodeController {

    @Autowired
    private ShipNodeService shipNodeService;

    @Autowired
    private InventoryServiceClient inventoryServiceClient;
    
    @Autowired
    private InventoryAvailabilityServiceClient inventoryAvailablityServiceClient;
    
    @Value("${sourcing.options.feign.inventoryavailability.useInventoryService: true}")
    private Boolean useInventoryService;

    @Autowired
    private RequestLoggingFilterConfig requestLoggingFilterConfig;

    @Override
    @PutMapping("/status")
    public ResponseEntity<Object> updateShipNodesStatus(
            @RequestBody UpdateShipNodesStatusDto updateShipNodesStatus) {

        updateShipNodesStatus.getShipNodesStatuses()
                .forEach(updateShipNodeStatus -> {
                    log.debug("Update status for shipping nodes with keys={} locally", updateShipNodeStatus.getShipNodes());
                    shipNodeService.updateShipNodesStatus(updateShipNodeStatus.getShipNodes(),
                        updateShipNodeStatus.getStatus());
                });

        log.info("Send request to update ship nodes statuses to inventory service = {}",
                updateShipNodesStatus);

        String correlationId = MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName());
        if(useInventoryService) {
            log.info("updating shipnode status using inventory service, request {}", updateShipNodesStatus);
        	inventoryServiceClient.updateShipNodesStatus(updateShipNodesStatus, correlationId);
        }else {
            log.info("updating shipnode status using inventory availability service, request {}", updateShipNodesStatus);
        	inventoryAvailablityServiceClient.updateShipNodesStatus(updateShipNodesStatus, correlationId);
        }
        

        return ok().build();
    }

    @Override
    @GetMapping
    public ResponseEntity<Object> getShipNodes() {
        log.debug("Retrieving list of ship nodes");
        return ok(shipNodeService.findAll());
    }
}