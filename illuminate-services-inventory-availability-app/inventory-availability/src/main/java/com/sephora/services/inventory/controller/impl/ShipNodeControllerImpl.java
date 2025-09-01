package com.sephora.services.inventory.controller.impl;


import static org.springframework.http.ResponseEntity.ok;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.inventory.controller.ShipNodeController;
import com.sephora.services.inventory.model.ShipNodeStatusEnum;
import com.sephora.services.inventory.model.dto.UpdateShipNodesStatusDto;
import com.sephora.services.inventory.service.InventoryShipNodeService;

@ControllerDocumentation
@RestController("inventoryShipNodeController")
@RequestMapping("/v1/nodes")
@Validated
@ConditionalOnProperty(prefix = "inventory.cache", name = "enabled", havingValue = "false", matchIfMissing = true)
public class ShipNodeControllerImpl implements ShipNodeController {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private InventoryShipNodeService shipNodeService;

    @Override
    @PutMapping("/status")
    public ResponseEntity<Object> updateShipNodesStatus(
            @RequestBody UpdateShipNodesStatusDto updateShipNodesStatus) {

        updateShipNodesStatus.getShipNodesStatuses()
                .forEach(updateShipNodeStatus -> {
                    ShipNodeStatusEnum status = ShipNodeStatusEnum.valueOf(updateShipNodeStatus.getStatus());
                    logger.debug("Update status for shipping nodes with keys={}", updateShipNodeStatus.getShipNodes());                   
                    shipNodeService.updateShipNodesStatus(updateShipNodeStatus.getShipNodes(), status);                   
                });

        return ok().build();
    }

    @Override
    @GetMapping
    public ResponseEntity<Object> getShipNodes() {
    	logger.debug("Retrieving list of ship nodes");
        return ok(shipNodeService.findAll());
   }
}