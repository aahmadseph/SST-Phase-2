package com.sephora.services.inventoryavailability.mapping;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.sephora.services.inventoryavailability.model.LocationEligibilityRequest;
import com.sephora.services.inventoryavailability.model.dto.LocationEligibilityDTO;


@Mapper
public interface LocationEligibilityMapper {
	String TRANSACTION_TYPE = "DEFAULT";
	String LOCATION_TYPE = "DC";
	String ORG_ID = "SEPHORA";
			
	@Mapping(source = "locationId", target = "locationId" )
	@Mapping(source = "fulfillmentType", target = "fulfillmentType")
	@Mapping(source = "sellingChannel", target = "sellingChannel")
	@Mapping(source = "enabled", target = "enabled")
	@Mapping(source = "updateUser", target = "updateUser")
	@Mapping(target = "transactionType", constant = TRANSACTION_TYPE)
	@Mapping(target = "locationType", constant = LOCATION_TYPE)
	@Mapping(target = "orgId", constant = ORG_ID)
	LocationEligibilityRequest convert(LocationEligibilityDTO locationEligibilityDTO);
}
