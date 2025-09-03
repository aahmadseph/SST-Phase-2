package com.sephora.services.sourcingoptions.mapper;

import com.sephora.services.sourcingoptions.SourcingOptionConstants;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import com.sephora.services.sourcingoptions.model.SellerCodeEnum;
import com.sephora.services.sourcingoptions.model.SourcingOptionsMapperContext;
import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import com.sephora.services.sourcingoptions.model.dto.ShippingAddressDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestItemDto;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request.*;
import com.sephora.services.sourcingoptions.util.SourcingUtils;
import org.apache.commons.collections4.MapUtils;
import org.mapstruct.*;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Mapper
public interface SourcingPromiseDateMapper {

    @Mapping(source = "items", target = "cartLines")
    @Mapping(source = "transactionType", target = "transactionType", defaultValue = "DEFAULT")
    AHPromiseDateRequest convert(SourcingOptionsRequestDto sourcingOptionsRequestDto, @Context SourcingOptionsMapperContext sourcingOptionsAHConfiguration);


    @Mapping(source = "itemId", target = "productId")
    @Mapping(source = "requiredQuantity", target = "quantity")
    @Mapping(source = "uom", target = "uom", defaultValue="EACH")
    CartLine convert(SourcingOptionsRequestItemDto item, @Context SourcingOptionsMapperContext config);

    @Mapping(source = "country", target = "countryCode")
    @Mapping(source = "zipCode", target="zipCode", qualifiedByName="defultZipCode")
    ShippingAddress convert(ShippingAddressDto shippingAddressDto);
    
    @Named("defultZipCode")
    default String defultZipCode(String zipCode) {
    	if(StringUtils.isEmpty(zipCode)) {
    		return "11111";
    	} else {
    		return zipCode;
    	}
    }

    default List<CartLine> convert(List<SourcingOptionsRequestItemDto> items, @Context SourcingOptionsMapperContext context) {
        if (items == null) {
            return null;
        }
        List<CartLine> cartLines = new ArrayList<>();
        int counter = context.getCounter();
        for (SourcingOptionsRequestItemDto item : items) {
            String fulfillmentService = null;
            if (!StringUtils.isEmpty(item.getCarrierServiceCode()) && MapUtils.isNotEmpty(context.getItemCarrierServiceMap())) {
                if (context.getConfiguration().getEnableCarrierCodeAdjustment()) {
                    if (context.getConfiguration().getCarrierCodeAdjustments().containsKey(item.getCarrierServiceCode())) {
                        fulfillmentService = context.getConfiguration().getCarrierCodeAdjustments().get(item.getCarrierServiceCode());
                    }
                }
                if (fulfillmentService == null) {
                    CarrierService carrierService = context.getItemCarrierServiceMap().get(item.getCarrierServiceCode());
                    fulfillmentService = carrierService.getLevelOfService();
                }
            }else if(context.getLevelOfService() != null){
                fulfillmentService = context.getLevelOfService();
            }
            CartLine cartLine = convert(item, context);
            cartLine.setFulfillmentService(fulfillmentService);
            if(isCartLineTypeCarrierService(context, item)){
                cartLine.setCartLineType(SourcingOptionConstants.GIFTCARD);
            }else if(item.getLineType() != null && item.getLineType().equals("NONSHIP")){
                cartLine.setCartLineType(item.getLineType());
            }
            if (cartLine.getLineId() == null) {
                cartLine.setLineId(item.getItemId() + "_" + counter++);
            }
            if(item.getLocationIds() != null){
                cartLine.setSourcingLocations(convert(item.getLocationIds(), context.getConfiguration().getDcLocations()));
            }
            cartLines.add(cartLine);
        }
        context.setCounter(counter);
        return cartLines;
    }

    default boolean isCartLineTypeCarrierService(SourcingOptionsMapperContext context, SourcingOptionsRequestItemDto item){
        boolean result = false;
        if(context.getConfiguration().getCartLineTypeAdjustmentsEnabled()){
            if(!StringUtils.isEmpty(item.getCarrierServiceCode())){
                if(context.getConfiguration().getCartLineTypeCarrierServiceCodes().contains(item.getCarrierServiceCode())){
                    result = true;
                }
            }else{
                if(context.getLevelOfServiceMap() != null && context.getLevelOfServiceMap().containsKey(context.getLevelOfService())){
                    result = context.getLevelOfServiceMap().get(context.getLevelOfService()).stream().anyMatch(carrierService -> context.getConfiguration().getCartLineTypeCarrierServiceCodes().contains(carrierService.getCarrierServiceCode()));
                }
            }
        }
        return result;
    }


