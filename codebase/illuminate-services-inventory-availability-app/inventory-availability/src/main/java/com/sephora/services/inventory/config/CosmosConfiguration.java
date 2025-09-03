///*
// *  This software is the confidential and proprietary information of
// * sephora.com and may not be used, reproduced, modified, distributed,
// * publicly displayed or otherwise disclosed without the express written
// *  consent of sephora.com.
// *
// * This software is a work of authorship by sephora.com and protected by
// * the copyright laws of the United States and foreign jurisdictions.
// *
// *  Copyright  2019 sephora.com, Inc. All rights reserved.
// *
// */
//
//package com.sephora.services.inventory.config;
//
//import static java.nio.charset.StandardCharsets.UTF_8;
//
//import java.io.IOException;
//import java.net.URL;
//
//import org.apache.commons.io.IOUtils;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpStatus;
//
//import com.azure.data.cosmos.CosmosClientException;
//import com.azure.data.cosmos.CosmosContainerProperties;
//import com.azure.data.cosmos.CosmosTriggerProperties;
//import com.azure.data.cosmos.CosmosTriggerResponse;
//import com.azure.data.cosmos.TriggerOperation;
//import com.azure.data.cosmos.TriggerType;
//import com.microsoft.azure.spring.data.cosmosdb.CosmosDbFactory;
//import com.microsoft.azure.spring.data.cosmosdb.config.CosmosDBConfig;
//import com.microsoft.azure.spring.data.cosmosdb.core.convert.MappingCosmosConverter;
//import com.microsoft.azure.spring.data.cosmosdb.repository.config.EnableCosmosRepositories;
//import com.microsoft.azure.spring.data.cosmosdb.repository.support.CosmosEntityInformation;
//import com.sephora.platform.database.cosmosdb.BaseCosmosConfiguration;
//import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
//
//import lombok.Getter;
//import lombok.Setter;
//import lombok.extern.log4j.Log4j2;
//
///**
// * @author Vitaliy Oleksiyenko
// */
////@ConditionalOnProperty(prefix = "azure.cosmosdb", name = "uri")
////@EnableCosmosRepositories(
////        basePackages = {"com.sephora.services.inventory.repository.cosmos"}
////)
////@Configuration("inventoryCosmosConfiguration")
////@ConfigurationProperties(prefix = "azure.cosmosdb")
//@Getter
//@Setter
//@Log4j2
//public class CosmosConfiguration extends BaseCosmosConfiguration {
//
//    public static final String INVENTORY_COLLECTION = "inventory";
//    public static final String SHIP_NODE_COLLECTION = "shipNode";
//
//    public static final String INVENTORY_UPDATE_PRE_TRIGGER = "inventoryUpdatePreTrigger";
//
//    private class InventoryCosmosTemplate extends CustomCosmosTemplate {
//
//        public InventoryCosmosTemplate(CosmosDbFactory cosmosDbFactory, MappingCosmosConverter mappingCosmosConverter, String dbName) {
//            super(cosmosDbFactory, mappingCosmosConverter, dbName);
//        }
//
//        @Override
//        public CosmosContainerProperties createCollectionIfNotExists(CosmosEntityInformation<?, ?> information) {
//            CosmosContainerProperties properties = super.createCollectionIfNotExists(information);
//            if (INVENTORY_COLLECTION.equals(information.getCollectionName())) {
//                createPreTrigger(INVENTORY_UPDATE_PRE_TRIGGER, information.getCollectionName(), this);
//            }
//            return properties;
//        }
//    }
//
//	/*
//	 * @Bean public CosmosDBConfig getConfig() { return super.getConfig(); }
//	 */
//
//    @Bean
//    public CustomCosmosTemplate cosmosTemplate(CosmosDBConfig config)
//            throws ClassNotFoundException {
//        return new InventoryCosmosTemplate(this.cosmosDbFactory(config), this.mappingCosmosConverter(),
//                config.getDatabase());
//    }
//
//    private void createPreTrigger(String triggerId, String collection, CustomCosmosTemplate cosmosTemplate) {
//        log.debug("Create trigger for collection {} with id {}", collection, triggerId);
//        String triggerPath = String.format("/js/%s.js", triggerId);
//
//        URL url = getClass().getResource(triggerPath);
//        if (url == null) {
//            log.error("Error during reading trigger file: {}. Trigger initialization skipped.", triggerPath);
//            return;
//        }
//        String triggerBody = null;
//        try {
//            triggerBody = IOUtils.toString(url, UTF_8);
//        } catch (IOException e) {
//            log.error("Error during reading trigger file: {}", triggerPath, e);
//        }
//        if (triggerBody != null) {
//
//            CosmosTriggerProperties cosmosTriggerProperties = new CosmosTriggerProperties()
//                    .id(triggerId)
//                    .body(triggerBody)
//                    .triggerType(TriggerType.PRE)
//                    .triggerOperation(TriggerOperation.ALL);
//
//            try {
//                CosmosTriggerResponse response = cosmosTemplate.getDatabase().getContainer(collection).getScripts()
//                        .createTrigger(cosmosTriggerProperties)
//                        .doOnError(CosmosClientException.class, throwable -> {
//                            if (throwable.statusCode() == HttpStatus.CONFLICT.value()) {
//                                log.info("Trigger {} already exists", triggerId);
//                            } else {
//                                log.error("Trigger creation error", throwable);
//                            }
//                        })
//                        .block();
//
//            } catch (Exception e) {
//                if (!(e.getCause() instanceof CosmosClientException)) {
//                    log.error("Error during creation trigger: {}", triggerId, e);
//                }
//            }
//
//        }
//    }
//
//}
