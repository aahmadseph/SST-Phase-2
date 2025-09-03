package com.sephora.services.sourcingoptions.exception;

public class SourcingServiceException extends Exception {

    public SourcingServiceException(Throwable cause) {
        super(cause);
    }

    public SourcingServiceException(String message) {
        super(message);
    }
}