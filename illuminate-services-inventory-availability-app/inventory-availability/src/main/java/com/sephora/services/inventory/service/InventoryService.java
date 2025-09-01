/*
 * This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 * consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 * Copyright 2019 sephora.com, Inc. All rights reserved.
 */

package com.sephora.services.inventory.service;

import com.google.common.collect.Lists;
import com.sephora.services.inventoryavailability.constants.AvailabilityConstants;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.exception.AvailabilityServicePartialFailureException;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByFulfillmentType;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
/*import com.sephora.services.inventoryavailability.models.availability.request.Product;
import com.sephora.services.inventoryavailability.models.availability.response.AvailabilityByFulfillmentType;
import com.sephora.services.inventoryavailability.models.availability.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.models.availability.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.models.availability.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.models.availability.response.AvailabilityResponseDto;*/
import com.sephora.services.inventoryavailability.service.GetInventoryAvailabilityService;
import com.sephora.platform.database.cosmosdb.utils.CosmosQueryBuilder;
/*import com.sephora.services.inventoryavailability.services.AvailabilitySvcService;*/
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.inventory.mapper.InventoryMapper;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import com.sephora.services.inventory.model.doc.Inventory;
import com.sephora.services.inventory.model.dto.*;
import com.sephora.services.inventory.repository.cosmos.CosmosInventoryRepository;
import com.sephora.services.inventory.util.InventoryUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.stream.Collectors;

import static com.sephora.platform.database.cosmosdb.utils.WhereStatements.equal;
import static com.sephora.platform.database.cosmosdb.utils.WhereStatements.in;

/**
 * @author Alexey Zalivko 5/2/2019
 */

@Service
public class InventoryService {

    public static final long DEFAULT_READ_INVENTORY_TIMEOUT_MS = 100L;
    public static final int DEFAULT_ITEMS_BATCH_SIZE = 3;
    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired(required = false)
    private CosmosInventoryRepository inventoryRepository;

    @Autowired
    private InventoryShipNodeService shipNodeService;

    @Autowired
    private InventoryMapper inventoryMapper;

    @Autowired
    private ExecutorService executorService;

    @Autowired
    private RequestLoggingFilterConfig requestLoggingFilterConfig;
    
    @Autowired
    private GetInventoryAvailabilityService inventoryAvailabilityService;
    
    
    @Value("${availability.resourcing.enabled:true}")
    private Boolean availabilityResourcingEnabled;
    
    @Value("${availability.resourcing.reverifyAvailability: true}")
    private Boolean reverifyAvailability;
    
    @Value("#{'${availability.resourcing.shipNodes:US_NONSHIP,CA_NONSHIP}'.split(',')}")
    private List<String> resourcingShipNodes;

    public List<InventoryDto> findAll() {
        logger.info("Fetching all items");
        return inventoryMapper.convertList(inventoryRepository.findAll());
    }

    public GetInventoryItemDetailsDto findByItemId(String itemId) throws InventoryServiceException {
        logger.info("Fetching inventory item by #{}", itemId);

        try {
            List<Inventory> inventoryItemsList = inventoryRepository.findByItemId(itemId);
            if (CollectionUtils.isEmpty(inventoryItemsList)) {
                return null;
            }
            return inventoryMapper.convertToGetInventoryItemDetailsDto(inventoryItemsList, shipNodeService::getShipNodeByKey);
        } catch (Exception e) {
            logger.error("Error during resolving inventory details for item #{}", itemId, e);
            throw new InventoryServiceException(e);
        }
    }

    public GetInventoryItemDetailsDto findByItemIdAndNode(String itemId, String nodeName) throws InventoryServiceException {

        logger.info("Fetching inventory item by #{} and node {}", itemId, nodeName);

        try {
            List<Inventory> inventoryItemsList = inventoryRepository.findByItemIdAndShipNodeAndInfinite(itemId, nodeName, false);
            if (CollectionUtils.isEmpty(inventoryItemsList)) {
                return null;
            }
            return inventoryMapper.convertToGetInventoryItemDetailsDto(inventoryItemsList, shipNodeService::getShipNodeByKey);
        } catch (Exception e) {
            logger.error("Error during resolving inventory info for item #{} and node {}", itemId, nodeName, e);
            throw new InventoryServiceException(e);
        }
    }

