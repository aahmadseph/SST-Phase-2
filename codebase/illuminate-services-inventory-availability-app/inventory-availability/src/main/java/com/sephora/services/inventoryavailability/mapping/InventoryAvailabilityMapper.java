package com.sephora.services.inventoryavailability.mapping;

import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.dto.graphql.AvailableInventoryInput;
import org.mapstruct.Mapper;

@Mapper
public interface InventoryAvailabilityMapper {
    SitePageAvailabilityDto convert(AvailableInventoryInput availableInventoryInput);
}
