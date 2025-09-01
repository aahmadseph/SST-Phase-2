package com.sephora.services.sourcingoptions.mapper;

import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import com.sephora.services.sourcingoptions.model.dto.*;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;

import com.sephora.services.sourcingoptions.config.SourcingOptionsConfiguration;
import com.sephora.services.sourcingoptions.model.UnavailableReasonsConst;
import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.AHPromiseDateResponseWithContext;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response.AHCartSourceResponse;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response.AuditDetail;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response.CartItem;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response.Shipment;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request.AHPromiseDateRequest;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request.CartLine;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.AHPromiseDateResponse;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.AuditDetails;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.DateInfo;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.Location;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.PromiseDate;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.datesbyservice.DatesByServicePromiseDate;
import com.sephora.services.sourcingoptions.model.dto.promisedate.PromiseDateResponseDto;
import com.sephora.services.sourcingoptions.util.SourcingUtils;

import static com.sephora.services.sourcingoptions.model.DeliveryDateTypeEnum.DELIVERY_BY;

@Mapper
public class SourcingAHPromiseDateMapper {

    @Value("${sourcing.options.availabilityhub.promiseDtByCarrierServiceEnabled:true}")
    private boolean promiseDtByCarrierServiceEnabled;

    public DatesByServicePromiseDate convert(DateInfo dateInfo){
        DatesByServicePromiseDate datesByServicePromiseDate = new DatesByServicePromiseDate();
        datesByServicePromiseDate.setDeliveryDate(dateInfo.getDeliveryDate());
        datesByServicePromiseDate.setOrderCutOffDate(dateInfo.getOrderCutOffDate());
        //datesByServicePromiseDate.setReservationDate(dateInfo.getRe);
        return datesByServicePromiseDate;
    }
    public SourcingOptionsResponseDto convert(List<AHPromiseDateResponseWithContext> responses,
                                              SourcingOptionsConfiguration configuration,
                                              Map<String, CarrierService> carrierCodeCarrierServiceMap,
                                              Map<String, List<CarrierService>> levelOfServiceMap,
                                              Map<String, String> itemIdCarrierServiceCodeMap,
                                              String fulfillmentType
    ) throws Exception{
        if (responses == null) {
            return null;
        }
        List<SourcingOptionsResponseItemDto> items = new ArrayList<>();
        Boolean available = true;
        List<AHPromiseDateResponseWithContext> auditDetails = responses.stream().filter(context -> MapUtils.isNotEmpty(context.getResponse().getAuditDetails())).collect(Collectors.toList());
        if (CollectionUtils.isNotEmpty(auditDetails)) {
            available = false;
        }
        SourcingOptionsResponseDto sourcingOptionsResponseDto = new SourcingOptionsResponseDto();
        sourcingOptionsResponseDto.setAvailable(available);
        List<PromiseDateResponseDto> promiseDates = null;
        Map<String,AuditDetails> productAuditDetailsMap = null;

        for (AHPromiseDateResponseWithContext context : responses) {
            AHPromiseDateResponse response = context.getResponse();
            if(MapUtils.isNotEmpty(response.getAuditDetails())){
                available = false;
                for(String lineId: response.getAuditDetails().keySet()){
                    if(productAuditDetailsMap == null){
                        productAuditDetailsMap = new HashMap<>();
                    }
                    CartLine cartLine = context.getRequest().getCartLines()
                            .stream().filter(lineDetails -> lineDetails.getLineId().equals(lineId))
                            .findFirst().get();
                    //carrier code doesn't have much to do in error response. If product is not available, the reason code will be the same for all
                    //so Ignoring repeated error responses in multiple requests send to yantriks.
                    String firstCarrierCode = response.getAuditDetails().get(lineId).keySet().iterator().next();
                    productAuditDetailsMap.put(cartLine.getProductId(), response.getAuditDetails().get(lineId).get(firstCarrierCode));
                }
            }
            if (response.getDates() != null) {
                for (PromiseDate promiseDate : response.getDates()) {
                    // if fulfillment type is electronic, then promise date is not expecting promisedate array
                    if (available && !fulfillmentType.equals(FulfillmentTypeEnum.ELECTRONIC.toString())) {
                        for (String carrierCode : promiseDate.getCustomerFulfillmentDates().keySet()) {
                            DateInfo dateInfo = promiseDate.getCustomerFulfillmentDates().get(carrierCode);
                            List<CarrierService> levelOfServiceCarrierServices = null;
                            if (levelOfServiceMap == null) {
                                String productId = context.getRequest().getCartLines().stream()
                                        .filter(cartLine -> cartLine.getLineId()
                                                .equals(promiseDate.getLineId())).findFirst().get().getProductId();
                                levelOfServiceCarrierServices = Arrays.asList(carrierCodeCarrierServiceMap.get(itemIdCarrierServiceCodeMap.get(productId)));
                            } else {
                                levelOfServiceCarrierServices = levelOfServiceMap.get(carrierCode);
                            }
                            for (CarrierService carrierService : levelOfServiceCarrierServices) {
                                String actualCarrierCode = carrierService.getCarrierServiceCode();
                                for (Location location : dateInfo.getLocations()) {
                                    PromiseDateResponseDto promiseDateResponseDto = new PromiseDateResponseDto();
                                    promiseDateResponseDto.setCarrierServiceCode(actualCarrierCode);
                                    promiseDateResponseDto.setShipNode(location.getLocationId());
                                    String timeZone = !StringUtils.isEmpty(location.getLocationLocale()) ? SourcingUtils.getZoneOffset(location.getLocationLocale()) : null;
                                    promiseDateResponseDto.setDcTimeZone(timeZone);
                                    promiseDateResponseDto.setCutoffTimestamp(SourcingUtils.convertToTimeZoneFromUTC(dateInfo.getOrderCutOffDate().getMax(), timeZone));
                                    promiseDateResponseDto.setDeliveryDate(SourcingUtils.convertToTimeZoneFromUTC(dateInfo.getDeliveryDate().getMax(), timeZone));
                                    promiseDateResponseDto.setShippingDate(SourcingUtils.convertToTimeZoneFromUTC(dateInfo.getShipDate().getMax(), timeZone));
                                    promiseDateResponseDto.setDeliveryDateType(carrierService.getDeliveryDateType());
                                    promiseDateResponseDto.setDelayAdded(location.isDelayFlag());
                                    if(promiseDates == null){
                                        promiseDates = new ArrayList<>();
                                    }
                                    promiseDates.add(promiseDateResponseDto);
                                }
                            }
                        }
                    }
                    String productId = context.getRequest().getCartLines().stream()
                            .filter(cartLine -> cartLine.getLineId()
                                    .equals(promiseDate.getLineId())).findFirst().get().getProductId();
                    if (items.stream().noneMatch(itemDto -> itemDto.getItemId().equals(productId))) {
                        SourcingOptionsResponseItemDto item = new SourcingOptionsResponseItemDto();
                        item.setItemId(productId);
                        if (!available) {
                            item.setRequestedQtyAvailable(false);
                            item.setUnavailableReason(UnavailableReasonsConst.SCHEDULING_CONSTRAINT_VIOLATION);
                        }else{
                            Optional<String> firstLocationOptional = promiseDate.getCustomerFulfillmentDates().keySet().stream().findFirst();
                            String firstLocation = null;
                            if (firstLocationOptional.isPresent()) {
                                firstLocation = firstLocationOptional.get();
                                List<Location> locations = promiseDate.getCustomerFulfillmentDates().get(firstLocation).getLocations();
                                if (CollectionUtils.isNotEmpty(locations)) {
                                    firstLocation = locations.get(0).getLocationId();
                                }

                            }
                            item.setShipNode(firstLocation);
                            item.setRequestedQtyAvailable(true);
                        }
                        items.add(item);
                    }
                }
            } else {
                available = false;
            }
        }

        if(!available){
            for(String unavailableProductId: productAuditDetailsMap.keySet()){
                SourcingOptionsResponseItemDto item = new SourcingOptionsResponseItemDto();
                item.setItemId(unavailableProductId);
                item.setRequestedQtyAvailable(false);
                item.setUnavailableReason(UnavailableReasonsConst.NOT_ENOUGH_PRODUCT_CHOICES);
                //item.setUnavailableReason(response.getAuditDetails().get(unavailableProductId).getReasonCode());
                items.add(item);
            }
        }
        /*if(!available){
            for(String unavailableProductId: response.getAuditDetails().keySet()){
                SourcingOptionsResponseItemDto item = new SourcingOptionsResponseItemDto();
                item.setItemId(unavailableProductId);
                item.setRequestedQtyAvailable(false);
                //item.setUnavailableReason(response.getAuditDetails().get(unavailableProductId).getReasonCode());
                items.add(item);
            }
        }*/
        sourcingOptionsResponseDto.setItems(items);
        sourcingOptionsResponseDto.setPromiseDates(promiseDates);
        return sourcingOptionsResponseDto;
    }
    
