package com.sephora.services.common.availabilityhub.client;

import java.util.Collections;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import com.sephora.platform.logging.RequestLoggingFilterConfig;
import feign.RequestInterceptor;
import feign.RequestTemplate;

@Component("AvailabilityHubClientRequestInterceptor")
@ConditionalOnProperty(prefix = "availabilityhub.client.jwttoken", value = "privateKeyId")
@Primary
public class AvailabilityHubClientRequestInterceptor implements RequestInterceptor {
	
	@Autowired
	JWTTokenGenerator jwtTokenGenerator;
	
	@Autowired
    private RequestLoggingFilterConfig requestLoggingFilterConfig;

	@Override
	public void apply(RequestTemplate template) {
		
		String jwtToken = jwtTokenGenerator.getToken();
		// To clear if the header is available for given name, 
		// since template.header(String name, Iterable<String> values) will append header into existing list 
		// if passing value as no empty list.
		template.header("Authorization", Collections.emptyList());
		template.header("Authorization", jwtToken);
		
		template.header("correlationId", Collections.emptyList());
		template.header("correlationId", MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
	}

}
