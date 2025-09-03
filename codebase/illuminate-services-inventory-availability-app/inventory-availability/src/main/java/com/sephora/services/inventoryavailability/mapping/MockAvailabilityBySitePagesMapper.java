package com.sephora.services.inventoryavailability.mapping;

import com.sephora.services.inventory.config.MockSitePagesConfiguration;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.LocationsByFulfillmentType;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.*;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Mapper
public class MockAvailabilityBySitePagesMapper {


    public SitePageAvailabilityResponse convert(SitePageAvailabilityDto sitePageAvailability, Boolean isDetails, MockSitePagesConfiguration configuration) {
        SitePageAvailabilityResponse response = new SitePageAvailabilityResponse();
        response.setSellingChannel(sitePageAvailability.getSellingChannel());
        List<AvailabilityByProduct> products = new ArrayList<>();
        if(sitePageAvailability.getProducts() != null){
            for(String productId: sitePageAvailability.getProducts()){
                AvailabilityByProduct product = new AvailabilityByProduct();
                product.setProductId(productId);
                AvailabilityDetail availabilityDetail = new AvailabilityDetail();
                if(sitePageAvailability.getLocationsByFulfillmentType() != null){
                    List<AvailabilityByFT> availabilityByFTS = null;
                    for(LocationsByFulfillmentType locationsByFulfillmentType: sitePageAvailability.getLocationsByFulfillmentType()){
                        if(locationsByFulfillmentType.getFulfillmentType().equals(AvailabilityConstants.FULFILLMENT_TYPE_SHIP) ||
                                locationsByFulfillmentType.getFulfillmentType().equals(AvailabilityConstants.SHIPTOHOME)){
                                availabilityDetail.setAtp(configuration.getStockCount());
                                availabilityDetail.setAtpStatus(configuration.getDefaultStatus());
                        }else if(locationsByFulfillmentType.getFulfillmentType().equals(AvailabilityConstants.FULFILLMENT_TYPE_PICK)
                                || locationsByFulfillmentType.getFulfillmentType().equals(AvailabilityConstants.FULFILLMENT_TYPE_SAMEDAY)){
                            if(availabilityByFTS == null){
                                availabilityByFTS = new ArrayList<>();
                            }
                            AvailabilityByFT availabilityByFT = new AvailabilityByFT();
                            availabilityByFT.setFulfillmentType(locationsByFulfillmentType.getFulfillmentType());
                            if(!isDetails){
                                    String location = locationsByFulfillmentType.getLocations().stream().findFirst().orElse(null);
                                    if(location != null){
                                        availabilityByFT.setLocations(Arrays.asList(AvailabilityByLocation.builder()
                                                .location(location)
                                                .atpStatus(configuration.getDefaultStatus())
                                                .build()));
                                    }
                                }else{
                                    List<AvailabilityByLocation> locations = locationsByFulfillmentType.getLocations()
                                            .stream().map(s -> {
                                        return AvailabilityByLocation.builder()
                                                .location(s)
                                                .atp(configuration.getStockCount())
                                                .atpStatus(configuration.getDefaultStatus())
                                                .build();
                                    }).collect(Collectors.toList());
                                    availabilityByFT.setLocations(locations);
                                }
                            //availabilityByFT.set
                            availabilityByFTS.add(availabilityByFT);
                        }
                    }
                    availabilityDetail.setAvailabilityByFT(availabilityByFTS);
                    product.setAvailabilityDetails(availabilityDetail);
                    products.add(product);
                }
            }
        }
        response.setAvailabilityByProducts(products);
        return response;
    }
}