    /**
     * 
     * @param ahPromiseDateResponse
     * @param promiseDateRequest
     * @param carrierCodeCarrierServiceMap
     * @param levelOfServiceMap
     * @param itemIdCarrierServiceCodeMap
     * @param fulfillmentType
     * @return
     */
    public SourcingOptionsResponseDto convert(AHPromiseDateResponse ahPromiseDateResponse, 
			AHPromiseDateRequest promiseDateRequest,
			Map<String, CarrierService> carrierCodeCarrierServiceMap,
			Map<String, List<CarrierService>> levelOfServiceMap,
			Map<String, String> itemIdCarrierServiceCodeMap,
			String fulfillmentType) {
		if (ahPromiseDateResponse == null) {
			return null;
		}
		SourcingOptionsResponseDto sourcingOptionsResponseDto = new SourcingOptionsResponseDto();
		Map<String, PromiseDateResponseDto> promiseDateMap = new HashMap<String, PromiseDateResponseDto>();
		Map<String, SourcingOptionsResponseItemDto> itemMap = new HashMap<String, SourcingOptionsResponseItemDto>();
        Map<String, List<PromiseDateResponseDto>> promiseDateByCarrierServiceCode = new HashMap<String, List<PromiseDateResponseDto>>();

		Boolean available = MapUtils.isEmpty(ahPromiseDateResponse.getAuditDetails());

		sourcingOptionsResponseDto.setAvailable(available);

		if (!available) {
            for(String lineId: ahPromiseDateResponse.getAuditDetails().keySet()){
            	SourcingOptionsResponseItemDto item = getItemDetailsForUnavailableProduct(ahPromiseDateResponse, promiseDateRequest, lineId);
                itemMap.put(item.getItemId() ,item);
            }
		}
		if (null != ahPromiseDateResponse.getDates()) {
			for (PromiseDate promiseDate : ahPromiseDateResponse.getDates()) {
				// if fulfillment type is electronic, then promise date is not expecting
				// promisedate array
				List<CarrierService> levelOfServiceCarrierServices = null;
				String productId = promiseDateRequest.getCartLines().stream()
                         .filter(cartLine -> cartLine.getLineId()
                                 .equals(promiseDate.getLineId())).findFirst().get().getProductId();
				if (levelOfServiceMap == null) {                    
                    levelOfServiceCarrierServices = Arrays.asList(carrierCodeCarrierServiceMap.get(itemIdCarrierServiceCodeMap.get(productId)));
                }
				if (available && !fulfillmentType.equals(FulfillmentTypeEnum.ELECTRONIC.toString())) {
					for (Entry<String, DateInfo> dateInfoEntry : promiseDate.getCustomerFulfillmentDates().entrySet()) {
						DateInfo dateInfo = dateInfoEntry.getValue();
						String carrierCode = dateInfoEntry.getKey();
						
						if(null != levelOfServiceMap){
                            levelOfServiceCarrierServices = levelOfServiceMap.get(carrierCode);
                        }
						
						for (CarrierService carrierService : levelOfServiceCarrierServices) {
							String actualCarrierCode = carrierService.getCarrierServiceCode();
							for (Location location : dateInfo.getLocations()) {								
								String existingDeliveryDate = null;							
								if(promiseDateMap.containsKey(actualCarrierCode)) {
									existingDeliveryDate = promiseDateMap.get(actualCarrierCode).getDeliveryDate();
								} 
								PromiseDateResponseDto promiseDateResponseDto = buildPromiseDate(dateInfo, actualCarrierCode, location, carrierService.getDeliveryDateType(),existingDeliveryDate);	
								if(null != promiseDateResponseDto) {
									promiseDateMap.put(actualCarrierCode, promiseDateResponseDto);
								}
                                // Ensuring that promiseDateResponseDto is added to promiseDateByCarrierServiceCode regardless of the existing delivery date.
                                // This is required to maintain a complete record of all promise dates across different locations.
                                promiseDateByCarrierServiceCode
                                        .computeIfAbsent(actualCarrierCode, k -> new ArrayList<>())
                                        .add(buildPromiseDate(dateInfo, actualCarrierCode, location, DELIVERY_BY.ordinal(), null));
							}
						}
					}
				}
				
				if (!itemMap.containsKey(productId)) {
					SourcingOptionsResponseItemDto item = getItemDetails(productId, available, promiseDate);
                    itemMap.put(item.getItemId() ,item);
                }
			}
		}
		if(!promiseDateMap.isEmpty()) {
			sourcingOptionsResponseDto.setPromiseDates(new ArrayList<PromiseDateResponseDto>(promiseDateMap.values()));
		}
        if (promiseDtByCarrierServiceEnabled) {
            sourcingOptionsResponseDto.setPromiseDtByCarrierServiceNLocations(getPromiseDtByCarrierServiceNLocations(promiseDateByCarrierServiceCode));
        }
		sourcingOptionsResponseDto.setItems(new ArrayList<SourcingOptionsResponseItemDto>(itemMap.values()));
		return sourcingOptionsResponseDto;
	}

