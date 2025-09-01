package com.sephora.services.common.inventory.email;

import java.util.Map;

public interface EmailService {
	public void sendEmail(String template, String fromAddress, String[] toAddress, String[] ccAddress,
						  String subject, Map<String, String> parameters);
}
