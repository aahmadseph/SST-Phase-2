package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import org.springframework.web.multipart.MultipartFile;

public interface SourcingHubZoneMapCsvUploadService {

    void uploadCsvZoneMapsForSourcingHub(EnterpriseCodeEnum enterpriseCode, MultipartFile inputFile) throws SourcingServiceException;
}