    private List<PromiseDtByCarrierServiceNLocation> getPromiseDtByCarrierServiceNLocations(Map<String, List<PromiseDateResponseDto>> promiseDateByCarrierServiceCode) {
        if (!promiseDateByCarrierServiceCode.isEmpty()) {
            List<PromiseDtByCarrierServiceNLocation> promiseDtByCarrierServiceNLocations = new ArrayList<>();
            for (Map.Entry<String, List<PromiseDateResponseDto>> entry : promiseDateByCarrierServiceCode.entrySet()) {
                if (null != entry.getValue()) {
                    var deliveryGroups = entry.getValue().stream()
                            .map(this::convert)
                            .distinct()
                            .sorted(Comparator.comparing(com.sephora.services.sourcingoptions.model.dto.Location::getDeliveryDate))
                            .collect(Collectors.toList());
                    if (!deliveryGroups.isEmpty()) {
                        PromiseDtByCarrierServiceNLocation promiseDtByCarrierServiceNLocation = new PromiseDtByCarrierServiceNLocation();
                        promiseDtByCarrierServiceNLocation.setCarrierServiceCode(entry.getKey());
                        promiseDtByCarrierServiceNLocation.setLocations(deliveryGroups);
                        promiseDtByCarrierServiceNLocations.add(promiseDtByCarrierServiceNLocation);
                    }
                }
            }
            if (CollectionUtils.isNotEmpty(promiseDtByCarrierServiceNLocations)) return promiseDtByCarrierServiceNLocations;
        }
        return null;
    }
    
