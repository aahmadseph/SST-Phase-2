package com.sephora.services.common.inventory.email;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;


@ConditionalOnProperty(prefix = "sephora.email", name = "enabled", havingValue = "true")
@Service
@ConfigurationProperties(prefix = "sephora.email")
@Setter
@Getter
@Log4j2
public class EmailServiceImpl implements EmailService {
	
	@Autowired(required = false)
    private JavaMailSender emailSender;

	@Override
	@Async
	public void sendEmail(String template, String fromAddress, String[] toAddress, String[] ccAddress, String subject, Map<String, String> parameters) {
		if(emailSender != null) {
			MimeMessage mimeMessage = emailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
			try {
				helper.setText(buildMessageUsingParameters(template, parameters), true); // Use this or above line.
				helper.setTo(toAddress);
				if (ccAddress != null) {
					helper.setCc(ccAddress);
				}
				helper.setSubject(subject);
				helper.setFrom(fromAddress);
				emailSender.send(mimeMessage);
				log.info("successfully send email for template: {}", template);
			} catch (Exception e) {
				log.error("error sending email because of reason : {}", e.getMessage());
				log.error(e);
			}
		}else{
			log.error("JavaMailer not found for sending email");
		}

	}

	private String buildMessageUsingParameters(String templateName, Map<String,String> parameters) throws IOException {
		StringBuilder message = new StringBuilder();
		InputStream is = getClass().getClassLoader().getResourceAsStream("email/" + templateName + ".tmpl");
		String template = IOUtils.toString(is, StandardCharsets.UTF_8.name());
		for(String paramKey: parameters.keySet()){
			String paramExpression = "{{" + paramKey + "}}";
			if(template.contains(paramExpression)){
				template = template.replace(paramExpression, parameters.get(paramKey));
			}

		}
		return template;
	}
}
