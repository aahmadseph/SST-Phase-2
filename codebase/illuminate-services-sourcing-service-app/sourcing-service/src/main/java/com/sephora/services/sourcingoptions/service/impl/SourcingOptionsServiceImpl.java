package com.sephora.services.sourcingoptions.service.impl;

import static com.sephora.services.sourcingoptions.SourcingOptionConstants.INVS_RESERVATION;
import static com.sephora.services.sourcingoptions.SourcingOptionConstants.OMS;
import static com.sephora.services.sourcingoptions.model.DestinationTypeEnum.XPO;
import static com.sephora.services.sourcingoptions.model.UnavailableReasonsConst.*;
import static com.sephora.services.sourcingoptions.util.SourcingUtils.getNormalizedZipCode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.LongSummaryStatistics;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import com.sephora.services.sourcingoptions.config.ConfigHubProperties;
import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import com.sephora.services.sourcingoptions.model.dto.*;
import com.sephora.services.sourcingoptions.service.*;
import com.sephora.services.sourcingoptions.util.SourcingUtils;
import org.apache.commons.lang3.CharUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.sephora.platform.common.validation.exception.ValidationException;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.sourcingoptions.SourcingOptionConstants;
import com.sephora.services.sourcingoptions.client.InventoryAvailabilityServiceClient;
import com.sephora.services.sourcingoptions.client.InventoryServiceClient;
import com.sephora.services.sourcingoptions.config.SourcingOptionsConfiguration;
import com.sephora.services.sourcingoptions.exception.AHBadRequestException;
import com.sephora.services.sourcingoptions.exception.AHPromiseDateException;
import com.sephora.services.sourcingoptions.exception.SourcingItemsServiceException;
import com.sephora.services.sourcingoptions.mapper.SourcingAHPromiseDateMapper;
import com.sephora.services.sourcingoptions.mapper.SourcingOptionsMapper;
import com.sephora.services.sourcingoptions.model.CountryEnum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.SellerCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.SourcingRule;
import com.sephora.services.sourcingoptions.repository.cosmos.ShipNodeRepository;
import com.sephora.services.sourcingoptions.repository.cosmos.SourcingRuleRepository;

import feign.FeignException;
import lombok.extern.log4j.Log4j2;

/**
 * @author Vitaliy Oleksiyenko
 */
@Service
@Log4j2
public class SourcingOptionsServiceImpl implements SourcingOptionsService {

    private static final String COLON = ":";
    private static final String PIPE = "|";
    private static final String UNDERSCORE = "_";
    private static final List<String> states = Arrays.asList("AA", "AE", "AP", "PR");

    @Autowired
    private ZoneMapService zoneMapService;

    @Autowired
    private ShipNodeService shipNodeService;

    @Autowired
    private InventoryServiceClient inventoryServiceClient;
    
    @Autowired
    private InventoryAvailabilityServiceClient inventoryAvailablityServiceClient;
    
    @Value("${sourcing.options.feign.inventoryavailability.useInventoryService: true}")
    private Boolean useInventoryService;
    
    @Autowired(required = false)
    private SourcingRuleRepository sourcingRuleRepository;

    @Autowired
    private SourcingOptionsMapper sourcingOptionsMapper;

    @Autowired
    private RequestLoggingFilterConfig requestLoggingFilterConfig;

    @Autowired
    private SourcingRulesService sourcingRulesService;

    @Value("${oms.externalInventoryCheck:false}")
    private Boolean fetchItemsFromAvailabilityHubForOmsRequest;

    @Autowired
    private AHPromiseDatesService ahPromiseDatesService;
    
    @Autowired
    private SourcingAHPromiseDateMapper sourcingAHPromiseDateMapper;

    @Autowired(required = false)
    private ShipNodeRepository shipNodeRepository;

    @Value("${sourcing.options.availabilityhub.enableDatesByServiceApi:false}")
    private Boolean enableDatesByServiceApi;

    @Value("${sourcing.options.availabilityhub.enableCartSourceApi:false}")
    private Boolean enableCartSourceApi;

    @Autowired
    private SourcingOptionsConfiguration sourcingOptionsConfiguration;

    @Autowired
    private ZipCodeRampupService zipCodeRampupService;
    
    @Autowired
    private MockSourcingOptionService mockSourcingOptionService;

    @Autowired
    private ConfigHubProperties configHubProperties;

    public static final String FULFILLMENT_TYPE_NOT_FOUND_ERROR_CODE = "sourcingService.request.headerFulfillmentType";

    private Boolean isZipCodeEligibleForSourcingHubCall(String zipCode, String enterpriseCode){
        if (StringUtils.isEmpty(zipCode)) {
            return false;
        }
        return zipCodeRampupService.isZipCodeEligibleForSourcingHubCall(zipCode, enterpriseCode);
    }