    /**
     * 
     * @param productId
     * @param available
     * @param promiseDate
     * @return
     */
    private SourcingOptionsResponseItemDto getItemDetails(String productId, boolean available, PromiseDate promiseDate) {
    	SourcingOptionsResponseItemDto item = new SourcingOptionsResponseItemDto();
        item.setItemId(productId);
        if (!available) {
            item.setRequestedQtyAvailable(false);
            item.setUnavailableReason(UnavailableReasonsConst.SCHEDULING_CONSTRAINT_VIOLATION);
        } else{
            Optional<String> firstLocationOptional = promiseDate.getCustomerFulfillmentDates().keySet().stream().findFirst();
            String firstLocation = null;
            if (firstLocationOptional.isPresent()) {
                firstLocation = firstLocationOptional.get();
                List<Location> locations = promiseDate.getCustomerFulfillmentDates().get(firstLocation).getLocations();
                if (CollectionUtils.isNotEmpty(locations)) {
                    firstLocation = locations.get(0).getLocationId();
                }

            }
            item.setShipNode(firstLocation);
            item.setRequestedQtyAvailable(true);
        }
        return item;
    }
    
    /**
     * 
     * @param ahPromiseDateResponse
     * @param promiseDateRequest
     * @param lineId
     * @return
     */
    private SourcingOptionsResponseItemDto getItemDetailsForUnavailableProduct(AHPromiseDateResponse ahPromiseDateResponse, AHPromiseDateRequest promiseDateRequest, String lineId) {
    	
    	CartLine cartLine = promiseDateRequest.getCartLines()
                .stream().filter(lineDetails -> lineDetails.getLineId().equals(lineId))
                .findFirst().get();
        //carrier code doesn't have much to do in error response. If product is not available, the reason code will be the same for all
        //so Ignoring repeated error responses in multiple requests send to yantriks.
        String firstCarrierCode = ahPromiseDateResponse.getAuditDetails().get(lineId).keySet().iterator().next();
        AuditDetails auditDetails = ahPromiseDateResponse.getAuditDetails().get(lineId).get(firstCarrierCode);
    	
    	SourcingOptionsResponseItemDto item = new SourcingOptionsResponseItemDto();
        item.setItemId(cartLine.getProductId());
        item.setRequestedQtyAvailable(false);
        item.setUnavailableReason(UnavailableReasonsConst.NOT_ENOUGH_PRODUCT_CHOICES);
        
        return item;
    }
    
