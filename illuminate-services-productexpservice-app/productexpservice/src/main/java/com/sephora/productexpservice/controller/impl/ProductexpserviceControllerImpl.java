package com.sephora.productexpservice.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.productexpservice.configuration.exception.ReferenceItemNotFoundException;
import com.sephora.productexpservice.controller.ProductexpserviceController;
import com.sephora.productexpservice.dto.ReferenceDto;
import com.sephora.productexpservice.dto.request.ReferenceItemCreateRequestDto;
import com.sephora.productexpservice.dto.request.ReferenceItemsUpdateStatusRequest;
import com.sephora.productexpservice.model.ReferenceStatusEnum;
import com.sephora.productexpservice.service.ProductexpserviceService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/items")
@ControllerDocumentation
@Validated
@Slf4j
public class ProductexpserviceControllerImpl implements ProductexpserviceController {

   @Autowired
   private ProductexpserviceService referenceService;

   @Override
   @PostMapping
   public ResponseEntity addReferenceItems(ReferenceItemCreateRequestDto referenceItemCreateRequestDto) {
      log.debug("Entered POST /items");
      return new ResponseEntity<>(referenceService.add(
            ReferenceDto.builder()
                  .referenceName(referenceItemCreateRequestDto.getName())
                  .status(ReferenceStatusEnum.NEW.name())
                  .quantity(referenceItemCreateRequestDto.getQuantity()).build()),
            HttpStatus.CREATED);
   }

   @Override
   @PutMapping
   public ResponseEntity updateReferenceItems(ReferenceItemsUpdateStatusRequest referenceItemsUpdateStatusRequest) {
      log.debug("Entered PUT /items");
      return new ResponseEntity<>(referenceService.updateReferenceStatusByName(referenceItemsUpdateStatusRequest.getNames(), referenceItemsUpdateStatusRequest.getStatus()), HttpStatus.OK);
   }

   @Override
   @GetMapping("/{id}")
   public ResponseEntity getReferenceItem(@PathVariable String id) {
      log.debug("Entered GET /items");
      try {
         ReferenceDto referenceDto = referenceService.findById(id);
         return new ResponseEntity<>(referenceDto, HttpStatus.OK);
      } catch (ReferenceItemNotFoundException ex) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }
   
   @Override
	@GetMapping("/item/{id}")
	public ResponseEntity getReferenceItemById(@PathVariable String id) {
		log.debug("Entered GET /items");
		try {
			ReferenceDto referenceDto = referenceService.findByReferenceId(id);
			return new ResponseEntity<>(referenceDto, HttpStatus.OK);
		} catch (ReferenceItemNotFoundException ex) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}


