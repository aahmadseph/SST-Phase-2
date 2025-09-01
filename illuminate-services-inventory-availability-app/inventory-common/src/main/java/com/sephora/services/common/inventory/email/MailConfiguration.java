package com.sephora.services.common.inventory.email;

import lombok.Setter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@ConditionalOnProperty(prefix = "sephora.email", name = "enabled", havingValue = "true")
@Configuration("mailConfiguration")
@ConfigurationProperties(prefix = "sephora.email")
@Setter
public class MailConfiguration {
	
	private String host;
	private int port;
	private String username;
	private String password;
	private String protocol;
	private String auth;
	private String starttlsEnabled;
	private String debugEnabled;
	
	@Bean
	public JavaMailSender getJavaMailSender() {
	    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
	    mailSender.setHost(host);
	    mailSender.setPort(port);
	    
	    mailSender.setUsername(username);
	    mailSender.setPassword(password);
	    
	    Properties props = mailSender.getJavaMailProperties();
	    props.put("mail.transport.protocol", protocol);
	    props.put("mail.smtp.auth", auth);
	    props.put("mail.smtp.starttls.enable", starttlsEnabled);
	    props.put("mail.debug", debugEnabled);
	    
	    return mailSender;
	}
}