    /**
     * 
     * @param dateInfo
     * @param actualCarrierCode
     * @param location
     * @param deliveryDateTyp
     * @param existingDeliveryDate
     * @return
     */
    private PromiseDateResponseDto buildPromiseDate(DateInfo dateInfo, String actualCarrierCode, Location location, Integer deliveryDateTyp, String existingDeliveryDate) {
    	PromiseDateResponseDto promiseDateResponseDto = new PromiseDateResponseDto();
    	try {
	    	String timeZone = !StringUtils.isEmpty(location.getLocationLocale())? SourcingUtils.getZoneOffset(location.getLocationLocale()): null;
	    	String newDeliveryDate = SourcingUtils.convertToTimeZoneFromUTC(dateInfo.getDeliveryDate().getMax(), timeZone);
	    	
	    	if(existingDeliveryDate!= null && newDeliveryDate.compareTo(existingDeliveryDate) < 0 ) {
				return null;
			}
	    	
			promiseDateResponseDto.setCarrierServiceCode(actualCarrierCode);
			promiseDateResponseDto.setShipNode(location.getLocationId());
			
			promiseDateResponseDto.setDcTimeZone(timeZone);
			
			promiseDateResponseDto.setCutoffTimestamp(SourcingUtils.convertToTimeZoneFromUTC(dateInfo.getOrderCutOffDate().getMax(), timeZone));
			promiseDateResponseDto.setDeliveryDate(newDeliveryDate);
			promiseDateResponseDto.setShippingDate(SourcingUtils.convertToTimeZoneFromUTC(dateInfo.getShipDate().getMax(), timeZone));
			
			promiseDateResponseDto.setDeliveryDateType(deliveryDateTyp);
			promiseDateResponseDto.setDelayAdded(location.isDelayFlag());
    	} catch (Exception e) {
			e.printStackTrace();
		}
    	return promiseDateResponseDto;
    }
    
