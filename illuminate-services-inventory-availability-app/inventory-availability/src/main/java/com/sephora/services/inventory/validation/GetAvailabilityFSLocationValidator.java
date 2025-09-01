package com.sephora.services.inventory.validation;

import java.util.ArrayList;
import java.util.List;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;

import com.sephora.services.inventoryavailability.model.availabilitysp.request.FulfillmentTypeEnum;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.LocationsByFulfillmentType;

public class GetAvailabilityFSLocationValidator implements ConstraintValidator<GetAvailabilityFSLocationValid, LocationsByFulfillmentType>{
	
	@Value("#{'${shipment.dc-locations:0701,0801,1001,1021,1050,0750,1070}'.split(',')}")
	List<String> dcShipmentLocations = new ArrayList<>();
	
	@Override
	public boolean isValid(LocationsByFulfillmentType value, ConstraintValidatorContext context) {
		if(null != value && (FulfillmentTypeEnum.SHIP.toString().equals(value.getFulfillmentType())
				|| FulfillmentTypeEnum.SHIPTOHOME.toString().equals(value.getFulfillmentType()))) {
			if(!CollectionUtils.isEmpty(value.getLocations()) && !dcShipmentLocations.containsAll(value.getLocations())) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("Invalid dc locations").addConstraintViolation();
				return false;
			} else {
				return true;
			}
			
		} else if(null != value && CollectionUtils.isEmpty(value.getLocations())) {
			return false;
		} else {
			return true;
		}
	}
}
