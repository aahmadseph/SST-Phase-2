package com.sephora.services.inventory.service;

public class InventoryServiceException extends Exception {

    public InventoryServiceException(Throwable cause) {
        super(cause);
    }

    public InventoryServiceException(String message) {
        super(message);
    }
}