    @Override
    public SourcingOptionsResponseDto getSourcingOptions(SourcingOptionsRequestDto sourcingOptionsRequest)
            throws Exception {
        try {
            return determineSourcingOptions(sourcingOptionsRequest);
        } catch (Exception ex) {
            log.error("Error during getting SourcingItems for request {}", sourcingOptionsRequest, ex);
            if(ex instanceof ValidationException || ex instanceof AHPromiseDateException || ex instanceof AHBadRequestException) {
            	throw ex;
            } else {
            	throw new SourcingItemsServiceException(ex);
            }
        }
    }

    private Boolean isOrderEligibleForAHSourcing(SourcingOptionsRequestDto sourcingOptionsRequestDto){
        if(sourcingOptionsConfiguration.isUseAvailabilityHubForSourcing()){
            log.info("availabilityhubforSourcing flag enabled for shippingGroup {}", sourcingOptionsRequestDto.getCartId());
            //if source system is OMS, enableCartSourceApi should be true else enabledatesByServiceApi should be true
            if("OMS".equals(sourcingOptionsRequestDto.getSourceSystem())){
                return enableCartSourceApi;
            }else if(enableDatesByServiceApi){
                if(sourcingOptionsConfiguration.isRampUpEnabled()){
                    log.info("rampUp flag enabled for shippingGroup {}", sourcingOptionsRequestDto.getCartId());
                    if(isZipCodeEligibleForSourcingHubCall(sourcingOptionsRequestDto.getShippingAddress().getZipCode(), sourcingOptionsRequestDto.getEnterpriseCode())){
                        //rampup enabled, and zipcode available in configuration
                        log.info("zipCode is eligible for commit sourcing for shippingGroup {}", sourcingOptionsRequestDto.getCartId());
                        return true;
                    }else{
                        //rampup enabled, but zipcode not in configuration
                        log.info("zipCode is not eligible for commit sourcing for shippingGroup {}", sourcingOptionsRequestDto.getCartId());
                        return false;
                    }
                }else{
                    log.info("rampUp flag is disabled for shippingGroup {}", sourcingOptionsRequestDto.getCartId());
                    // availabilityhub is enabled, but rampup is disabled, which means all requests should go to AH
                    return true;
                }
            }
        }
        return false;
    }

    private Boolean isEligibleForCartSourceRequest(SourcingOptionsRequestDto sourcingOptionsRequest){
        Boolean isSameDayRequest = false;
        if(sourcingOptionsRequest.getFulfillmentType() != null && sourcingOptionsRequest.getFulfillmentType().equals(FulfillmentTypeEnum.SAMEDAY.toString())){
            isSameDayRequest = true;
        }else if(!CollectionUtils.isEmpty(sourcingOptionsRequest.getItems()) && sourcingOptionsRequest.getItems().stream().allMatch(sourcingOptionsRequestItemDto -> sourcingOptionsRequestItemDto.getFulfillmentType() != null && sourcingOptionsRequestItemDto.getFulfillmentType().equals(FulfillmentTypeEnum.SAMEDAY.toString()))){
            isSameDayRequest = true;
        }
        // if INVS_RESERVATION or OMS or the reqeust is SAMEDAY fulfilled
        return (INVS_RESERVATION.equals(sourcingOptionsRequest.getSourceSystem()) || OMS.equals(sourcingOptionsRequest.getSourceSystem()) || isSameDayRequest);
    }

