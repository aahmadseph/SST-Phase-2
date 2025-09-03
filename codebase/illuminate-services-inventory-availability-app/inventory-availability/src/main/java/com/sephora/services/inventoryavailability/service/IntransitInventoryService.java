package com.sephora.services.inventoryavailability.service;

import com.sephora.services.inventory.model.intransitbydate.InTransitByDateDTO;
import com.sephora.services.inventory.service.GetAvailabilityForSitePagesService;
import com.sephora.services.inventory.service.availability.impl.IntransitCacheAvailabilityService;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByFT;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.SitePageAvailabilityResponse;
import com.sephora.services.inventoryavailability.model.dto.graphql.IntransitAvailabilityByLocation;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
public class IntransitInventoryService {

    @Autowired
    private GetAvailabilityForSitePagesService getAvailabilityForSitePagesService;

    @Autowired
    private IntransitCacheAvailabilityService intransitCacheAvailabilityService;

    public SitePageAvailabilityResponse availableInventory(SitePageAvailabilityDto sitePageAvailability, Boolean details) {
        try {
            SitePageAvailabilityResponse sitePageAvailabilityResponse = getAvailabilityForSitePagesService.getAvailability(sitePageAvailability, details);

            // Getting list of unique store id from the request.
            Set<String> locations = sitePageAvailability.getLocationsByFulfillmentType().stream()
                    .flatMap(locationsByFulfillmentType -> locationsByFulfillmentType.getLocations().stream())
                    .collect(Collectors.toSet());

            // Create Map<storeId, Map<productId, intransitByDateDto>> by reading intransit inventory data from redis cache.
            Map<String, Map<String, InTransitByDateDTO>> intransitAvailabilityMap = intransitCacheAvailabilityService
                    .getIntransitAvailability(new HashSet<>(sitePageAvailability.getProducts()), locations);

            return mergeInTransitAvailabilityData(sitePageAvailabilityResponse, intransitAvailabilityMap);
        } catch (AvailabilityServiceException e) {
            throw new RuntimeException(e);
        }
    }

    private SitePageAvailabilityResponse mergeInTransitAvailabilityData(SitePageAvailabilityResponse sitePageAvailabilityResponse, Map<String, Map<String, InTransitByDateDTO>> intransitAvailabilityMap) {
        // Merging intransit inventory data along with the site page availability response.
        List<AvailabilityByProduct> availabilityByProducts = sitePageAvailabilityResponse.getAvailabilityByProducts().stream().map(availabilityByProduct -> {
            if (CollectionUtils.isEmpty(availabilityByProduct.getAvailabilityDetails().getAvailabilityByFT())) return availabilityByProduct;
            List<AvailabilityByFT> availabilityByFTList = availabilityByProduct.getAvailabilityDetails().getAvailabilityByFT().stream()
                    .map(availabilityByFT -> {
                        if (CollectionUtils.isEmpty(availabilityByFT.getLocations())) return availabilityByFT;
                        List<AvailabilityByLocation> availabilityByLocations = availabilityByFT.getLocations().stream()
                                .map(availabilityByLocation -> {
                                    Map<String, InTransitByDateDTO> inTransitByDateDTOMap = intransitAvailabilityMap.get(availabilityByLocation.getLocation());
                                    if (ObjectUtils.isEmpty(inTransitByDateDTOMap)) return availabilityByLocation;
                                    return IntransitAvailabilityByLocation.builder()
                                            .location(availabilityByLocation.getLocation())
                                            .atpStatus(availabilityByLocation.getAtpStatus())
                                            .atp(availabilityByLocation.getAtp())
                                            .arrivalDates(!ObjectUtils.isEmpty(inTransitByDateDTOMap.get(availabilityByProduct.getProductId())) ?
                                                    inTransitByDateDTOMap.get(availabilityByProduct.getProductId()).getArrivalDates() : null)
                                            .build();
                                })
                                .collect(Collectors.toList());
                        availabilityByFT.setLocations(availabilityByLocations);
                        return availabilityByFT;
                    }).collect(Collectors.toList());
            availabilityByProduct.getAvailabilityDetails().setAvailabilityByFT(availabilityByFTList);
            return availabilityByProduct;
        }).collect(Collectors.toList());
        sitePageAvailabilityResponse.setAvailabilityByProducts(availabilityByProducts);
        return sitePageAvailabilityResponse;
    }
}
