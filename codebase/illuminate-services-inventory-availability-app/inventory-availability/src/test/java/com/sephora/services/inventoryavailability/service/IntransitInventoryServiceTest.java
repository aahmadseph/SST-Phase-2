package com.sephora.services.inventoryavailability.service;

import com.sephora.services.inventory.model.intransitbydate.ArrivalDate;
import com.sephora.services.inventory.model.intransitbydate.InTransitByDateDTO;
import com.sephora.services.inventory.service.GetAvailabilityForSitePagesService;
import com.sephora.services.inventory.service.availability.impl.IntransitCacheAvailabilityService;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.FulfillmentTypeEnum;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.LocationsByFulfillmentType;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.*;
import com.sephora.services.inventoryavailability.model.dto.graphql.IntransitAvailabilityByLocation;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AvailabilityConfig.class})
public class IntransitInventoryServiceTest {

    private static final String PRODUCT_ID1 = "20531";
    private static final String PRODUCT_ID2 = "29910";
    private static final String LOCATION_ID1 = "0401";
    private static final String LOCATION_ID2 = "0701";

    @MockBean
    GetAvailabilityForSitePagesService getAvailabilityForSitePagesService;

    @MockBean
    IntransitCacheAvailabilityService intransitCacheAvailabilityService;

    @Autowired
    IntransitInventoryService intransitInventoryService;

    @Test
    public void whenIntransitCacheAvailable_shouldMerge() throws AvailabilityServiceException {
        var sitePageAvailabilityDto = getSitePageAvailabilityDto();
        when(getAvailabilityForSitePagesService.getAvailability(sitePageAvailabilityDto, true)).thenReturn(getSitePageAvailabilityResponse());
        when(intransitCacheAvailabilityService.getIntransitAvailability(any(), any())).thenReturn(getIntransitMapByProduct());
        SitePageAvailabilityResponse sitePageAvailabilityResponse = intransitInventoryService.availableInventory(sitePageAvailabilityDto, true);

        assertNotNull(sitePageAvailabilityResponse);
        var availabilityByProduct1 = sitePageAvailabilityResponse.getAvailabilityByProducts().get(0);
        assertEquals(PRODUCT_ID1, availabilityByProduct1.getProductId());
        var availabilityByFT1 = availabilityByProduct1.getAvailabilityDetails().getAvailabilityByFT().get(0);
        var availabilityByLocation1 = (IntransitAvailabilityByLocation) availabilityByFT1.getLocations().get(0);
        var availabilityByLocation2 = availabilityByFT1.getLocations().get(1);
        assertEquals(LOCATION_ID1, availabilityByLocation1.getLocation());
        assertNotNull(availabilityByLocation1.getArrivalDates());
        assertEquals(LOCATION_ID2, availabilityByLocation2.getLocation());
        var availabilityByProduct2 = sitePageAvailabilityResponse.getAvailabilityByProducts().get(1);
        assertEquals(PRODUCT_ID2, availabilityByProduct2.getProductId());
        var availabilityByF2 = availabilityByProduct2.getAvailabilityDetails().getAvailabilityByFT().get(0);
        var availabilityByLocation21 = availabilityByF2.getLocations().get(0);
        var availabilityByLocation22 = (IntransitAvailabilityByLocation) availabilityByF2.getLocations().get(1);
        assertEquals(LOCATION_ID1, availabilityByLocation21.getLocation());
        assertEquals(LOCATION_ID2, availabilityByLocation22.getLocation());
        assertNotNull(availabilityByLocation22.getArrivalDates());
    }

    @Test
    public void whenIntransitCacheNotAvailable_shouldNotMerge() throws AvailabilityServiceException {
        var sitePageAvailabilityDto = getSitePageAvailabilityDto();
        Map<String, Map<String, InTransitByDateDTO>> intransitByProductMap = new HashMap<>();
        var sitePageAvailabilityResponse = getSitePageAvailabilityResponse();
        when(getAvailabilityForSitePagesService.getAvailability(sitePageAvailabilityDto, true)).thenReturn(sitePageAvailabilityResponse);
        when(intransitCacheAvailabilityService.getIntransitAvailability(any(), any())).thenReturn(intransitByProductMap);
        SitePageAvailabilityResponse sitePageAvailabilityResponseActual = intransitInventoryService.availableInventory(sitePageAvailabilityDto, true);

        assertNotNull(sitePageAvailabilityResponseActual);
        var availabilityByProduct1 = sitePageAvailabilityResponse.getAvailabilityByProducts().get(0);
        assertEquals(PRODUCT_ID1, availabilityByProduct1.getProductId());
        var availabilityByFT1 = availabilityByProduct1.getAvailabilityDetails().getAvailabilityByFT().get(0);
        assertThrows(ClassCastException.class, () -> {
            var availabilityByLocation1 = (IntransitAvailabilityByLocation) availabilityByFT1.getLocations().get(0);
        });
    }

