package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.model.cosmos.TempZoneMap;
import com.sephora.services.sourcingoptions.model.cosmos.ZipCodeDetails;
import com.sephora.services.sourcingoptions.model.dto.zonemap.SourcingHubZoneMapKafkaMessage;

import java.util.List;

public interface SourcingHubZoneMapService {
    public void save(List<ZipCodeDetails> zipCodeDetails, String enterpriseCode);
}
