package com.sephora.services.inventoryavailability.mapping;

import java.util.ArrayList;
import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Value;

import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.model.nodecontrol.NodeControlDTO;
import com.sephora.services.inventoryavailability.model.nodecontrol.availabilityhub.NodeControlRequest;

@Mapper
public abstract class NodeControlMapper {
	
	@Value("#{'${shipment.dc-locations:0701,0801,1001,1021,1050,0750,1070}'.split(',')}")
	List<String> dcShipmentLocations = new ArrayList<>();
	
	@Value("${availabilityhub.defaultOrgId:SEPHORA}")
	String orgId;
	
	@Value("${availabilityhub.defaultSegment:DEFAULT}")
	String segment;
	
	@Value("${availabilityhub.defaultSupplyType:ONHAND}")
	String supplyType;
	
	@Mapping(source = "locationId", target = "locationId")
	@Mapping(source = "productId", target = "locationType")
	@Mapping(source = "expirationTime", target = "tdet")
	@Mapping(source = "uom", target = "uom")
	@Mapping(source = "updateUser", target = "updateUser")
	public abstract NodeControlRequest convert(NodeControlDTO nodeControlDTO);
	
	@AfterMapping
	void afterMapping(NodeControlDTO nodeDTO, @MappingTarget NodeControlRequest.NodeControlRequestBuilder request) {
		request.locationType(dcShipmentLocations.contains(nodeDTO.getLocationId()) ? AvailabilityConstants.DC
				: AvailabilityConstants.STORE);
		request.orgId(orgId);
		request.segment(segment);
		request.supplyType(supplyType);
	}
}