    private SourcingOptionsResponseDto determineSourcingOptions(SourcingOptionsRequestDto sourcingOptionsRequest) throws Exception {
        log.info("sourcing request received with shippingGroup {}", sourcingOptionsRequest.getCartId());
        log.debug("sourcing request received with shippingGroup {} and request {}", sourcingOptionsRequest.getCartId(), sourcingOptionsRequest);
        
        // If requestOrigin is ATG_TEST_CHECKOUT from checkoutRequest then from sourcing service the request should not do not go to commits. 
        // It should return with mocked up response . The response time should be based on a configurable response time 
        if(Boolean.TRUE.equals(configHubProperties.getIsSourcingServiceMockEnabled()) || SourcingOptionConstants.ATG_TEST_CHECKOUT.equals(sourcingOptionsRequest.getSourceSystem())) {
        	log.info("Creating mock sourcingOptionResponse. SourceSystem: {}, cartId: {}", sourcingOptionsRequest.getSourceSystem(), 
        			sourcingOptionsRequest.getCartId());
        	return mockSourcingOptionService.buildMockSourcingOptionResponse(sourcingOptionsRequest);
        } else if(isOrderEligibleForAHSourcing(sourcingOptionsRequest)){
            //do sourcing from yantriks.
        	if(isEligibleForCartSourceRequest(sourcingOptionsRequest)) {
        	    log.info("request from OMS source system for shippingGroup {}", sourcingOptionsRequest.getCartId());
        		SourcingOptionsResponseDto sourcingOptionsResponseDto = ahPromiseDatesService.getCartSourcePromiseDates(sourcingOptionsRequest);
                sourcingOptionsResponseDto.setDatesCalculated(true);
        		if(!sourcingOptionsResponseDto.isAvailable()){
                    log.debug("sourcing is unavailable, response {}", sourcingOptionsResponseDto);
                }
        		return sourcingOptionsResponseDto;
        	} else {

	            log.info("order is eligible for sourcing from sourcing hub, shippingGroup {}", sourcingOptionsRequest.getCartId());
	            SourcingOptionsResponseDto sourcingOptionsResponseDto = ahPromiseDatesService.getPromiseDateByService(sourcingOptionsRequest);
                sourcingOptionsResponseDto.setDatesCalculated(true);
                if(!sourcingOptionsResponseDto.isAvailable()){
                    log.debug("sourcing is unavailable, response {}", sourcingOptionsResponseDto);
                }
	            return sourcingOptionsResponseDto;
        	}
        }else{
            log.info("sourcing not eligible for sourcing hub, getting data in old method for shippingGroup {}", sourcingOptionsRequest.getCartId());
            SourcingOptionsResponseDto responseDto = null;
            if(StringUtils.isEmpty(sourcingOptionsRequest.getFulfillmentType())){
               throw new ValidationException(FULFILLMENT_TYPE_NOT_FOUND_ERROR_CODE);
            }

            boolean bSchedulingConstraintMet = true;
            boolean bMultiNodeAssigned = false;
            boolean bMissingAddress = false;

            // Determine scheduling constraints
            String state = sourcingOptionsRequest.getShippingAddress().getState();
            String country = sourcingOptionsRequest.getShippingAddress().getCountry();

            if (SellerCodeEnum.BORDERFREE.name().equalsIgnoreCase(sourcingOptionsRequest.getSellerCode())) {
                // For seller code 'BORDERFREE' set country to 'US'
                country = CountryEnum.US.name();
            }

            String destinationType = CountryEnum.US.name().equals(country) && states.contains(state) ? XPO.toString() : null;
            SourcingRule sourcingRule = sourcingRulesService.getSourcingRules(sourcingOptionsRequest, destinationType);

            if (sourcingRule == null) {
                log.warn("Unable to find sourcingRule by request {}", sourcingOptionsRequest);
                return sourcingOptionsMapper.buildUnavailableResponse(sourcingOptionsRequest, NO_SOURCING_RULE_DEFINED);
            }

            boolean bSingleNodeConstraint = sourcingRule.getShipFromSingleNode();
            boolean bShipCompleteConstraint = sourcingRule.getShipComplete();
            boolean bRegionBasedRule = sourcingRule.getRegionBased();

            // Determine node priority for the Zipcode
            List<String> nodePriority = null;
            if (bRegionBasedRule) {
                String zipCode =  sourcingOptionsRequest.getShippingAddress().getZipCode();
                EnterpriseCodeEnum enterpriseCode = EnterpriseCodeEnum.valueOf(sourcingOptionsRequest.getEnterpriseCode());
                if (StringUtils.isEmpty(zipCode)) {
                    // Search for ACTIVE ship nodes by Enterprise code
                    bMissingAddress = true;
                    nodePriority = shipNodeService.findAllActiveNodesByEnterpriseCode(enterpriseCode);
                } else {
                    nodePriority = zoneMapService.getPriorityByEnterpriseCodeAndZipCode(enterpriseCode.toString(),
                            getNormalizedZipCode(zipCode, enterpriseCode));
                }
            } else {
                // Get default shipNode for non-RegionBased rules (Borderfree and Electronic)
                if (sourcingRule.getDefaultShipNode() != null) {
                    nodePriority = Arrays.asList(sourcingRule.getDefaultShipNode());
                } else {
                    log.warn("Default Ship Node not configured for non-RegionBased sourcing rule {}", sourcingRule.getId());
                }
            }

            // Fill node priorities map
            Map<String, Integer> hmNodesPriority = fillInNodePriorityMap(nodePriority, !bMissingAddress);

            if (CollectionUtils.isEmpty(hmNodesPriority)) {
                log.warn("Node priority not available for request {}", sourcingOptionsRequest);
                return sourcingOptionsMapper.buildUnavailableResponse(sourcingOptionsRequest, NO_SOURCING_RULE_DEFINED);
            }

            // Fill item quantity map
            long iInputItemsCount = sourcingOptionsRequest.getItems().size();
            Map<String, Integer> hmInputItems = getItemsQuantityMap(sourcingOptionsRequest);

            // Determine the Node level Inventory for the SKUs
            GetInventoryAvailabilityDto inventoryAvailabilityBean =
                    sourcingOptionsMapper.buildInventoryAvailabilityBean(sourcingOptionsRequest, hmNodesPriority, hmInputItems);
            InventoryAvailabilityDto inventoryItems;
            try {

                inventoryItems = getInventoryItems(inventoryAvailabilityBean);

            } catch (FeignException ex) {
                if (ex.status() == HttpStatus.NOT_FOUND.value()) {
                    log.info("Inventory not found for request {}. Returning NOT_ENOUGH_PRODUCT_CHOICES", inventoryAvailabilityBean);
                    return sourcingOptionsMapper.buildUnavailableResponse(sourcingOptionsRequest, NOT_ENOUGH_PRODUCT_CHOICES);
                }
                log.error("Error during getting inventory items ", ex);
                throw ex;
            }

            if (inventoryItems == null) {
                log.info("Inventory not found for request {}. Returning NOT_ENOUGH_PRODUCT_CHOICES", inventoryAvailabilityBean);
                return sourcingOptionsMapper.buildUnavailableResponse(sourcingOptionsRequest, NOT_ENOUGH_PRODUCT_CHOICES);
            }

            // Determine ItemCount across Nodes and Availability for each Item
            AtomicLong iAvailableItemsCount = new AtomicLong(0);
            Map<String, Long> hmItemCountAcrossNodes = new HashMap<>();
            Map<String, TreeMap<String, Long>> hmItemsTmSortedNodesQty = new HashMap<>();
            Map<String, HashMap<String, Long>> hmUnavailableReqQtyItemsHmNodesQty = new HashMap<>();
            List<String> infiniteInventories = new ArrayList<>();

            populateShipNodeRequiredQuantityMaps(inventoryItems,
                    hmNodesPriority,
                    hmInputItems,
                    hmItemCountAcrossNodes,
                    hmItemsTmSortedNodesQty,
                    hmUnavailableReqQtyItemsHmNodesQty,
                    iAvailableItemsCount,
                    infiniteInventories);

            // Check if ALL required Items are available at a single Node to minimise the number of Shipments
            long iItemCountAcrossNodes, iMaxNodeItemCount = 0;
            String sPriorityNodeWithMaxNodeItemCount = null;
            String sSingleNodeAssigned = null;

            // Determine the ShipNode which has the Maximum count value with highest priority
            for (String item : hmItemCountAcrossNodes.keySet()) {
                iItemCountAcrossNodes = hmItemCountAcrossNodes.get(item);
                if (iItemCountAcrossNodes > iMaxNodeItemCount) {
                    iMaxNodeItemCount = iItemCountAcrossNodes;
                    sPriorityNodeWithMaxNodeItemCount = item;
                } else if (iItemCountAcrossNodes == iMaxNodeItemCount && StringUtils.compare(sPriorityNodeWithMaxNodeItemCount, item) > 0) {
                    sPriorityNodeWithMaxNodeItemCount = item;
                }
            }

            // If all Items in the request are available at a single ShipNode
            boolean bSingleNodeShipCompleteAssigned = false;
            if (iMaxNodeItemCount == iInputItemsCount) {
                bSingleNodeShipCompleteAssigned = true;
                sSingleNodeAssigned = sPriorityNodeWithMaxNodeItemCount;
            }

            AtomicInteger iAssignedItemsCount = new AtomicInteger(0);
            Map<String,String> hmItemsNodeAssignments = new HashMap<>();
            // If ALL Items in the request cannot be fulfilled from a single ShipNode, determine the Node assignments
            // for each Item and whether Sourcing constraints are met
            if (!bSingleNodeShipCompleteAssigned) {

                // If all the available Items can be fulfilled from one shipNode
                if (iMaxNodeItemCount == iAvailableItemsCount.get()) {
                    String priorityNodeWithMaxNodeItemCount = sPriorityNodeWithMaxNodeItemCount;
                    hmItemsNodeAssignments =
                            hmItemsTmSortedNodesQty.keySet().stream().collect(Collectors.toMap(k -> k, k -> priorityNodeWithMaxNodeItemCount));
                    iAssignedItemsCount = new AtomicInteger(hmItemsNodeAssignments.size());
                    sSingleNodeAssigned = sPriorityNodeWithMaxNodeItemCount;

                } else {
                    // If all the available Items cannot be fulfilled from one shipNode - Split scenario. Sort the skus in ascending
                    // order of choices available and their equivalent Node priorities (from hmItemsTmSortedNodesQty HashMap)
                    // and determine the final Node assignments for each Item and load in hmItemsNodeAssignments map
                    Map<String, TreeMap<String, Long>> tmSortedItemsTmSortedNodesQty = new TreeMap<>();
                    populateTmSortedItemsTmSortedNodesQty(hmItemsTmSortedNodesQty, tmSortedItemsTmSortedNodesQty);

                    int iSelectedNodesCount = populateHmItemsNodeAssignmentMap(tmSortedItemsTmSortedNodesQty,
                            hmItemsNodeAssignments, iAssignedItemsCount);

                    if (iSelectedNodesCount > 1) {
                        bMultiNodeAssigned = true;
                    }
                }

                // Check if Sourcing constraints are satisfied
                if (bShipCompleteConstraint && iAssignedItemsCount.get() != iInputItemsCount) {
                    bSchedulingConstraintMet = false;
                }
                if (bSchedulingConstraintMet && bSingleNodeConstraint && bMultiNodeAssigned) {
                    bSchedulingConstraintMet = false;
                }
            }

            return generateSourcingOptionsResponseDto(sourcingOptionsRequest,
                    bSingleNodeShipCompleteAssigned,
                    sSingleNodeAssigned,
                    hmUnavailableReqQtyItemsHmNodesQty,
                    hmItemsTmSortedNodesQty,
                    hmItemsNodeAssignments,
                    bSchedulingConstraintMet, infiniteInventories, sourcingOptionsRequest.getSourceSystem() == null || sourcingOptionsRequest.getSourceSystem().equals(OMS));
        }


    }