    private Map<String, Map<String, InTransitByDateDTO>> getIntransitMapByProduct() {
        Map<String, Map<String, InTransitByDateDTO>> intransitMapByLocation = new HashMap<>();
        InTransitByDateDTO inTransitByDateDTO = InTransitByDateDTO.builder()
                .eventTimestamp("2021-11-17T02:12:48.926-07:00")
                .arrivalDates(List.of(ArrivalDate.builder()
                        .date("2024-06-07")
                        .quantity(10)
                        .build()))
                .build();
        Map<String, InTransitByDateDTO> inTransitMapByProduct1 = new HashMap<>();
        Map<String, InTransitByDateDTO> inTransitMapByProduct2 = new HashMap<>();
        inTransitMapByProduct1.put(PRODUCT_ID1, inTransitByDateDTO);
        inTransitMapByProduct2.put(PRODUCT_ID2, inTransitByDateDTO);
        intransitMapByLocation.put(LOCATION_ID1, inTransitMapByProduct1);
        intransitMapByLocation.put(LOCATION_ID2, inTransitMapByProduct2);
        return intransitMapByLocation;
    }

    private SitePageAvailabilityDto getSitePageAvailabilityDto() {
        LocationsByFulfillmentType locationByFulfillmentType = LocationsByFulfillmentType.builder()
                .fulfillmentType(FulfillmentTypeEnum.PICK.toString())
                .locations(List.of(LOCATION_ID1, LOCATION_ID2))
                .build();
        return SitePageAvailabilityDto.builder()
                .currentDateTime("2021-11-17T02:12:48.926-07:00")
                .evaluateCapacity("true")
                .evaluateNetworkAvail(true)
                .locationsByFulfillmentType(List.of(locationByFulfillmentType))
                .products(List.of(PRODUCT_ID1, PRODUCT_ID2))
                .sellingChannel("SEPHORAUS")
                .build();
    }

    private SitePageAvailabilityResponse getSitePageAvailabilityResponse() {

        AvailabilityByProduct availabilityByProduct1 = AvailabilityByProduct.builder()
                .productId(PRODUCT_ID1)
                .onhold(null)
                .availabilityDetails(AvailabilityDetail.builder()
                        .atp(1000.0)
                        .atpStatus("INSTOCK")
                        .availabilityByFT(List.of(AvailabilityByFT.builder()
                                .fulfillmentType(FulfillmentTypeEnum.PICK.toString())
                                .locations(List.of(
                                        AvailabilityByLocation.builder()
                                                .location(LOCATION_ID1)
                                                .atp(1000.0)
                                                .atpStatus("INSTOCK")
                                                .build(),
                                        AvailabilityByLocation.builder()
                                                .location(LOCATION_ID2)
                                                .atp(1000.0)
                                                .atpStatus("INSTOCK")
                                                .build()
                                ))
                                .build()))
                        .build())
                .build();
        AvailabilityByProduct availabilityByProduct2 = AvailabilityByProduct.builder()
                .productId(PRODUCT_ID2)
                .onhold(null)
                .availabilityDetails(AvailabilityDetail.builder()
                        .atp(1000.0)
                        .atpStatus("INSTOCK")
                        .availabilityByFT(List.of(AvailabilityByFT.builder()
                                .fulfillmentType(FulfillmentTypeEnum.PICK.toString())
                                .locations(List.of(
                                        AvailabilityByLocation.builder()
                                                .location(LOCATION_ID1)
                                                .atp(1000.0)
                                                .atpStatus("INSTOCK")
                                                .build(),
                                        AvailabilityByLocation.builder()
                                                .location(LOCATION_ID2)
                                                .atp(1000.0)
                                                .atpStatus("INSTOCK")
                                                .build()
                                ))
                                .build()))
                        .build())
                .build();
        return SitePageAvailabilityResponse.builder()
                .sellingChannel("SEPHORAUS")
                .availabilityByProducts(List.of(availabilityByProduct1, availabilityByProduct2))
                .build();
    }
}