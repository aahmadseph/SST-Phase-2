package com.sephora.services.common.availabilityhub.exception;

import feign.FeignException;

public class NoContentException extends FeignException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public NoContentException(int status, String message) {
		super(status, message);
	}
}
