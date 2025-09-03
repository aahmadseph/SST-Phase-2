package com.sephora.services.sourcingoptions.service;

import org.springframework.web.multipart.MultipartFile;

import com.sephora.services.sourcingoptions.exception.SourcingItemsServiceException;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.BatchOperationResultBean;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;


public interface ZoneMapCsvUploadService {

    void uploadCsvZoneMapsForSourcingHub(EnterpriseCodeEnum enterpriseCode, MultipartFile inputFile, Boolean publishExternally) throws SourcingServiceException;

    void uploadCvsZoneMaps(EnterpriseCodeEnum enterpriseCode,  MultipartFile inputFile) throws SourcingServiceException;
    
    BatchOperationResultBean processCvsZoneMaps(EnterpriseCodeEnum enterpriseCode) throws SourcingServiceException;
}
