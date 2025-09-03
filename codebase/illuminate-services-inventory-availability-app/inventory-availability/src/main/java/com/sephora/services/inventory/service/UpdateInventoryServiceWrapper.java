package com.sephora.services.inventory.service;

import com.sephora.services.inventory.exception.NotFoundException;
import com.sephora.services.inventory.model.dto.UpdateInfiniteStatusDto;
import com.sephora.services.inventory.model.dto.UpdateInventoryDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletionException;

@Service
public class UpdateInventoryServiceWrapper {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private UpdateInventoryService transactionalUpdateInventoryService;

    public void updateInventory(@NonNull UpdateInventoryDto updateInventoryDto) throws InventoryServiceException {
        try {
            transactionalUpdateInventoryService.updateInventory(updateInventoryDto);
        } catch (NotFoundException | CompletionException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("Error occurred while trying to save inventory item {}", updateInventoryDto.getItemId(), ex);
            throw new InventoryServiceException(ex);
        }
    }

    public void updateInfiniteStatus(@NonNull UpdateInfiniteStatusDto updateInfiniteStatusDto, String itemId) throws InventoryServiceException {
        try {
            transactionalUpdateInventoryService.updateInfiniteStatus(updateInfiniteStatusDto, itemId);
        } catch (Exception ex) {
            logger.error("Error occurred while trying to update inventory infinite status for itemId={}", itemId, ex);
            throw new InventoryServiceException(ex);
        }
    }
}