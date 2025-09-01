package com.sephora.services.sourcingoptions.service;


import com.sephora.services.sourcingoptions.client.InventoryAvailabilityServiceClient;
import com.sephora.services.sourcingoptions.config.AvailabilityConfiguration;
import com.sephora.services.sourcingoptions.config.AvailabilityShipNodeConfiguration;
import com.sephora.services.sourcingoptions.mapper.AvailabilityMapper;
import com.sephora.services.sourcingoptions.model.AvailabilitySourcingContext;
import com.sephora.services.sourcingoptions.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.sourcingoptions.model.availability.response.*;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestItemDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseItemDto;
import com.sephora.services.sourcingoptions.util.SourcingUtils;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@Log4j2
public class AvailabilitySvcService {

    @Autowired
    private InventoryAvailabilityServiceClient availabilityServiceClient;

    @Autowired
    private AvailabilityMapper availabilityMapper;

    @Autowired
    private AvailabilityConfiguration availabilityConfiguration;
    
    @Autowired
    private AvailabilityShipNodeConfiguration availabilityShipNodeConfiguration;


    public AvailabilityResponseDto getAvailability(AvailabilityRequestDto requestDto){
        DateTimeFormatter destDateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        String currentDateTime = destDateTimeFormatter.format(ZonedDateTime.now());
        requestDto.setCurrentDateTime(currentDateTime);
        requestDto.setRequestOrigin("INVS_RESERVATION");
        requestDto.setTransactionType(availabilityConfiguration.getDefaultTransactionType());
        log.info("getting availability for sourcing request");
        return availabilityServiceClient.getAvailability(requestDto);
    }

    public SourcingOptionsResponseDto getAvailabilityFromSourcingResponse(SourcingOptionsResponseDto response, SourcingOptionsRequestDto requestDto){
        AvailabilitySourcingContext context = new AvailabilitySourcingContext();
        context.setConfig(availabilityConfiguration);
        context.setRequest(requestDto);
        context.setAvailabilityShipNodeConfiguration(availabilityShipNodeConfiguration);
        log.info("getting availability information for sourcing response {}", response);
        AvailabilityRequestDto availabilityRequestDto = availabilityMapper.convert(response, context);
        if(CollectionUtils.isNotEmpty(availabilityRequestDto.getProducts())){
            AvailabilityResponseDto availabilityResponse = getAvailability(availabilityRequestDto);
            response = setAvailabilityInfoInResponse(response, availabilityResponse, requestDto);
            log.debug("successfully set availability information response {}", response);
        }
        return response;
    }

    private SourcingOptionsResponseDto setAvailabilityInfoInResponse(SourcingOptionsResponseDto response, AvailabilityResponseDto availabilityResponseDto, SourcingOptionsRequestDto sourcingOptionsRequestDto){
            for(SourcingOptionsResponseItemDto item: response.getItems()){
                    SourcingOptionsRequestItemDto requestItemDto = sourcingOptionsRequestDto
                            .getItems()
                            .stream()
                            .filter(sourcingOptionsRequestItemDto ->
                                    sourcingOptionsRequestItemDto.getItemId().equals(item.getItemId())).findFirst()
                            .orElse(null);
                    Optional<AvailabilityByProduct> availabilityItemOptional = availabilityResponseDto.getAvailabilityByProducts().stream().filter(availabilityByProduct -> availabilityByProduct.getProductId().equals(item.getItemId())).findFirst();
                    if (availabilityItemOptional.isPresent()) {
                        AvailabilityByProduct product = availabilityItemOptional.get();
                        //filtering by fulfillmentType, so there will be only one response.
                        //yantriks side SHIPTOHOME will be considered as SHIP
                        String fulfillmentType = SourcingUtils.convertToYantriksFulfillmentType(StringUtils.isEmpty(requestItemDto.getFulfillmentType()) ? sourcingOptionsRequestDto.getFulfillmentType() : requestItemDto.getFulfillmentType());
                        if(CollectionUtils.isNotEmpty(product.getAvailabilityByFulfillmentTypes())){
                            AvailabilityByFulfillmentType availabilityByFulfillmentType = product.getAvailabilityByFulfillmentTypes()
                                    .stream()
                                    .filter(availabilityByFulfillmentType1 ->
                                            availabilityByFulfillmentType1.getFulfillmentType()
                                                    .equals(fulfillmentType))
                                    .findFirst().orElse(null);
                            //purpose of an array for this response unknown
                            if(availabilityByFulfillmentType != null){
                                findMaxNodeQuantityAndTotalAvailableQty(availabilityByFulfillmentType, item);
                            }else{
                                item.setTotalAvailableQuantity(0l);
                                item.setMaxShipNodeQuantity(0l);
                            }

                        }

                    }else{
                        item.setTotalAvailableQuantity(0l);
                        item.setMaxShipNodeQuantity(0l);
                    }
            }
        return response;
    }

    private SourcingOptionsResponseItemDto findMaxNodeQuantityAndTotalAvailableQty(AvailabilityByFulfillmentType product, SourcingOptionsResponseItemDto item){
        if(product == null || CollectionUtils.isEmpty(product.getAvailabilityDetails())){
            return item;
        }
        Long maxQty = 0L;
        Long totalAvailableQuantity = 0L;
        for(AvailabilityDetail locationAvailability: product.getAvailabilityDetails()){
            totalAvailableQuantity = totalAvailableQuantity + locationAvailability.getAtp();
            if(locationAvailability.getAtp() > maxQty){
                maxQty = locationAvailability.getAtp();
            }
        }
        item.setMaxShipNodeQuantity(maxQty);
        item.setTotalAvailableQuantity(totalAvailableQuantity);
        //item.setShipNode(maxLocationAvailability.getLocationId());
        return item;
    }
}
