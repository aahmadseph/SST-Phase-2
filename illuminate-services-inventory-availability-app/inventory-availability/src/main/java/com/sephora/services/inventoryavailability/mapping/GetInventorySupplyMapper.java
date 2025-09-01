package com.sephora.services.inventoryavailability.mapping;

import java.util.Arrays;
import java.util.List;

import com.sephora.services.inventoryavailability.config.InventorySupplyDefaultConfig;
import com.sephora.services.inventoryavailability.model.Location;
import com.sephora.services.inventoryavailability.model.SupplyType;
import org.mapstruct.Mapper;

import com.sephora.services.inventoryavailability.model.PhysicalInventory;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyCallerResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupply;
import org.springframework.stereotype.Component;

@Mapper
@Component
public class GetInventorySupplyMapper {
	
	/**
	 * This method is used to convert search response from Availability Hub to caller format.
	 * @param getInventorySupplyAHResponse
	 * @return
	 */
	public GetInventorySupplyCallerResponse convert(GetInventorySupplyAHResponse getInventorySupplyAHResponse) {
		List<PhysicalInventory> physicalInventies = getInventorySupplyAHResponse.getPhysicalInventory();
		InventorySupply inventorySupply = null;
		if(physicalInventies.size() > 0) {
			inventorySupply = InventorySupply.builder().location(physicalInventies.get(0).getLocations()).build();
		}
		
		return GetInventorySupplyCallerResponse.builder().productId(getInventorySupplyAHResponse.getProductId())
			.uom(getInventorySupplyAHResponse.getUom())
			.inventorySupplies(Arrays.asList(inventorySupply)).build();
	}

    public GetInventorySupplyCallerResponse createResponseForNoContentResponse(String productId, String uom, String locationId, InventorySupplyDefaultConfig supplyConfig) {
		return GetInventorySupplyCallerResponse.builder()
				.productId(productId)
				.uom(uom)
				.inventorySupplies(Arrays.asList(
						InventorySupply.builder()
								.location(Arrays.asList(Location.builder()
										.locationId(locationId)
										.supplyTypes(Arrays.asList(
												SupplyType.builder()
														.quantity(0D)
														.segment(supplyConfig.getDefaultSegment())
														.supplyType(supplyConfig.getDefaultSupplyType())
														.build()
										))
										.build()))
								.build()
				))
				.build();
    }
}
