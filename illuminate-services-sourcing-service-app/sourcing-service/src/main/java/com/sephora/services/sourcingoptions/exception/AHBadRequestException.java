package com.sephora.services.sourcingoptions.exception;

public class AHBadRequestException extends Exception {
	private Object[] args;

    public AHBadRequestException(String error, Object... args) {
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
