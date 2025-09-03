package com.sephora.services.inventory.controller;

import com.sephora.services.inventoryavailability.model.cosmos.doc.item.ItemDoc;
import org.springframework.http.ResponseEntity;

public interface ItemController {
    ResponseEntity<Object> get(String productId, String organisationCode);
}