    public SourcingOptionsResponseDto convert(AHCartSourceResponse ahCartSourceResponse,
    		Map<String, SourcingOptionsRequestItemDto> lineIdItemMap, Map<String, CarrierService> itemCarrierServiceMap, Boolean isOmsRequest, String headerFulfillmentType) throws Exception {
    	SourcingOptionsResponseDto sourcingOptionsResponseDto = new SourcingOptionsResponseDto();
        Boolean nonFulfillable = ahCartSourceResponse.getShipments() == null ||
                ahCartSourceResponse.getShipments().stream()
                        .anyMatch(shipment -> shipment.getCartItems()
                                .values().stream().anyMatch(cartItem -> cartItem.getRequestQuantity() > cartItem.getFulfillQuantity()));
    	Boolean available = MapUtils.isEmpty(ahCartSourceResponse.getAuditDetails());
    	if(nonFulfillable){
    	    available = false;
        }
    	sourcingOptionsResponseDto.setAvailable(available);
    	// scheduling constraint violation is required only when the request is not from oms and there are availability false.
    	Boolean schedulingConstraintViolationRequired = !isOmsRequest && !available;
    	List<SourcingOptionsResponseItemDto> itemList = new ArrayList<SourcingOptionsResponseItemDto>();
    	List<PromiseDateResponseDto> promisDateList = new ArrayList<PromiseDateResponseDto>();
    	if(null != ahCartSourceResponse.getShipments()) {
	    	for(Shipment shipment : ahCartSourceResponse.getShipments()) {

	    		String location = shipment.getLocationId();
	    		String timeZone = shipment.getLocationLocale();
                String carrierServiceCode = null;
	    		
	    		for(Entry<String, CartItem> cartItemEntry : shipment.getCartItems().entrySet()) {
	    			SourcingOptionsResponseItemDto item = new SourcingOptionsResponseItemDto();
	    			SourcingOptionsRequestItemDto sourcingOptionsRequestItemDto = lineIdItemMap.get(cartItemEntry.getKey());
	    			/*if(null == promiseDateResponseDto.getCarrierServiceCode() || promiseDateResponseDto.getCarrierServiceCode().isEmpty()) {
	    				promiseDateResponseDto.setCarrierServiceCode(sourcingOptionsRequestItemDto.getCarrierServiceCode());
	    			}*/
                    if(carrierServiceCode == null){
                        carrierServiceCode = sourcingOptionsRequestItemDto.getCarrierServiceCode();
                    }
	    			item.setItemId(sourcingOptionsRequestItemDto.getItemId());
	    			item.setLineId(cartItemEntry.getKey());
	    			CartItem cartItem = cartItemEntry.getValue();
	    			if(cartItem.getFulfillQuantity() < cartItem.getRequestQuantity()){
	    			    item.setRequestedQtyAvailable(false);
                        item.setUnavailableReason(UnavailableReasonsConst.NOT_ENOUGH_PRODUCT_CHOICES);
                        String fulfillmentType = StringUtils.isEmpty(sourcingOptionsRequestItemDto.getFulfillmentType()) ? headerFulfillmentType : sourcingOptionsRequestItemDto.getFulfillmentType();
                        if(fulfillmentType.equals(FulfillmentTypeEnum.SAMEDAY.toString())){
                            item.setMaxShipNodeQuantity(cartItem.getFulfillQuantity().longValue());
                            item.setTotalAvailableQuantity(cartItem.getFulfillQuantity().longValue());
                        }
                    }else if(schedulingConstraintViolationRequired){
	    			    item.setRequestedQtyAvailable(false);
	    			    item.setUnavailableReason(UnavailableReasonsConst.SCHEDULING_CONSTRAINT_VIOLATION);
                        String fulfillmentType = StringUtils.isEmpty(sourcingOptionsRequestItemDto.getFulfillmentType()) ? headerFulfillmentType : sourcingOptionsRequestItemDto.getFulfillmentType();
	    			    if(fulfillmentType.equals(FulfillmentTypeEnum.SAMEDAY.toString())){
                            item.setMaxShipNodeQuantity(cartItem.getFulfillQuantity().longValue());
                            item.setTotalAvailableQuantity(cartItem.getFulfillQuantity().longValue());
                        }
                    }else{
	    			    item.setRequestedQtyAvailable(true);
                    }
	    			item.setRequestedQuantity(cartItemEntry.getValue().getFulfillQuantity().intValue());
	    			item.setShipNode(location);
	    			itemList.add(item);
	    		}
	    		if(isOmsRequest || available){
                    PromiseDateResponseDto promiseDateResponseDto = new PromiseDateResponseDto();
                    promiseDateResponseDto.setShipNode(location);
                    promiseDateResponseDto.setDcTimeZone(SourcingUtils.getZoneOffset(timeZone));
                    promiseDateResponseDto.setShippingDate(SourcingUtils.convertToTimeZoneFromUTC(shipment.getShipDate().getMax(), timeZone));
                    promiseDateResponseDto.setDeliveryDate(SourcingUtils.convertToTimeZoneFromUTC(shipment.getDeliveryDate().getMax(), timeZone));
                    promiseDateResponseDto.setCutoffTimestamp(SourcingUtils.convertToTimeZoneFromUTC(shipment.getOrderCutOffDate().getMax(), timeZone));
                    promiseDateResponseDto.setDelayAdded(false);
                    promiseDateResponseDto.setCarrierServiceCode(carrierServiceCode);
                    CarrierService carrierService = itemCarrierServiceMap.get(promiseDateResponseDto.getCarrierServiceCode());
                    if(null != carrierService) {
                        promiseDateResponseDto.setDeliveryDateType(carrierService.getDeliveryDateType());
                    }
                    promisDateList.add(promiseDateResponseDto);
                }

	    	}
    	}
    	if(null != ahCartSourceResponse.getAuditDetails()) {
	    	for(Entry<String, Map<String, AuditDetail>> auditDetailMapEntry : ahCartSourceResponse.getAuditDetails().entrySet()) {
	    		SourcingOptionsResponseItemDto item = new SourcingOptionsResponseItemDto();
	    		
	    		Map<String,AuditDetail> auditDetailMap = auditDetailMapEntry.getValue();
	    		if(null != auditDetailMap && !auditDetailMap.isEmpty()) {
	    			for(Entry<String,AuditDetail> auditDetailEntry : auditDetailMap.entrySet()) {
	    				//PRODUCT_NOT_ELIGIBLE
	                    //NO_SOLUTIONS_FOUND
	                    item.setUnavailableReason(UnavailableReasonsConst.NOT_ENOUGH_PRODUCT_CHOICES);
	                    item.setMaxShipNodeQuantity(0l);
	                    item.setTotalAvailableQuantity(0l);
	    			}
	    		}
	    		SourcingOptionsRequestItemDto sourcingOptionsRequestItemDto = lineIdItemMap.get(auditDetailMapEntry.getKey());
	    		item.setItemId(sourcingOptionsRequestItemDto.getItemId());
	    		item.setLineId(auditDetailMapEntry.getKey());
	    		item.setRequestedQuantity(sourcingOptionsRequestItemDto.getRequiredQuantity());
	    		
	    		itemList.add(item);
	    	}
    	}
    	sourcingOptionsResponseDto.setItems(itemList);
    	if(!promisDateList.isEmpty()) {
    		sourcingOptionsResponseDto.setPromiseDates(promisDateList);
    	}
    	return sourcingOptionsResponseDto;
    }

    public com.sephora.services.sourcingoptions.model.dto.Location convert(PromiseDateResponseDto promiseDateResponseDto) {
        if (null == promiseDateResponseDto) return null;
        return com.sephora.services.sourcingoptions.model.dto.Location.builder()
                .shipNode(promiseDateResponseDto.getShipNode())
                .dcTimeZone(promiseDateResponseDto.getDcTimeZone())
                .shippingDate(promiseDateResponseDto.getShippingDate())
                .deliveryDate(promiseDateResponseDto.getDeliveryDate())
                .deliveryDateType(promiseDateResponseDto.getDeliveryDateType())
                .cutoffTimestamp(promiseDateResponseDto.getCutoffTimestamp())
                .delayAdded(promiseDateResponseDto.getDelayAdded())
                .build();
    }
}
