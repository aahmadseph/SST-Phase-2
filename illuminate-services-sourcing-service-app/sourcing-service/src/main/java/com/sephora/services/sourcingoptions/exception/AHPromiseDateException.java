package com.sephora.services.sourcingoptions.exception;

public class AHPromiseDateException extends Exception {
	private Object[] args;
	
	public AHPromiseDateException(String error, Object... args) {
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
