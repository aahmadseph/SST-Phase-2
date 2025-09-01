package com.sephora.services.inventory.controller.impl;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.inventory.controller.ItemController;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventory.service.ItemService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

//@ConditionalOnProperty(prefix = "yantriks", name = "enabled", havingValue = "true")
@RestController
@RequestMapping("/item/")
@ControllerDocumentation
@Log4j2
@EnableSwagger2
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public class ItemControllerImpl implements ItemController {

    @Autowired
    ItemService itemService;
    @Override
    @GetMapping("/{productId}/{organizationCode}/")
    public ResponseEntity<Object> get(@PathVariable String productId,@PathVariable String organizationCode) {
       try{
           return ResponseEntity.ok(itemService.get(productId, organizationCode));
       }catch(AvailabilityServiceException inventoryServiceException){
           log.error("Exception occured while getting item information. Status: {}",
                   HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
           return new ResponseEntity<>(inventoryServiceException.getErrorDetails(), HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
       }
    }
}
