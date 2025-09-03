package com.sephora.services.sourcingoptions.service.impl;

import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.service.SourcingHubZoneMapCsvUploadService;
import org.springframework.web.multipart.MultipartFile;

public class SourcingHubZoneMapCsvUploadServiceImpl implements SourcingHubZoneMapCsvUploadService {
    @Override
    public void uploadCsvZoneMapsForSourcingHub(EnterpriseCodeEnum enterpriseCode, MultipartFile inputFile) throws SourcingServiceException {

    }
}
