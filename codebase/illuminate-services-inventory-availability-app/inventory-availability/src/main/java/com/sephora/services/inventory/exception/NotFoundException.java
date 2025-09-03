package com.sephora.services.inventory.exception;

public class NotFoundException extends RuntimeException {

    private Object[] args;

    public NotFoundException(String error, Object... args) {
        super(error);
        this.args = args;
    }

    public Object[] getArgs() {
        return args;
    }

    public void setArgs(Object[] args) {
        this.args = args;
    }
}