    public InventoryResponseDto findInventoryBySpecifiedConditions(GetInventoryAvailabilityDto inventoryAvailabilityBean)
            throws InventoryServiceException, AvailabilityServiceException {
    	List<Inventory> inventories = Lists.newArrayList();
        try {
        	Boolean availabiltyCalled = false;
        	CompletableFuture<AvailabilityResponseDto> availabilityFuture = null;
        	if(availabilityResourcingEnabled == true 
        		&& inventoryAvailabilityBean.getRequestSourceSystem() != null 	
            	&& (inventoryAvailabilityBean.getRequestSourceSystem().equals(AvailabilityConstants.INVS_SOURCE_SYSTEM)
                    || inventoryAvailabilityBean.getRequestSourceSystem().equals(AvailabilityConstants.OMS_EXTERNAL_INVS)
            	|| inventoryAvailabilityBean.getRequestSourceSystem().equals(AvailabilityConstants.DOTCOM_SOURCE_SYSTEM)
            	|| inventoryAvailabilityBean.getRequestSourceSystem().equals(AvailabilityConstants.DOTCOMCA_SOURCE_SYSTEM))
            ) {
            	availabiltyCalled = true;
        		availabilityFuture = inventoryAvailabilityService.getAvailabilityAsync(inventoryAvailabilityBean);
        	}
        	
            String enterpriseCode = inventoryAvailabilityBean.getEnterpriseCode();
            EnterpriseCodeEnum enterpriseCodeEnumValue = EnterpriseCodeEnum.valueOf(enterpriseCode);
            InventoryResponseDto inventoryResponseDto = null;
            String correlationId = MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName());
            long startTime = System.currentTimeMillis();
            if (CollectionUtils.isEmpty(inventoryAvailabilityBean.getShipNodes())) {
                inventories = inventoryRepository.findByEnterpriseCodeAndItemIdIn(enterpriseCodeEnumValue,
                        inventoryAvailabilityBean.getItems());
                logger.info("Inventory Get Availability for [itemIds: {} and all shipNodes] took {}ms. CorrelationId: {}",
                        inventoryAvailabilityBean.getItems(),
                        System.currentTimeMillis() - startTime,
                        correlationId);
                inventoryResponseDto = inventoryMapper.convertToInventoryResponseDto(inventories, shipNodeService::getShipNodeByKey);
            } else {
                inventoryAvailabilityBean.getShipNodes().add(InventoryUtils.getInfiniteShipNodeName(enterpriseCode));
                List<String> shipNodes = inventoryAvailabilityBean.getShipNodes().stream().distinct().collect(Collectors.toList());
                if (inventoryAvailabilityBean.getItems().size() > DEFAULT_ITEMS_BATCH_SIZE) {

                    List<Callable<InventoryResponseDto>> futureReturnTypes = createCallableList(inventoryAvailabilityBean.getItems(), enterpriseCode, shipNodes);

                    List<Future<InventoryResponseDto>> futureReturnResults = executorService.invokeAll(futureReturnTypes);

                    List<InventoryItemDto> inventoryItemDtos = getInventories(futureReturnResults)
                            .stream()
                            .filter(inventoryResponseDto1 -> inventoryResponseDto1 != null)
                            .flatMap(inventoryResponseDto1 -> inventoryResponseDto1.getItems().stream())
                            .collect(Collectors.toList());

                    if (inventoryItemDtos.size() > 0) {
                        inventoryResponseDto = new InventoryResponseDto();
                        inventoryResponseDto.setItems(inventoryItemDtos);
                    }

                } else {
                    long startTime2 = System.currentTimeMillis();
                    String query = CosmosQueryBuilder.select()
                            .whereIf(CollectionUtils.isNotEmpty(inventoryAvailabilityBean.getItems()),
                                    () -> in("itemId", inventoryAvailabilityBean.getItems()))
                            .whereIf(enterpriseCode != null,
                                    () -> equal("enterpriseCode", enterpriseCode))
                            .whereIf(CollectionUtils.isNotEmpty(shipNodes),
                                    () -> in("shipNode", shipNodes))
                            .build();
                    inventories = inventoryRepository.queryDocuments(query);
                    logger.info("Inventory Read took {}ms. Query: {}. CorrelationId: {}", System.currentTimeMillis() - startTime2, query, correlationId);
                    inventoryResponseDto = inventoryMapper.convertToInventoryResponseDto(inventories, shipNodeService::getShipNodeByKey);
                }
                logger.info("Inventory Get Availability for [itemIds: {}, shipNodes: {}] took {}ms",
                        inventoryAvailabilityBean.getItems(), shipNodes,
                        System.currentTimeMillis() - startTime);
            }

            if (inventoryResponseDto != null) {
                inventoryResponseDto.setEnterpriseCode(enterpriseCode);
                if(availabilityFuture != null) {
                	AvailabilityResponseDto response = availabilityFuture.get();
                	inventoryResponseDto = setQuantityOnInventoryResponse(inventoryResponseDto, response);
            	}
            	//if availability is not called && reverify availability fall is true && request source system is not null
                //there are a few cache warmup calls without request source parameter
                if(!availabiltyCalled && reverifyAvailability && inventoryAvailabilityBean.getRequestSourceSystem() != null) {
            		inventoryResponseDto = reverifyAvailabilityFromAvailabilityHub(inventoryResponseDto, inventoryAvailabilityBean);
            	}	
            }
            return inventoryResponseDto;
        }catch (ExecutionException asException) {
        	logger.error("execution failed during the call to get availability", asException);
        	if(asException.getCause() instanceof AvailabilityServiceException) {
        		throw (AvailabilityServiceException) asException.getCause();
        	}
        }
        catch (Exception e) {
        	if(e instanceof AvailabilityServiceException) {
        		throw (AvailabilityServiceException) e;
        	}
            logger.error("An exception occurred while converting inventories {}",
                    Optional.ofNullable(inventories).orElse(Collections.emptyList()), e);
            throw new InventoryServiceException(e);
        }
		return null;
    }
    
    
    private InventoryResponseDto setQuantityOnInventoryResponse(InventoryResponseDto inventoryResponseDto, AvailabilityResponseDto response) {
    	for (InventoryItemDto item : inventoryResponseDto.getItems()) {
			Optional<AvailabilityByProduct> productOptional = response.getAvailabilityByProducts().stream()
					.filter(productInfo -> productInfo.getProductId().equals(item.getItemId())).findFirst();
			if (productOptional.isPresent()) {
				AvailabilityByProduct product = productOptional.get();
				for (AvailabilityByFulfillmentType availabilityByFulfillment : product
						.getAvailabilityByFulfillmentTypes()) {
					for (AvailabilityDetail availabilityDetails : availabilityByFulfillment
							.getAvailabilityDetails()) {
						for (AvailabilityByLocation availabilityByLocation : availabilityDetails
								.getAvailabilityByLocations()) {
							if (item.getInventoryInfo() != null) {
							    Optional<InventoryInfoDto> inventoryInfoOptional = item
									.getInventoryInfo().stream().filter(inventoryInfo -> inventoryInfo
											.getShipNode().equals(availabilityByLocation.getLocationId()))
									.findFirst();
							    if (inventoryInfoOptional.isPresent()) {
								    InventoryInfoDto info = inventoryInfoOptional.get();
								    //TODO converted to longValue
								    info.setQuantity(availabilityByLocation.getAtp().longValue());
							    }
						    }
						}
					}
				}
			}
		}
    	return inventoryResponseDto;
    }
    
    private InventoryResponseDto reverifyAvailabilityFromAvailabilityHub(InventoryResponseDto inventoryResponseDto, GetInventoryAvailabilityDto requestDto)
            throws AvailabilityServicePartialFailureException, AvailabilityServiceException {
    	GetInventoryAvailabilityDto newRequest = new GetInventoryAvailabilityDto();
    	newRequest.setEnterpriseCode(requestDto.getEnterpriseCode());
    	newRequest.setRequestSourceSystem(requestDto.getRequestSourceSystem());
    	List<String> items = new ArrayList<>();
    	List<String> shipNodes = new ArrayList<String>();
    	for(InventoryItemDto item: inventoryResponseDto.getItems()) {
    		Boolean itemNotAvailable = isItemNotAvailable(item);
    		if(itemNotAvailable) {
    		    if(CollectionUtils.isNotEmpty(item.getInventoryInfo())) {
                    for (InventoryInfoDto itemInfo : item.getInventoryInfo()) {
                        //checking availability from availabilityHub when there is 0 availabilty in all requested shipNodes
                        if ((resourcingShipNodes.contains(itemInfo.getShipNode()) && itemInfo.getQuantity().equals(0L))) {
                            if (items.contains(item.getItemId()) == false) {
                                items.add(item.getItemId());
                            }
                            if (shipNodes.contains(itemInfo.getShipNode()) == false) {
                                shipNodes.add(itemInfo.getShipNode());
                            }
                        }
                    }
                }
    		}
    	}
    	if(items.isEmpty() || shipNodes.isEmpty()) {
    		//if there is no items or shipNodes, then there is no need to get availability
    		return inventoryResponseDto;
    	}
    	newRequest.setItems(items);
    	newRequest.setShipNodes(shipNodes);
    	logger.info("reverifying availability by calling yantriks request, {}", newRequest);
    	AvailabilityResponseDto response = inventoryAvailabilityService.getAvailability(newRequest);
    	logger.info("get availability call successful, {}", response);
    	return setQuantityOnInventoryResponse(inventoryResponseDto, response);
    	
    }
    
    private Boolean isItemNotAvailable(InventoryItemDto item) {
        if(item.getInfiniteInventory() != null && item.getInfiniteInventory()){
            return false;
        }
    	if(item.getInventoryInfo() != null) {
    		for(InventoryInfoDto inventoryInfo: item.getInventoryInfo()) {
    			if(inventoryInfo.getQuantity().equals(0L) == false) {
    				return false;
    			}
    		}
    	}
    	return true;
    }
    
    private List<InventoryResponseDto> getInventories(List<Future<InventoryResponseDto>> futureReturnResults) {
        return futureReturnResults
                .stream()
                .map(listFuture -> {
                    try {
                        return listFuture.get(DEFAULT_READ_INVENTORY_TIMEOUT_MS, TimeUnit.MILLISECONDS);
                    } catch (Exception e) {
                        logger.error(e);
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }

    private List<Callable<InventoryResponseDto>> createCallableList(List<String> items, String enterpriseCode, List<String> shipNodes) {
        String correlationId = MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName());
        return Lists.partition(items, DEFAULT_ITEMS_BATCH_SIZE)
            .stream()
            .map(itemsPartition -> {
                Callable<InventoryResponseDto> callable = () -> {
                    long startTime = System.currentTimeMillis();
                    String query = CosmosQueryBuilder.select()
                            .whereIf(CollectionUtils.isNotEmpty(itemsPartition),
                                    () -> in("itemId", itemsPartition))
                            .whereIf(enterpriseCode != null,
                                    () -> equal("enterpriseCode", enterpriseCode))
                            .whereIf(CollectionUtils.isNotEmpty(shipNodes),
                                    () -> in("shipNode", shipNodes))
                            .build();
                    List<Inventory> inventories = inventoryRepository.queryDocuments(query);
                    logger.info("Inventory Read took {}ms. Query: {}. CorrelationId: {}", System.currentTimeMillis() - startTime, query, correlationId);
                    return inventoryMapper.convertToInventoryResponseDto(inventories, shipNodeService::getShipNodeByKey);
                };
                return callable;
            })
            .collect(Collectors.toList());
    }

}
