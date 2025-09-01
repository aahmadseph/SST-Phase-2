/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2020 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.inventory.service;

import com.google.common.collect.Lists;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import com.sephora.services.inventory.model.dto.GetInventoryAvailabilityDto;
import com.sephora.services.inventory.util.InventoryUtils;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.sephora.services.inventory.config.async.AsyncConfig.THREADPOOL_TASKEXECUTOR_SERVICE;

/**
 * @author Vitaliy Oleksiyenko
 */
@Service
@Getter
@Setter
@Log4j2
@EnableConfigurationProperties(InventoryWarmUpService.WarmUpConfig.class)
public class InventoryWarmUpService {

    private static final int MAX_ITEM_ON_REQUEST = 6;
    private static final int INVENTORY_CALL_COUNT = 10;

    private static final Random random = new Random();

    @Autowired
    private WarmUpConfig warmUpConfig;

    @Autowired
    private InventoryShipNodeService shipNodeService;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    @Qualifier(THREADPOOL_TASKEXECUTOR_SERVICE)
    private ExecutorService executorService;

    @ConfigurationProperties(prefix = "inventory.warmup")
    @Getter
    @Setter
    public static class WarmUpConfig {
        private boolean enabled;
        private String[] itemIds;
    }

    /**
     * @param warmUpConfig the warmUpConfig to set
     */
    public void setWarmUpConfig(WarmUpConfig warmUpConfig) {
        this.warmUpConfig = warmUpConfig;
    }

    public void warmUp() {
        if (warmUpConfig.isEnabled()) {
            long startTime = System.currentTimeMillis();
            performWarmUp();
            log.info("warmUp took {}ms", System.currentTimeMillis() - startTime);
        } else {
            log.info("Warm Up disabled");
        }
    }

    private void performWarmUp() {
        log.debug("Retrieve all ship nodes");
        Arrays.stream(EnterpriseCodeEnum.values())
                .forEach(enterpriseCodeEnum -> {
                    log.debug("Retrieve ship nodes for enterpriseCode : {}", enterpriseCodeEnum);
                    List<String> shipNodes = shipNodeService.findByEnterpriseCode(enterpriseCodeEnum.name())
                            .stream()
                            .filter(shipNode -> !InventoryUtils.getInfiniteShipNodeName(enterpriseCodeEnum.name()).equals(shipNode))
                            .peek(shipNodeService::getShipNodeByKey)
                            .collect(Collectors.toList());

                    CompletableFuture.allOf(
                            IntStream.range(0, INVENTORY_CALL_COUNT)
                                    .mapToObj((index) ->
                                            CompletableFuture.runAsync(() -> performInventoryCall(enterpriseCodeEnum, Lists.newArrayList(shipNodes)),
                                                    executorService)).toArray(CompletableFuture[]::new))
                            .whenComplete((aVoid, throwable) -> {
                                if (throwable != null) {
                                    log.error("Error while inventory read", throwable);
                                }
                            })
                            .join();
                });
    }

    private void performInventoryCall(EnterpriseCodeEnum enterpriseCodeEnum, List<String> shipNodes) {
        try {
            List<String> itemList = getRandomItemsList();
            log.debug("Retrieve inventories for enterpriseCode: {} and itemsIds: {}", enterpriseCodeEnum, itemList);
            inventoryService.findInventoryBySpecifiedConditions(
                    GetInventoryAvailabilityDto.builder()
                            .enterpriseCode(enterpriseCodeEnum.name())
                            .shipNodes(shipNodes)
                            .items(itemList)
                            .build()
            );
        } catch (InventoryServiceException | AvailabilityServiceException e) {
            log.error("Can't retrieve find inventory for warmUp");
        }
    }

    private List<String> getRandomItemsList() {
        List<String> itemsList = new ArrayList<String>(Arrays.asList(warmUpConfig.itemIds));
        return IntStream.range(0, MAX_ITEM_ON_REQUEST)
                .mapToObj((index) -> itemsList.remove(random.nextInt(itemsList.size())))
                .collect(Collectors.toList());
    }

}
