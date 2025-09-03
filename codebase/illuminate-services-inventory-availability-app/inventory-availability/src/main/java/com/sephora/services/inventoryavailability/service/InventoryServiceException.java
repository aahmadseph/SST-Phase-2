package com.sephora.services.inventoryavailability.service;

public class InventoryServiceException extends Exception {

    public InventoryServiceException(Throwable cause) {
        super(cause);
    }

    public InventoryServiceException(String message) {
        super(message);
    }
    
    public InventoryServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}