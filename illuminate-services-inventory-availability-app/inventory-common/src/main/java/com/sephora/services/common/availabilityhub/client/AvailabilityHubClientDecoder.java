package com.sephora.services.common.availabilityhub.client;

import java.io.IOException;
import java.lang.reflect.Type;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.common.availabilityhub.exception.NoContentException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import feign.Response;
import feign.jackson.JacksonDecoder;

@Component("AvailabilityHubClientDecoder")
public class AvailabilityHubClientDecoder extends JacksonDecoder {
	
	public AvailabilityHubClientDecoder(@Autowired ObjectMapper mapper) {
		super(mapper);
	}
	@Override
	public Object decode(Response response, Type type) throws IOException {
		//
		if(HttpStatus.NO_CONTENT.value() == response.status()) {
			NoContentException noContentException = new NoContentException(HttpStatus.NO_CONTENT.value(), HttpStatus.NO_CONTENT.toString());
			throw noContentException;
		}
		return super.decode(response, type);
	}
}
