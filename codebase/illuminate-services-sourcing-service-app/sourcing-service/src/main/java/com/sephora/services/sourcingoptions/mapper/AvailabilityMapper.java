package com.sephora.services.sourcingoptions.mapper;

import com.sephora.services.sourcingoptions.config.AvailabilityConfiguration;
import com.sephora.services.sourcingoptions.config.AvailabilityShipNodeConfiguration;
import com.sephora.services.sourcingoptions.model.AvailabilitySourcingContext;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import com.sephora.services.sourcingoptions.model.SellerCodeEnum;
import com.sephora.services.sourcingoptions.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.sourcingoptions.model.availability.request.Location;
import com.sephora.services.sourcingoptions.model.availability.request.Product;
import com.sephora.services.sourcingoptions.model.dto.*;
import com.sephora.services.sourcingoptions.util.SourcingUtils;
import org.apache.commons.lang3.StringUtils;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper
public interface AvailabilityMapper {

    @Mapping(target = "requestOrigin", ignore = true)
    AvailabilityRequestDto convert(SourcingOptionsResponseDto responseDto, @Context AvailabilitySourcingContext context);

    @AfterMapping
    default void afterSourcingOptionsResponseMapping(SourcingOptionsResponseDto responseDto, @MappingTarget AvailabilityRequestDto availabilityRequestDto,
                                                     @Context AvailabilitySourcingContext context) {
        AvailabilityConfiguration availabilityConfiguration = context.getConfig();
        availabilityRequestDto.setSellingChannel(context.getRequest().getSellerCode());
        if(context.getRequest().getSellerCode().equals(SellerCodeEnum.SEPHORADOTCOM.toString())){
            availabilityRequestDto.setSellingChannel(EnterpriseCodeEnum.SEPHORAUS.toString());
        }else if(context.getRequest().getSellerCode().equals(SellerCodeEnum.SEPHORADOTCA.toString())){
            availabilityRequestDto.setSellingChannel(EnterpriseCodeEnum.SEPHORACA.toString());
        }else if(context.getRequest().getSellerCode().equals(SellerCodeEnum.BORDERFREE.toString())){
            availabilityRequestDto.setSellingChannel(EnterpriseCodeEnum.SEPHORAUS.toString());
        }
        SourcingOptionsRequestDto request = context.getRequest();
        availabilityRequestDto.setTransactionType(context.getRequest().getTransactionType());
        List<Product> products = new ArrayList<>();
        for (SourcingOptionsResponseItemDto item : responseDto.getItems()) {
            SourcingOptionsRequestItemDto requestItemDto = context.getRequest().getItems().stream().filter(sourcingOptionsRequestItemDto -> sourcingOptionsRequestItemDto.getItemId().equals(item.getItemId())).findFirst().get();
            String fulFillmentType = StringUtils.isBlank(requestItemDto.getFulfillmentType()) ? request.getFulfillmentType() : requestItemDto.getFulfillmentType();
            if (!fulFillmentType.equals(FulfillmentTypeEnum.SAMEDAY.toString())) {
                Product product = convert(item);
                product.setFulfillmentType(SourcingUtils.convertToYantriksFulfillmentType(fulFillmentType));
                if(isFPOAPOState(context.getRequest().getShippingAddress(), context.getAvailabilityShipNodeConfiguration())){
                    product.setLocations(convert(context.getAvailabilityShipNodeConfiguration().getApoFpoLocations().get(context.getRequest().getShippingAddress().getState())));
                }else if(StringUtils.isNotBlank(context.getRequest().getSellerCode())){
                    switch (context.getRequest().getSellerCode()) {
                        case "SEPHORADOTCOM":
                            product.setLocations(convert(availabilityConfiguration.getUsLocations()));
                            break;
                        case "SEPHORADOTCA":
                            product.setLocations(convert(availabilityConfiguration.getCaLocations()));
                            break;
                        case "BORDERFREE":
                            product.setLocations(convert(context.getAvailabilityShipNodeConfiguration().getBorderFreeLocations()));
                            break;
                        default:
                            //TODO check logic selling channel is invalid
                            product.setLocations(convert(availabilityConfiguration.getDcLocations()));
                    }
                }
                products.add(product);
            }

        }
        availabilityRequestDto.setProducts(products);

    }

    @Mapping(source = "itemId", target = "productId")
    @Mapping(target = "uom", constant = "EACH")
    Product convert(SourcingOptionsResponseItemDto item);

    default Boolean isFPOAPOState(ShippingAddressDto shippingAddress, AvailabilityShipNodeConfiguration config){
        if(shippingAddress != null && StringUtils.isNotBlank(shippingAddress.getState())){
            if(config != null && config.getApoFpoLocations() != null && config.getApoFpoLocations().keySet().contains(shippingAddress.getState())){
                return true;
            }
        }
        return false;
    }

    default List<Location> convert(List<String> locations) {
        if (locations == null) {
            return null;
        }
        List<Location> locationResponses = new ArrayList<>();
        for (String location : locations) {
            Location locationResponse = new Location();
            locationResponse.setLocationId(location);
            locationResponses.add(locationResponse);
        }
        return locationResponses;
    }
}
