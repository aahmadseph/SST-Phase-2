package com.sephora.services.common.availabilityhub.exception;

import java.util.Date;

import feign.Request;
import feign.RetryableException;
import feign.Request.HttpMethod;

public class InvalidJWTTokenException extends RetryableException {
	
	private static final long serialVersionUID = 1L;

	public InvalidJWTTokenException(int status, String message, HttpMethod httpMethod, Throwable cause,
		      Date retryAfter, Request request) {
		 super(status,message, httpMethod, cause, retryAfter, request);
	 }
}