    @AfterMapping
    default void afterMapping(SourcingOptionsRequestDto sourcingOptionsRequestDto, @MappingTarget AHPromiseDateRequest promiseDateRequest, @Context SourcingOptionsMapperContext context) {
        Boolean isOmsRequest = sourcingOptionsRequestDto.getSourceSystem().equals("OMS");
        promiseDateRequest.setOrgId(context.getOrgId());
        //https://jira.sephora.com/browse/DEF-1629 --START
        promiseDateRequest.setCartType(sourcingOptionsRequestDto.getSellerCode());
        //https://jira.sephora.com/browse/DEF-1629 --END
        promiseDateRequest.setTransactionType(StringUtils.isEmpty(sourcingOptionsRequestDto.getTransactionType()) ?
                context.getTransactionType() : sourcingOptionsRequestDto.getTransactionType());
        if (sourcingOptionsRequestDto.getSellerCode().equals(SellerCodeEnum.SEPHORADOTCOM.toString())) {
            promiseDateRequest.setSellingChannel(EnterpriseCodeEnum.SEPHORAUS.toString());
        } else if (sourcingOptionsRequestDto.getSellerCode().equals(SellerCodeEnum.SEPHORADOTCA.toString())) {
            promiseDateRequest.setSellingChannel(EnterpriseCodeEnum.SEPHORACA.toString());
        } else if (sourcingOptionsRequestDto.getSellerCode().equals(SellerCodeEnum.BORDERFREE.toString())){
            promiseDateRequest.setSellingChannel(SourcingOptionConstants.SEPHORA_INTL);
        } else{
            promiseDateRequest.setSellingChannel(EnterpriseCodeEnum.SEPHORAUS.toString());
        }
        ShippingAddress shippingAddress = convert(sourcingOptionsRequestDto.getShippingAddress());
        try{
            shippingAddress.setZipCode(SourcingUtils.getNormalizedZipCodeForSourcingHub(shippingAddress.getZipCode(),
                    EnterpriseCodeEnum.valueOf(promiseDateRequest.getSellingChannel())));
        } catch(Exception e){
            e.printStackTrace();
        }

        /*for(SourcingOptionsRequestItemDto item: sourcingOptionsRequestDto.getItems()){
            for(String serviceCode: sourcingOptionsRequestDto.getCarrierServiceCodes()){

            }
        }*/
        for (CartLine cartLine : promiseDateRequest.getCartLines()) {
            // fulfillmentType should be there in either header level or item level.
            String fulfillmentType = StringUtils.isEmpty(cartLine.getFulfillmentType()) ? sourcingOptionsRequestDto.getFulfillmentType() : cartLine.getFulfillmentType();
            cartLine.setFulfillmentType(fulfillmentType);
            if (fulfillmentType.equals(FulfillmentTypeEnum.SHIPTOHOME.toString())) {
                cartLine.setFulfillmentType(SourcingOptionConstants.SHIPTOHOME_YANTRIKS);
            } else if(fulfillmentType.equals(FulfillmentTypeEnum.ELECTRONIC.toString())){
                if(!isOmsRequest){
                    //for OMS, already handled in list conversion
                    //set cartLineType is cartLineType is still empty
                    if(StringUtils.isEmpty(cartLine.getCartLineType())){
                        cartLine.setCartLineType("NONSHIP");
                    }
                    cartLine.setFulfillmentType(SourcingOptionConstants.SHIPTOHOME_YANTRIKS);
                }else{
                    cartLine.setFulfillmentType(fulfillmentType);
                }

            } else {
                cartLine.setFulfillmentType(fulfillmentType);
            }
            cartLine.setShippingAddress(shippingAddress);
            if(!fulfillmentType.equals(FulfillmentTypeEnum.SAMEDAY.toString())){
                cartLine.setSourcingConstraint(context.getSourcingConstraint());
            }
        }
    }


    default SourcingLocations convert(List<String> locationIds, List<String> dcLocations){
        if(locationIds == null || locationIds.isEmpty()){
            return null;
        }
        List<Location> locations = new ArrayList<>();
        for(String locationId: locationIds){
            String locationType = "STORE";
            if(dcLocations != null && dcLocations.contains(locationId)){
                locationType = "DC";
            }
            locations.add(new Location(locationId, locationType));
        }
        SourcingLocations sourcingLocations = new SourcingLocations();
        HashMap<String, List<Location>> include = new HashMap<>();
        include.put("1", locations);
        sourcingLocations.setInclude(include);
        return sourcingLocations;

    }
    /*@AfterMapping
    default void afterMappingCartLine(SourcingOptionsRequestItemDto item, @MappingTarget CartLine cartLine, @Context SourcingOptionsAHConfiguration config){
        cartLine.setUom(config.getUom());
    }*/
}
