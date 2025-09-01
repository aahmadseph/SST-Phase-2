//package com.sephora.services.inventoryavailability.controller.impl;
//
//import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
//import com.sephora.services.inventoryavailability.controller.ShipNodeController;
//import com.sephora.services.inventoryavailability.model.cosmos.ShipNodeStatusEnum;
//import com.sephora.services.inventoryavailability.model.shipnode.UpdateShipNodesStatusDto;
//import com.sephora.services.inventoryavailability.service.ShipNodeService;
//
//import lombok.extern.log4j.Log4j2;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.annotation.*;
//
//import static org.springframework.http.ResponseEntity.ok;
//
//@ControllerDocumentation
//@RestController
//@RequestMapping("/v1/nodes")
//@Validated
//@Log4j2
//public class ShipNodeControllerImpl implements ShipNodeController {
//    @Autowired
//    private ShipNodeService shipNodeService;
//
//    @Override
//    @PutMapping("/status")
//    public ResponseEntity<Object> updateShipNodesStatus(
//            @RequestBody UpdateShipNodesStatusDto updateShipNodesStatus) {
//
//        updateShipNodesStatus.getShipNodesStatuses()
//                .forEach(updateShipNodeStatus -> {
//
//                    ShipNodeStatusEnum status = ShipNodeStatusEnum.valueOf(updateShipNodeStatus.getStatus());
//
//                    log.debug("Update status for shipping nodes with keys={}", updateShipNodeStatus.getShipNodes());
//                    shipNodeService.updateShipNodesStatus(updateShipNodeStatus.getShipNodes(), status);
//
//                });
//
//        return ok().build();
//    }
//
//    @Override
//    @GetMapping
//    public ResponseEntity<Object> getShipNodes() {
//        log.debug("Retrieving list of ship nodes");
//        return ok(shipNodeService.findAll());
//    }
//}