package com.sephora.services.common.availabilityhub.client;

import static feign.FeignException.errorStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.sephora.services.common.availabilityhub.client.JWTTokenGenerator;
import com.sephora.services.common.availabilityhub.exception.InvalidJWTTokenException;

import feign.FeignException;
import feign.Response;
import feign.RetryableException;
import feign.codec.ErrorDecoder.Default;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@Qualifier("AvailabilityHubClientErrorDecoder")
@ConditionalOnProperty(prefix = "availabilityhub.client.jwttoken", value = "privateKeyId")
@Primary
public class AvailabilityHubClientErrorDecoder extends Default {
	@Autowired
	JWTTokenGenerator jwtTokenGenerator;
	
	@Override
	public Exception decode(String methodKey, Response response) {
		if (response.status() == HttpStatus.UNAUTHORIZED.value()) {
			
			log.error("UNAUTHORIZED status (HTTP 401) is returned. JWTToken validation should have failed. Response is {}", response);

			// Get the current token
			String currentJWTTOken  = null;

			// Get the jwttoken we passed as part of the failed request. 
			if ( null != response.request().headers().get("Authorization") ) {
				currentJWTTOken = response.request().headers().get("Authorization").iterator().next();
			}
			
			// When this scenario happens, all concurrent requests will fail and will would want to regenerate.
			// To generate only if another thread hasnt generated, we will have to pass the used one in this request which
			// will be used to compare with the current one. Once a thread generates it, others will detect that it got
			// re-generated and will simply return the new jwttoken
			
			log.info("Authorization header (JWTToken) is expired/invalidated. We will have to generate a new one");
			
			jwtTokenGenerator.generateToken(currentJWTTOken);
			
			FeignException exception = errorStatus(methodKey, response);
			
			return new InvalidJWTTokenException (
		            response.status(),
		            exception.getMessage(),
		            response.request().httpMethod(),
		            exception,
		            null,
		            response.request());
			
		} else if(response.status() >= 500 && response.status() < 600) {
			FeignException exception = errorStatus(methodKey, response);
			return new RetryableException(
		            response.status(),
		            exception.getMessage(),
		            response.request().httpMethod(),
		            exception,
		            null,
		            response.request());
		}
		return super.decode(methodKey, response);
	}
}
