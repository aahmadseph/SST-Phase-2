package com.sephora.services.inventoryavailability.graph;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.exceptions.DgsBadRequestException;
import com.sephora.services.inventory.service.GetAvailabilityForSitePagesV2Service;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.mapping.InventoryAvailabilityMapper;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.SitePageAvailabilityResponse;
import com.sephora.services.inventoryavailability.model.availabilityspv2.request.SitePageAvailabilityDtoV2;
import com.sephora.services.inventoryavailability.model.dto.graphql.AvailableInventoryInput;
import com.sephora.services.inventoryavailability.service.IntransitInventoryService;
import graphql.execution.DataFetcherResult;
import io.micrometer.core.annotation.Timed;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
@Log4j2
public class InventoryAvailabilityDataFetcher {

    @Autowired
    InventoryAvailabilityMapper inventoryAvailabilityMapper;

    @Autowired
    IntransitInventoryService intransitInventoryService;

    @Autowired
    GetAvailabilityForSitePagesV2Service availabilityForSitePagesV2Service;


    @DgsQuery
    @Timed
    public DataFetcherResult<SitePageAvailabilityResponse> availableInventory(@InputArgument AvailableInventoryInput input, Boolean details) {
        SitePageAvailabilityDto sitePageAvailability = inventoryAvailabilityMapper.convert(input);
        return DataFetcherResult.<SitePageAvailabilityResponse>newResult()
                .data(intransitInventoryService.availableInventory(sitePageAvailability, details))
                .build();
    }

    @DgsQuery
    @Timed
    public DataFetcherResult<SitePageAvailabilityResponse> availabilityForSite(@InputArgument SitePageAvailabilityDtoV2 input) throws AvailabilityServiceException {
        boolean productByLocationNotFound = input.getLocationsByFulfillmentType() == null || input.getLocationsByFulfillmentType().stream()
                .allMatch(locationsByFulfillmentTypeV2 -> null == locationsByFulfillmentTypeV2.getProductsByLocation());
        if (null == input.getProducts() && productByLocationNotFound) {
            throw new DgsBadRequestException("both products and productsByLocation cannot be null");
        }
        SitePageAvailabilityResponse sitePageAvailability = availabilityForSitePagesV2Service.getAvailability(input);
        return DataFetcherResult.<SitePageAvailabilityResponse>newResult()
                .data(sitePageAvailability)
                .build();
    }
}
