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

package com.sephora.services.inventoryavailability.cosmos.config;

import static java.nio.charset.StandardCharsets.UTF_8;

import java.io.IOException;
import java.net.URL;

import com.azure.cosmos.models.*;
import com.azure.spring.data.cosmos.CosmosFactory;
import com.azure.spring.data.cosmos.config.CosmosConfig;
import com.azure.spring.data.cosmos.core.convert.MappingCosmosConverter;
import com.azure.spring.data.cosmos.exception.CosmosAccessException;
import com.azure.spring.data.cosmos.exception.CosmosExceptionUtils;
import com.azure.spring.data.cosmos.repository.config.EnableCosmosRepositories;
import com.azure.spring.data.cosmos.repository.support.CosmosEntityInformation;
import com.sephora.platform.database.cosmosdb.BaseCosmosConfiguration;
import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@ConditionalOnProperty(prefix = "azure.cosmosdb", name = "uri")
@EnableCosmosRepositories(
        basePackages = {"com.sephora.services.inventoryavailability.cosmos.repository",
                "com.sephora.services.inventory.repository.cosmos",
        "com.sephora.services.inventory.cosmos.repository", "com.sephora.services.common.inventory.audit.repository"}
)
@Configuration
@ConfigurationProperties(prefix = "azure.cosmosdb")
@Getter
@Setter
@Log4j2
public class CosmosConfiguration extends BaseCosmosConfiguration {

    public static final String INVENTORY_COLLECTION = "inventory";
    public static final String SHIP_NODE_COLLECTION = "shipNode";
    public static final String ITEM_COLLECTION = "item";
    public static final String INV_USERS_COLLECTION = "invUsers";
    public static final String INV_SUPPLY_BULK_COLLECTION = "bulkAdjustInventory";

    public static final String INVENTORY_UPDATE_PRE_TRIGGER = "inventoryUpdatePreTrigger";

    private class InventoryCosmosTemplate extends CustomCosmosTemplate {

        public InventoryCosmosTemplate(CosmosFactory cosmosDbFactory, @Autowired CosmosConfig cosmosConfig, MappingCosmosConverter mappingCosmosConverter, String dbName) {
            super(cosmosDbFactory, cosmosConfig, mappingCosmosConverter, dbName);
        }

        @Override
        public CosmosContainerProperties createCollectionIfNotExists(CosmosEntityInformation<?, ?> information) {
            CosmosContainerProperties properties = super.createCollectionIfNotExists(information);
            if (INVENTORY_COLLECTION.equals(information.getContainerName())) {
                createPreTrigger(INVENTORY_UPDATE_PRE_TRIGGER, information.getContainerName(), this);
            }
            return properties;
        }
    }

    @Bean
    @Primary
    public CosmosConfig getConfig() {
        return  super.getConfig();
    }

    @Bean
    @Primary
    public CustomCosmosTemplate cosmosTemplate(@Autowired CosmosConfig config)
            throws ClassNotFoundException {
        return new InventoryCosmosTemplate(this.cosmosFactory(), config, this.mappingCosmosConverter(),
                super.getDatabaseName());
    }

    private void createPreTrigger(String triggerId, String collection, CustomCosmosTemplate cosmosTemplate) {
        log.debug("Create trigger for collection {} with id {}", collection, triggerId);
        String triggerPath = String.format("/js/%s.js", triggerId);

        URL url = getClass().getResource(triggerPath);
        if (url == null) {
            log.error("Error during reading trigger file: {}. Trigger initialization skipped.", triggerPath);
            return;
        }
        String triggerBody = null;
        try {
            triggerBody = IOUtils.toString(url, UTF_8);
        } catch (IOException e) {
            log.error("Error during reading trigger file: {}", triggerPath, e);
        }
        if (triggerBody != null) {

            CosmosTriggerProperties cosmosTriggerProperties = new CosmosTriggerProperties(triggerId,triggerBody);
            cosmosTriggerProperties.setTriggerType(TriggerType.PRE);
            cosmosTriggerProperties.setTriggerOperation(TriggerOperation.ALL);


            CosmosTriggerResponse response = cosmosTemplate.getDatabase().getContainer(collection).getScripts()
                    .createTrigger(cosmosTriggerProperties)
                    .doOnError(throwable -> {
                        CosmosExceptionUtils.findAPIExceptionHandler("Failed to upsert item", throwable, super.getConfig().getResponseDiagnosticsProcessor());
                    })
                    .block();


        }
    }

}
