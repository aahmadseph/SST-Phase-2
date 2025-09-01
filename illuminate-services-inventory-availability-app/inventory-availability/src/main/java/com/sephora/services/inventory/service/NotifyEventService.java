package com.sephora.services.inventory.service;

import com.sephora.services.inventoryavailability.model.cosmos.doc.bulksupply.BulkInventorySupplyDto;

import java.util.Map;

public interface NotifyEventService {
    void notifyInventorySupplyEvent(Map<String, String> parameters, String templateName, String subject);
    void notifyBulkSupplyStatus(BulkInventorySupplyDto request, Map<String, String> parameters, String templateName, String subject);
}
