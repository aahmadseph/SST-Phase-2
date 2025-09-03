package com.sephora.services.sourcingoptions.service;

public interface EmailService {
	public void sendZoneMapUploadConfirmationMail(String fileName);
	public void sendZoneMapProcessConfirmationMail(String enterpriseCode);
}
