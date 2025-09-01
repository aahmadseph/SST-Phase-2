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

package com.sephora.services.inventory.cosmosdb.changeFeed;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Configuration;

import com.sephora.platform.database.cosmosdb.changefeed.ChangeFeedProperties;

/**
 * @author Vitaliy Oleksiyenko
 */
@Configuration
@ConditionalOnProperty(prefix = "azure.cosmosdb", name = "uri")
@ConfigurationProperties(prefix = "azure.cosmosdb.changefeedprocessor")
@RefreshScope
public class ChangeFeedConfiguration extends ChangeFeedProperties {

    @Override
    @Value("${azure.cosmosdb.dbName}")
    public void setDbName(String dbName) {
        super.setDbName(dbName);
    }
}
