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

package com.sephora.services.inventory.listener;

import com.sephora.services.inventory.service.InventoryWarmUpService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * @author Vitaliy Oleksiyenko
 */
@Component
@Log4j2
public class ApplicationStartedEventListener implements ApplicationListener<ApplicationPreparedEvent> {

    @Autowired
    private InventoryWarmUpService inventoryWarmUpService;

    @Override
    public void onApplicationEvent(ApplicationPreparedEvent  applicationStartedEvent) {
        log.info("Application started. Perform warmUp");
        inventoryWarmUpService.warmUp();
    }
}
