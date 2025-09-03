package com.sephora.services.sourcingoptions.service;

public interface ZipCodeRampupService {
    Boolean isZipCodeEligibleForSourcingHubCall(String zipCode, String enterpriseCode);
    Boolean isZipCodeEligibleForSDDOpt(String zipCode, String enterpriseCode);
}
