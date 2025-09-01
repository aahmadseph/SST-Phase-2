package com.sephora.services.inventoryavailability.mapping;

import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.GetAvailabilityResponseData;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestLocation;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestProduct;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityByFulfillmentType;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemRequestDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;
import com.sephora.services.inventoryavailability.model.dto.Location;
import org.apache.commons.lang3.StringUtils;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Mapper
@Component
public interface GetAvailabilityMapper {
    InventoryItemsRequestDto convert(AvailabilityRequestDto requestDto, @Context InventoryApplicationConfig applicationConfig);

    @AfterMapping
    default InventoryItemsRequestDto afterAvailabilityRequestConversion(AvailabilityRequestDto requestDto,
                                                    @MappingTarget InventoryItemsRequestDto.InventoryItemsRequestDtoBuilder inventoryItemsRequestDto,
                                                    @Context InventoryApplicationConfig config){
        inventoryItemsRequestDto.orgId(config.getDefaultOrgId());
        InventoryItemsRequestDto request = inventoryItemsRequestDto.build();
        if(StringUtils.isEmpty(request.getTransactionType())){
            request.setTransactionType(config.getDefaultTransactionType());
        }
        return request;
    }

    List<InventoryItemRequestDto> convert(List<AvailabilityRequestProduct> products, @Context InventoryApplicationConfig config);
    /*@Mapping(source="fulfillmentType", target="fulfillmentType")*/
    InventoryItemRequestDto convert(AvailabilityRequestProduct product, @Context InventoryApplicationConfig config);


    default Location convert(AvailabilityRequestLocation availabilityRequestLocation, @Context InventoryApplicationConfig config){
        if(availabilityRequestLocation == null){
            return null;
        }
        Location location = new Location();
        location.setLocationId(availabilityRequestLocation.getLocationId());
        location.setLocationType(config.getDcLocations().contains(location.getLocationId()) ? AvailabilityConstants.DC : AvailabilityConstants.STORE);
        return location;
    }

    /*AvailabilityResponseDto convert(AvailabilityResponse itemsInventoryAvailability);*/
    /*@Mapping(source="sellingChannel", target="sellingChannel")*/
    AvailabilityResponseDto convert(GetAvailabilityResponseData itemsInventoryAvailability);

    GetAvailabilityResponseData buildAvailabilityResponseForNoContent(InventoryItemsRequestDto request, @Context InventoryApplicationConfig config);

    default AvailabilityByProduct buildNoContentProductResponse(InventoryItemRequestDto item, @Context InventoryApplicationConfig config){
        AvailabilityByProduct product = AvailabilityByProduct.builder()
                .productId(item.getProductId())
                .uom(item.getUom())
                .build();

        AvailabilityByFulfillmentType availabilityByFulfillmentType = AvailabilityByFulfillmentType.builder()
                .fulfillmentType(item.getFulfillmentType())
                .build();
        AvailabilityDetail availabilityDetail = new AvailabilityDetail();
        availabilityDetail.setAtp(0D);
        List<AvailabilityByLocation> locations = new ArrayList<>();
        for(Location requestLocation: item.getLocations()){
            AvailabilityByLocation location = AvailabilityByLocation.builder()
                    .locationId(requestLocation.getLocationId())
                    .atp(0D)
                    .locationType(config.getDcLocations().contains(
                            requestLocation.getLocationId()) ?
                            AvailabilityConstants.DC : AvailabilityConstants.STORE)
                    .build();
            locations.add(location);
        }
        availabilityDetail.setAvailabilityByLocations(locations);
        availabilityByFulfillmentType.setAvailabilityDetails(Arrays.asList(availabilityDetail));
        product.setAvailabilityByFulfillmentTypes(Arrays.asList(availabilityByFulfillmentType));
        return product;
    }
    @AfterMapping
    default GetAvailabilityResponseData buildAvailabilityResponseForNoContentAfterMapping(InventoryItemsRequestDto request,
                                                                                          @MappingTarget GetAvailabilityResponseData.GetAvailabilityResponseDataBuilder responseData,
                                                                                          @Context InventoryApplicationConfig config){
        List<AvailabilityByProduct> productList = new ArrayList<>();
        for(InventoryItemRequestDto item: request.getProducts()){
            //creating product
            productList.add(buildNoContentProductResponse(item, config));
        }
        responseData.availabilityByProducts(productList);
        return responseData.build();
    }
}
