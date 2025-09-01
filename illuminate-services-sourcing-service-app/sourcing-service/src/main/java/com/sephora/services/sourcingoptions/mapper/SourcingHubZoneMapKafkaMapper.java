package com.sephora.services.sourcingoptions.mapper;

import com.sephora.services.sourcingoptions.model.cosmos.TempZoneMap;
import com.sephora.services.sourcingoptions.model.cosmos.ZipCodeDetails;
import com.sephora.services.sourcingoptions.model.dto.zonemap.SourcingHubZoneMapInfo;
import com.sephora.services.sourcingoptions.model.dto.zonemap.SourcingHubZoneMapKafkaMessage;
import com.sephora.services.sourcingoptions.model.dto.zonemap.Zone;
import com.sephora.services.sourcingoptions.model.dto.zonemap.ZoneMapMapperContext;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.*;

@Mapper
public interface SourcingHubZoneMapKafkaMapper {

    List<SourcingHubZoneMapKafkaMessage> convert(List<ZipCodeDetails> zipCodeDetails, @Context ZoneMapMapperContext context);


    default SourcingHubZoneMapKafkaMessage convert(ZipCodeDetails zipCodeDetails, @Context ZoneMapMapperContext context){
        if(zipCodeDetails == null){
            return null;
        }
        SourcingHubZoneMapKafkaMessage kafkaMessage= new SourcingHubZoneMapKafkaMessage();
        kafkaMessage.setIsFullyQualifiedTopicName(false);
        kafkaMessage.setKey(getKey(zipCodeDetails, context));
        kafkaMessage.setOperation(context.getOperation());
        kafkaMessage.setTopic(context.getTopic());
        kafkaMessage.setValue(convert(context, zipCodeDetails));
        return kafkaMessage;
    }

    default Map<String, String> getKey(ZipCodeDetails zipCodeDetails, ZoneMapMapperContext context){
        /**
         * {
         *         ""beginZipCode"": ""005"",
         *         ""endZipCode"": ""005"",
         *         ""countryCode"": ""US"",
         *         ""orgId"": ""SEPHORA""
         *     }
         */
        if(zipCodeDetails == null){
            return null;
        }
        Map<String, String> keyMap = new HashMap<>();
        keyMap.put("beginZipCode", zipCodeDetails.getFromZipCode());
        keyMap.put("endZipCode", zipCodeDetails.getToZipCode());
        keyMap.put("countryCode", context.getCountryCode());
        keyMap.put("orgId", context.getOrgId());
        return keyMap;
    }

    default SourcingHubZoneMapInfo convert(@Context ZoneMapMapperContext context, ZipCodeDetails zipCodeDetails){
        if(zipCodeDetails == null){
            return null;
        }
        SourcingHubZoneMapInfo info = new SourcingHubZoneMapInfo();
        info.setBeginZipCode(zipCodeDetails.getFromZipCode());
        info.setEndZipCode(zipCodeDetails.getToZipCode());
        info.setState(zipCodeDetails.getState());
        info.setCountryCode(context.getCountryCode());
        info.setOrgId(context.getOrgId());
        info.setUpdateTime(new Date().toInstant().toString());
        info.setUpdateUser(context.getUpdateUser());
        info.setZones(getZones(zipCodeDetails.getPriority()));
        return info;
    }

    default List<Zone> getZones(List<String> priority){
        if(priority == null){
            return null;
        }
        List<Zone> zones = new ArrayList<>();
        for(int i =0; i< priority.size(); i++){
            Zone zone = new Zone();
            zone.setZone(String.valueOf(i + 1));
            zone.setLocationId(priority.get(i));
            zones.add(zone);
        }
        return zones;
    }
}