    private InventoryAvailabilityDto getInventoryItems(GetInventoryAvailabilityDto inventoryAvailabilityBean) {
        InventoryAvailabilityDto inventoryItems;
        if (inventoryAvailabilityBean.getRequestSourceSystem() != null && inventoryAvailabilityBean.getRequestSourceSystem().equals("OMS") && fetchItemsFromAvailabilityHubForOmsRequest) {
            inventoryAvailabilityBean.setRequestSourceSystem("OMS_EXTERNAL_INVS");
        }
        if (useInventoryService) {
            log.info("getting availability using inventory service, request {}", inventoryAvailabilityBean);
            inventoryItems = inventoryServiceClient.getItemsInventoryAvailability(inventoryAvailabilityBean,
                    MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
        } else {
            log.info("getting availability using inventory availability service, request {}", inventoryAvailabilityBean);
            inventoryItems = inventoryAvailablityServiceClient.getItemsInventoryAvailability(inventoryAvailabilityBean,
                    MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
        }
        return inventoryItems;
    }

    private SourcingOptionsResponseDto generateSourcingOptionsResponseDto(SourcingOptionsRequestDto sourcingOptionsRequest,
                                                                          boolean bSingleNodeShipCompleteAssigned,
                                                                          String sSingleNodeAssigned,
                                                                          Map<String, HashMap<String, Long>> hmUnavailableReqQtyItemsHmNodesQty,
                                                                          Map<String, TreeMap<String, Long>> hmItemsTmSortedNodesQty,
                                                                          Map<String, String> hmItemsNodeAssignments,
                                                                          boolean bSchedulingConstraintMet, List<String> infiniteInventories,Boolean isOmsRequest) {
        boolean deliveryAvailable = true;
        SourcingOptionsResponseDto responseDto = new SourcingOptionsResponseDto();
        if (bSingleNodeShipCompleteAssigned) {
            // All Items in the request can be fulfilled from a single ShipNode
            String singleShipNode = sSingleNodeAssigned.substring((sSingleNodeAssigned.indexOf(COLON)) + 1);
            responseDto = sourcingOptionsMapper.buildAvailableResponse(sourcingOptionsRequest, singleShipNode);
            log.debug("All Items in the request can be fulfilled from a single ShipNode {}", singleShipNode);
        } else {
            // All Items in the request cannot be fulfilled from a single ShipNode
            for (SourcingOptionsRequestItemDto itemRequestDto : sourcingOptionsRequest.getItems()) {

                String itemId = itemRequestDto.getItemId();
                if (hmItemsNodeAssignments.containsKey(itemId)) {
                    if (bSchedulingConstraintMet) {
                        // If sku has an assigned shipNode and all Scheduling Constraints met, return the sku as available
                        String sAssignedPriorityShipNode = hmItemsNodeAssignments.get(itemId);
                        String shipNodeName = sAssignedPriorityShipNode.substring(sAssignedPriorityShipNode.indexOf(COLON) + 1);
                        responseDto.getItems().add(sourcingOptionsMapper
                                .buildItemResponseDto(itemRequestDto, shipNodeName, true));
                        log.debug("Sku {} has an assigned shipNode {} and all Scheduling Constraints met",
                                itemRequestDto.getItemId(), shipNodeName);
                    } else {
                        // If sku has an assigned shipNode, but scheduling Constraints are not met, return the sku as Unavailable
                        responseDto.setAvailable(Boolean.FALSE);
                        TreeMap<String, Long> tmSortedNodesQty = hmItemsTmSortedNodesQty.get(itemId);

                        LongSummaryStatistics summaryStats = tmSortedNodesQty.values().stream()
                                .collect(Collectors.summarizingLong(Long::longValue));

                        Long maxShipNodeQuantity = summaryStats.getMax();
                        Long totalAvailableQuantity = summaryStats.getSum();

                        if (hmUnavailableReqQtyItemsHmNodesQty.containsKey(itemId)) {
                            HashMap<String, Long> hmUnavailableNodesQty = hmUnavailableReqQtyItemsHmNodesQty.get(itemId);
                            totalAvailableQuantity += hmUnavailableNodesQty.values().stream()
                                    .collect(Collectors.summarizingLong(Long::longValue)).getSum();
                        }

                        deliveryAvailable = false;
                        //maxShipNodeQuantity will be -1 for infinite inventory
                        String sAssignedPriorityShipNode = hmItemsNodeAssignments.get(itemId);
                        String shipNodeName = sAssignedPriorityShipNode.substring(sAssignedPriorityShipNode.indexOf(COLON) + 1);
                        if(itemRequestDto.getRequiredQuantity() > maxShipNodeQuantity && !infiniteInventories.contains(itemRequestDto.getItemId())){
                            responseDto.getItems().add(sourcingOptionsMapper.buildItemRequestDto(itemRequestDto,
                                    NOT_ENOUGH_PRODUCT_CHOICES, maxShipNodeQuantity, totalAvailableQuantity));
                            log.debug("Sku {} does not have enough items in stock", itemRequestDto.getItemId());
                        }else{
                            if(isOmsRequest){
                                responseDto.getItems().add(sourcingOptionsMapper
                                        .buildItemResponseDto(itemRequestDto, shipNodeName, true));
                            }else{
                                responseDto.getItems().add(sourcingOptionsMapper.buildItemRequestDto(itemRequestDto,
                                        SCHEDULING_CONSTRAINT_VIOLATION, maxShipNodeQuantity, totalAvailableQuantity));
                            }

                            log.debug("Sku {} has an assigned shipNode, but Scheduling Constraints not met", itemRequestDto.getItemId());
                        }
                    }
                } else {
                    // If sku does not have an assigned shipNode (either RequiredQty not available or No Qty at all)
                    // return the sku as Unavailable
                    Long maxShipNodeQuantity = 0L;
                    Long totalAvailableQuantity = 0L;

                    if (hmUnavailableReqQtyItemsHmNodesQty.containsKey(itemId)) {
                        HashMap<String, Long> hmUnavailableNodesQty = hmUnavailableReqQtyItemsHmNodesQty.get(itemId);

                        LongSummaryStatistics summaryStats = hmUnavailableNodesQty.values().stream()
                                .collect(Collectors.summarizingLong(Long::longValue));

                        maxShipNodeQuantity = summaryStats.getMax();
                        totalAvailableQuantity = summaryStats.getSum();
                    }

                    deliveryAvailable = false;
                    responseDto.getItems().add(sourcingOptionsMapper.buildItemRequestDto(itemRequestDto,
                            NOT_ENOUGH_PRODUCT_CHOICES, maxShipNodeQuantity, totalAvailableQuantity));
                    log.debug("Sku {} doesn't have assigned shipNode", itemRequestDto.getItemId());
                }
            }
            responseDto.setAvailable(deliveryAvailable);
        }
        return responseDto;
    }

    private void populateShipNodeRequiredQuantityMaps(InventoryAvailabilityDto inventories,
                                                  Map<String, Integer> hmNodesPriority,
                                                  Map<String, Integer> hmInputItems,
                                                  Map<String, Long> hmItemCountAcrossNodes,
                                                  Map<String, TreeMap<String, Long>> hmItemsTmSortedNodesQty,
                                                  Map<String, HashMap<String, Long>> hmUnavailableReqQtyItemsHmNodesQty,
                                                  AtomicLong iAvailableItemsCount, List<String> infiniteInventoriesList) {

        for (InventoryItemDto inventoryItem: inventories.getItems()) {
            String skuId = inventoryItem.getItemId();
            String priorityShipNode;
            if (!inventoryItem.getInfiniteInventory()) {
                for (InventoryInfoDto invInfo : inventoryItem.getInventoryInfo()) {

                    priorityShipNode = hmNodesPriority.get(invInfo.getShipNode()) + COLON + invInfo.getShipNode();

                    if (invInfo.getQuantity() >= hmInputItems.get(skuId)) {
                        fillHmItemCountAcrossNodes(hmItemCountAcrossNodes, priorityShipNode);
                        fillHmItemsTmSortedNodesQty(invInfo.getQuantity(), inventoryItem.getItemId(), hmItemsTmSortedNodesQty,
                                priorityShipNode, iAvailableItemsCount);
                    } else {
                        fillHmUnavailableReqQtyItemsHmNodesQty(invInfo, inventoryItem.getItemId(),
                                hmUnavailableReqQtyItemsHmNodesQty, priorityShipNode);
                    }
                }
            } else {
                // If SKU maintains Infinite Inventory, it will be fulfilled from the highest priority shipNode

                // priorityShipNode = getHighestShipNodePriority(hmNodesPriority);
                // if the item is infiniteInventory, then it should be set available in the response.
                // This list will be helpful while generating response
                infiniteInventoriesList.add(inventoryItem.getItemId());

                for (String shipNode: hmNodesPriority.keySet()) {
                    priorityShipNode = hmNodesPriority.get(shipNode) + COLON + shipNode;
                    fillHmItemCountAcrossNodes(hmItemCountAcrossNodes, priorityShipNode);
                    fillHmItemsTmSortedNodesQty(-1L, inventoryItem.getItemId(), hmItemsTmSortedNodesQty,
                            priorityShipNode, iAvailableItemsCount);
                }
            }
        }

        log.debug("Populated hmItemCountAcrossNodes map: {}", hmItemCountAcrossNodes);
        log.debug("Populated hmItemsTmSortedNodesQty map: {}", hmItemsTmSortedNodesQty);
        log.debug("Populated hmUnavailableReqQtyItemsHmNodesQty map: {}", hmUnavailableReqQtyItemsHmNodesQty);
    }

    private void populateTmSortedItemsTmSortedNodesQty(
            Map<String, TreeMap<String, Long>> hmItemsTmSortedNodesQty,
            Map<String, TreeMap<String, Long>> tmSortedItemsTmSortedNodesQty) {

        TreeMap<String, Long> tmSortedNodesQty;
        String sCurrentNodePriority;

        for (String sHmItemKey : hmItemsTmSortedNodesQty.keySet()) {
            String sNodePriorities  = null;
            int iChoicesCount  = 0;

            tmSortedNodesQty = hmItemsTmSortedNodesQty.get(sHmItemKey);
            for (String sTmSortedNodeKey : tmSortedNodesQty.keySet()) {
                iChoicesCount++;
                sCurrentNodePriority = sTmSortedNodeKey.substring(0, sTmSortedNodeKey.indexOf(COLON)).trim();
                if (StringUtils.isNotEmpty(sNodePriorities)){
                    sNodePriorities = sNodePriorities + sCurrentNodePriority;
                } else {
                    sNodePriorities = sCurrentNodePriority;
                }
            }
            tmSortedItemsTmSortedNodesQty.put(iChoicesCount + UNDERSCORE + sNodePriorities + PIPE + sHmItemKey, tmSortedNodesQty);
        }
        log.debug("Populated tmSortedItemsTmSortedNodesQty map: {}", tmSortedItemsTmSortedNodesQty);
    }

    private int populateHmItemsNodeAssignmentMap(
            Map<String, TreeMap<String, Long>> tmSortedItemsTmSortedNodesQty,
            Map<String, String> hmItemsNodeAssignments,
            AtomicInteger iAssignedItemsCount)  {

        TreeMap<String,Long> tmSortedNodesQty;
        String sSortedItem;

        int iSelectedNodesCount = 0;
        ArrayList<String> alSelectedNodes = new ArrayList<>();

        for (String sTmSortedItemKey : tmSortedItemsTmSortedNodesQty.keySet()) {
            tmSortedNodesQty = tmSortedItemsTmSortedNodesQty.get(sTmSortedItemKey);
            sSortedItem = sTmSortedItemKey.substring(sTmSortedItemKey.indexOf(PIPE) + 1);

            String sMaxPriorityNode = null;
            boolean bKeyExists = false;

            for (String sTmSortedNodeKey : tmSortedNodesQty.keySet()) {
                if (StringUtils.isEmpty(sMaxPriorityNode)) {
                    sMaxPriorityNode = sTmSortedNodeKey;
                }

                if (alSelectedNodes.contains(sTmSortedNodeKey)) {
                    bKeyExists = true;
                    hmItemsNodeAssignments.put (sSortedItem , sTmSortedNodeKey);
                    break;
                } else if(alSelectedNodes.isEmpty()){
                    break;
                }
            }
            if (!bKeyExists) {
                hmItemsNodeAssignments.put(sSortedItem , sMaxPriorityNode);
                alSelectedNodes.add(sMaxPriorityNode);
                iSelectedNodesCount++;
            }

            iAssignedItemsCount.incrementAndGet();
        }

        log.debug("Populated hmItemsNodeAssignments map: {}; selected nodes count: {}", hmItemsNodeAssignments, iSelectedNodesCount);
        return iSelectedNodesCount;
    }

    private void fillHmItemCountAcrossNodes(Map<String, Long> hmItemCountAcrossNodes, String priorityShipNode) {
        if (hmItemCountAcrossNodes.containsKey(priorityShipNode)) {
            Long iCurrentShipNodeItemCount = hmItemCountAcrossNodes.get(priorityShipNode);
            hmItemCountAcrossNodes.put(priorityShipNode, iCurrentShipNodeItemCount + 1);
        } else {
            hmItemCountAcrossNodes.put(priorityShipNode, 1L);
        }
    }

    private void fillHmItemsTmSortedNodesQty(Long quantity,
                                             String itemId,
                                             Map<String, TreeMap<String, Long>> hmItemsTmSortedNodesQty,
                                             String priorityShipNode,
                                             AtomicLong iAvailableItemsCount) {
        if (hmItemsTmSortedNodesQty.containsKey(itemId)) {
            TreeMap<String, Long> tmSortedNodesQty = hmItemsTmSortedNodesQty.get(itemId);
            tmSortedNodesQty.put(priorityShipNode, quantity);
        } else {
            TreeMap<String, Long> tmSortedNodesQty = new TreeMap<>();
            tmSortedNodesQty.put(priorityShipNode, quantity);
            hmItemsTmSortedNodesQty.put(itemId, tmSortedNodesQty);
            iAvailableItemsCount.incrementAndGet();
        }
    }

    private void fillHmUnavailableReqQtyItemsHmNodesQty(InventoryInfoDto inventoryInfo,
                                                        String itemId,
                                                        Map<String, HashMap<String, Long>> hmUnavailableReqQtyItemsHmNodesQty,
                                                        String priorityShipNode) {
        if (hmUnavailableReqQtyItemsHmNodesQty.containsKey(itemId)) {
            HashMap<String, Long> hmUnavailableNodesQty = hmUnavailableReqQtyItemsHmNodesQty.get(itemId);
            hmUnavailableNodesQty.put(priorityShipNode, inventoryInfo.getQuantity());
        } else {
            HashMap<String, Long> hmUnavailableNodesQty = new HashMap<>();
            hmUnavailableNodesQty.put(priorityShipNode, inventoryInfo.getQuantity());
            hmUnavailableReqQtyItemsHmNodesQty.put(itemId, hmUnavailableNodesQty);
        }
    }

    private String getHighestShipNodePriority(Map<String, Integer> hmNodesPriority) {
        return "1" + COLON + Collections.min(hmNodesPriority.entrySet(), Comparator.comparingInt(Map.Entry::getValue)).getKey();
    }

    private Map<String, Integer> fillInNodePriorityMap(List<String> nodePriorities, boolean shipNodeFilteringRequired) {
        if (CollectionUtils.isEmpty(nodePriorities)) {
            return null;
        }

        AtomicInteger atomicInteger = new AtomicInteger(1);

        if (shipNodeFilteringRequired) {
            // Exclude LOCKED ship nodes
            List<String> activeShipNodes = shipNodeService.findAllActiveNodes();

            return nodePriorities.stream()
                    .filter(shipNodeName -> activeShipNodes.contains(shipNodeName))
                    .collect(Collectors.toMap(n -> n, n -> atomicInteger.getAndIncrement()));
        } else {
            return nodePriorities.stream()
                .collect(Collectors.toMap(n -> n, n -> atomicInteger.getAndIncrement()));
        }
    }

    @Override
    public Map<String, Integer> getItemsQuantityMap(SourcingOptionsRequestDto sourcingOptionsRequest) {
        return sourcingOptionsRequest.getItems().stream()
                                     .collect(Collectors.toMap(SourcingOptionsRequestItemDto::getItemId,
                                             SourcingOptionsRequestItemDto::getRequiredQuantity));
    }
}
