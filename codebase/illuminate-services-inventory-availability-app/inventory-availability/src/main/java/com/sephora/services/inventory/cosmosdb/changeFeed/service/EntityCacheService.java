/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2019 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.inventory.cosmosdb.changeFeed.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import com.sephora.platform.database.cosmosdb.changefeed.cache.EntityCacheInformation;
import com.sephora.platform.database.cosmosdb.changefeed.service.BaseEntityCacheService;

import lombok.extern.log4j.Log4j2;

/**
 * @author Vitaliy Oleksiyenko
 */
@Service
@Log4j2
public class EntityCacheService extends BaseEntityCacheService {

    public EntityCacheService(@Autowired List<EntityCacheInformation> entityCacheInformationList,
                              @Autowired CacheManager cacheManager) {
        super(entityCacheInformationList, cacheManager);
    }

}
