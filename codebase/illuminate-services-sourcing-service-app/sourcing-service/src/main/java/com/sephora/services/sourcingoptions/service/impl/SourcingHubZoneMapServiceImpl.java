package com.sephora.services.sourcingoptions.service.impl;

import com.sephora.services.sourcingoptions.client.AvailabilityHubCommonClient;
import com.sephora.services.sourcingoptions.mapper.SourcingHubZoneMapKafkaMapper;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.TempZoneMap;
import com.sephora.services.sourcingoptions.model.cosmos.ZipCodeDetails;
import com.sephora.services.sourcingoptions.model.dto.zonemap.SourcingHubZoneMapKafkaMessage;
import com.sephora.services.sourcingoptions.model.dto.zonemap.ZoneMapMapperContext;
import com.sephora.services.sourcingoptions.service.SourcingHubZoneMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SourcingHubZoneMapServiceImpl implements SourcingHubZoneMapService {

    @Autowired
    private AvailabilityHubCommonClient availabilityHubCommonClient;

    @Autowired
    private SourcingHubZoneMapKafkaMapper mapper;

    @Override
    public void save(List<ZipCodeDetails> zipCodeDetails, String enterpriseCode) {
        ZoneMapMapperContext zoneMapMapperContext = null;
        if(enterpriseCode.equals(EnterpriseCodeEnum.SEPHORAUS.toString())){
            zoneMapMapperContext = new ZoneMapMapperContext();
            zoneMapMapperContext.setCountryCode("US");
        }else{
            zoneMapMapperContext = new ZoneMapMapperContext();
            zoneMapMapperContext.setCountryCode("CA");
        }
       List<SourcingHubZoneMapKafkaMessage> kafkaMessages = mapper.convert(zipCodeDetails, zoneMapMapperContext);
       for(SourcingHubZoneMapKafkaMessage kafkaMessage: kafkaMessages){
           availabilityHubCommonClient.submitZoneMappingKafkaMessage(kafkaMessage);
       }
    }
}
