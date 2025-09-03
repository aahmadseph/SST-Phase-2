package com.sephora.services.sourcingoptions.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.sephora.services.sourcingoptions.service.EmailService;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Component
@ConfigurationProperties(prefix = "sourcing.options.zone-map.mail")
@Setter
@Getter
@Log4j2
public class EmailServiceImpl implements EmailService {
	
	@Autowired
    private JavaMailSender emailSender;
	private String fromAddress;
	private String[] toAddress;
	private String[] ccAddress;
	private String subject;
	
	@Override
	public void sendZoneMapUploadConfirmationMail(String fileName) {
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom(fromAddress);
			message.setTo(toAddress);
			message.setCc(ccAddress);
			message.setSubject("OMS Zone Mapping File Uploaded");
			message.setText("OMS ZoneMapping file " + fileName + " succesfully uploaded and validated"
					+ "\n\n\n\n This is an auto-generated email message. Please, do not reply directly to this email.");
			emailSender.send(message);
		}catch(Exception ex) {
			log.error("Exception while sending zonemap upload confirmation mail: ", ex.getMessage(), ex);
		}
	}

	@Override
	public void sendZoneMapProcessConfirmationMail(String enterpriseCode) {
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom(fromAddress);
			message.setTo(toAddress);
			message.setCc(ccAddress);
			message.setSubject(subject);
			message.setText("OMS ZoneMapping for " + enterpriseCode + " succesfully processed"
					+ "\n\n\n\n This is an auto-generated email message. Please, do not reply directly to this email.");
			emailSender.send(message);
		}catch(Exception ex) {
			log.error("Exception while sending zonemap upload confirmation mail: ", ex.getMessage(), ex);
		}
		
	}
}
