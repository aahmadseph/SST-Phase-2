package com.sephora.services.inventory.validation.exception;

/**
 * @author Vitaliy Oleksiyenko
 */
public class InventoryValidationException extends RuntimeException {

    private String errorCode;

    private Object[] args;

    public InventoryValidationException(String errorCode, Object... args) {
        this.errorCode = errorCode;
        this.args = args;
    }

    /**
     * @return the errorCode
     */
    public String getErrorCode() {
        return errorCode;
    }

    /**
     * @return the args
     */
    public Object[] getArgs() {
        return args;
    }
}
