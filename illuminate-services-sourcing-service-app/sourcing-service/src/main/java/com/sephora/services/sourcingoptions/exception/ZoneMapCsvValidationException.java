package com.sephora.services.sourcingoptions.exception;

public class ZoneMapCsvValidationException extends RuntimeException{
	private Object[] args;

    public ZoneMapCsvValidationException(String error, Object... args) {
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
