package com.sephora.services.common.availabilityhub.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import com.sephora.services.common.availabilityhub.exception.InvalidJWTTokenException;
import feign.Retryer.Default;
import lombok.extern.log4j.Log4j2;
import feign.RetryableException;
import feign.Retryer;

@Component("AvailabilityHubClientRetryer")
@Primary
@Log4j2
public class AvailabilityHubClientRetryer extends Default {

	@Value("${availabilityhub.client.async.retryPeriod:100}")
	private Integer retryPeriod;

	@Value("${availabilityhub.client.async.retryMaxPeriod:500}")
	private Integer retryMaxPeriod;

	@Value("${availabilityhub.client.async.retryMaxAttempts:3}")
	private Integer retryMaxAttempts;

	private int attempt = 1;

	@Autowired
	public AvailabilityHubClientRetryer(@Value("${availabilityhub.client.async.retryPeriod:100}") Integer retryPeriod,
			@Value("${availabilityhub.client.async.retryMaxPeriod:500}") Integer retryMaxPeriod,
			@Value("${availabilityhub.client.async.retryMaxAttempts:3}") Integer retryMaxAttempts) {
		super(retryPeriod, retryMaxPeriod, retryMaxAttempts);
	}

	@Override
	public void continueOrPropagate(RetryableException e) {
		// If given exception is belongs to InvalidJWTTokenException, we will have to
		// retry.
		if (e instanceof InvalidJWTTokenException) {
			return;
		}
		log.info("Availability retry attempt: {}", attempt++);
		super.continueOrPropagate(e);
	}

	@Override
	public Retryer clone() {
		return new AvailabilityHubClientRetryer(retryPeriod, retryMaxPeriod, retryMaxAttempts);
	}
}
