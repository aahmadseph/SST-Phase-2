package com.sephora.services.common.availabilityhub.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.sephora.services.common.availabilityhub.client.JWTTokenGenerator;

import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
@ConditionalOnProperty(prefix = "availabilityhub.client.jwttoken", value = "privateKeyId")
@Primary
@Qualifier("availailityHubTokenScheduler")
public class JWTTokenScheduler {
		
	@Autowired
	JWTTokenGenerator jWTTokenGenerator;
	
	/**
	 * Scheduler to regenerate a token before the expire time (Eg:- TTL-X time). It will avoid retry caused by http status 401.
	 * Since TTL for JWT token specified in minutes, convert the same in to millisecond. 
	 */
	@Scheduled(initialDelayString = "#{(${availabilityhub.client.jwttoken.timeToLive}*60*1000) - ${availabilityhub.client.jwttoken.scheduler.deltaTime: 5000}}", 
			fixedDelayString = "#{(${availabilityhub.client.jwttoken.timeToLive}*60*1000) - ${availabilityhub.client.jwttoken.scheduler.deltaTime: 5000}}")
	public void generateTocken() {
		log.debug("JWTTokenScheduler is going to regenarate JWT tocken");
		jWTTokenGenerator.generateToken(jWTTokenGenerator.getToken());
	}
}
