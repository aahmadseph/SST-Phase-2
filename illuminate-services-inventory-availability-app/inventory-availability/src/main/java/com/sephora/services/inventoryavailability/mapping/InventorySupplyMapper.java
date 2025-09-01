package com.sephora.services.inventoryavailability.mapping;

import java.util.ArrayList;
import java.util.List;

import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Value;

import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyAudit;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyCallerResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyRequest;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyTo;
import org.springframework.stereotype.Component;


@Mapper
public class InventorySupplyMapper {
	
	@Value("#{'${shipment.dc-locations:0701,0801,1001,1021,1050,0750,1070}'.split(',')}")
	List<String> dcShipmentLocations = new ArrayList<>();
	
	@Value("${inventory.defaultEventType:SUPPLY_UPDATE}")
	private String eventType = "SUPPLY_UPDATE";
	
	@Value("${inventory.defaultOrgId:SEPHORA}")
	String orgId;
	
	/**
	 * This method is used to convert Inventory Supply DTO object from the caller to
	 * Availability Hub format.
	 * 
	 * @param inventorySupplyDTO
	 * @return
	 */
	public InventorySupplyRequest convert(InventorySupplyDTO inventorySupplyDTO) {
		InventorySupplyRequest request = InventorySupplyRequest.builder()
				.feedType(inventorySupplyDTO.getAdjustmentType())
				.locationId(inventorySupplyDTO.getLocationId())
				.productId(inventorySupplyDTO.getProductId())
				.quantity(inventorySupplyDTO.getQuantity())
				.uom(inventorySupplyDTO.getUom())
				.updateTimeStamp(inventorySupplyDTO.getUpdateTimeStamp())
				.eventType(eventType)
				.locationType(dcShipmentLocations.contains(inventorySupplyDTO.getLocationId()) ? AvailabilityConstants.DC : AvailabilityConstants.STORE)
				.orgId(orgId)
				.to(InventorySupplyTo.builder().segment("").supplyType(inventorySupplyDTO.getSupplyType()).build())
				.audit(InventorySupplyAudit.builder().transactionUser(inventorySupplyDTO.getUpdateUser())
						.transactionSystem(inventorySupplyDTO.getRequestOrigin()).build()).build();
			
		return request;
				
	}
	
	/**
	 * This method will convert updated inventory supply response from Availability
	 * Hub to the format which is supported by the caller.
	 * 
	 * @param inventorySupplyAHResponse
	 * @return
	 */
	public InventorySupplyCallerResponse convert(InventorySupplyAHResponse inventorySupplyAHResponse) {
		String locationId = "";
		String supplyType = "";
		double quantity = 0.0;
		if(null != inventorySupplyAHResponse && 
				null != inventorySupplyAHResponse.getPhysicalInventory() && inventorySupplyAHResponse.getPhysicalInventory().size() > 0) {
			if(null != inventorySupplyAHResponse.getPhysicalInventory().get(0).getLocations() && 
					inventorySupplyAHResponse.getPhysicalInventory().get(0).getLocations().size() > 0 ) {
				com.sephora.services.inventoryavailability.model.Location location= inventorySupplyAHResponse.getPhysicalInventory().get(0).getLocations().get(0);
				locationId = location.getLocationId();
				if(null != location.getSupplyTypes() && location.getSupplyTypes().size() > 0) {
					supplyType = location.getSupplyTypes().get(0).getSupplyType();
					quantity = location.getSupplyTypes().get(0).getQuantity();
				}
			}
		}
		
		return InventorySupplyCallerResponse.builder()
			.productId(inventorySupplyAHResponse.getProductId())
			.uom(inventorySupplyAHResponse.getUom())
			.locationId(locationId)
			.supplyType(supplyType)
			.quantity(quantity).build();
	}
}
