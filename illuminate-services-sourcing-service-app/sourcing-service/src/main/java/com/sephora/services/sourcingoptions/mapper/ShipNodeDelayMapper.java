package com.sephora.services.sourcingoptions.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import com.sephora.services.sourcingoptions.SourcingOptionConstants;
import com.sephora.services.sourcingoptions.model.SourcingOptionsMapperContext;
import com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ShipNodeDelayRequestDto;
import com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ah.request.AHShipNodeDelayRequestDto;
import com.sephora.services.sourcingoptions.util.SourcingUtils;

@Mapper
public interface ShipNodeDelayMapper {
	@Mapping(source = "ruleId", target = "ruleId")
	@Mapping(source = "shipNode", target = "locationId")
	@Mapping(source = "delayTime", target = "processingTimeBuffer", qualifiedByName="convertDayToMinutes")
	@Mapping(source = "startDateTime", target = "startDateTime", qualifiedByName = "appandTimeZoneOffset")
	@Mapping(source = "endDateTime", target = "endDateTime", qualifiedByName = "appandTimeZoneOffset")
	public AHShipNodeDelayRequestDto convert(ShipNodeDelayRequestDto shipNodeDelayRequestDto, @Context SourcingOptionsMapperContext sourcingOptionsAHConfiguration);
	
	@Named("appandTimeZoneOffset")
	default String appandTimeZoneOffset(String startDateTime, @Context SourcingOptionsMapperContext sourcingOptionsAHConfiguration) {
		return startDateTime.concat(sourcingOptionsAHConfiguration.getTimeZoneOffset());
	}
	
	@Named("convertDayToMinutes")
	default Integer convertDayToMinutes(Integer delayTime) {
		//1 Day = 1440 min
		return (delayTime * 1440);
	}
	@AfterMapping
	default void afterMapping(ShipNodeDelayRequestDto shipNodeDelayRequestDto, 
			@MappingTarget AHShipNodeDelayRequestDto ahShipNodeDelayRequestDto, @Context SourcingOptionsMapperContext sourcingOptionsAHConfiguration) {
		//making ruleId unique
		if(sourcingOptionsAHConfiguration.getLevelOfService().contains("_")){
			ahShipNodeDelayRequestDto.setRuleId(shipNodeDelayRequestDto.getRuleId() + "_" + sourcingOptionsAHConfiguration.getLevelOfService().split("_")[1]);
		}
		ahShipNodeDelayRequestDto.setFulfillmentService(sourcingOptionsAHConfiguration.getLevelOfService());
		ahShipNodeDelayRequestDto.setOrgId(sourcingOptionsAHConfiguration.getOrgId());
		ahShipNodeDelayRequestDto.setUpdateUser(SourcingOptionConstants.OMS);
		ahShipNodeDelayRequestDto.setLocationType(
				sourcingOptionsAHConfiguration.getConfiguration().getDcLocations().contains(shipNodeDelayRequestDto.getShipNode()) ?
				SourcingOptionConstants.DC : SourcingOptionConstants.STORE);
		ahShipNodeDelayRequestDto.setUpdateTime(SourcingUtils.currentDateTime(sourcingOptionsAHConfiguration.getTimeZone()));
	}
} 
