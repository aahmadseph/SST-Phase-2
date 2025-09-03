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

package com.sephora.services.sourcingoptions.config;

import com.azure.cosmos.CosmosClient;
import com.azure.spring.data.cosmos.config.CosmosConfig;
import com.azure.spring.data.cosmos.core.CosmosOperations;
import com.azure.spring.data.cosmos.repository.config.EnableCosmosRepositories;
import com.sephora.platform.database.cosmosdb.BaseCosmosConfiguration;
import com.sephora.platform.database.cosmosdb.CustomCosmosRepositoryFactoryBean;
import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Vitaliy Oleksiyenko
 */
@ConditionalOnProperty(prefix = "deliverydates.azure.cosmosdb", name = "enabled" , havingValue = "true")
@EnableCosmosRepositories(
        basePackages = {"com.sephora.services.sourcingoptions.repository.carrier"},
        repositoryFactoryBeanClass = CosmosConfigCarrierService.SourcingOptionsCustomCosmosRepositoryFactoryBean.class,
        cosmosTemplateRef = com.sephora.services.sourcingoptions.config.CosmosConfigCarrierService.COSMOS_TEMPLATE
)
@Configuration(CosmosConfigCarrierService.COSMOS_CONFIG)
@ConfigurationProperties(prefix = "deliverydates.azure.cosmosdb")
@Getter
@Setter
public class CosmosConfigCarrierService extends BaseCosmosConfiguration {

    public static final String PREFIX = "deliveryDates";
    public static final String COSMOS_CONFIG_SUFFIX = "deliveryDatesCosmosConfig";
    public static final String COSMOS_CONFIG = PREFIX + COSMOS_CONFIG_SUFFIX;
    public static final String COSMOS_DB_CONFIG_SUFFIX = "deliveryDatesCosmosDBConfig";
    public static final String COSMOS_DB_CONFIG = PREFIX + COSMOS_DB_CONFIG_SUFFIX;
    public static final String COSMOS_TEMPLATE_SUFFIX = "deliveryDatesCosmosTemplate";
    public static final String COSMOS_TEMPLATE = PREFIX + COSMOS_TEMPLATE_SUFFIX;
    public static final String COSMOS_CLIENT_SUFFIX = "deliveryDatesCosmosClient";
    public static final String COSMOS_CLIENT = PREFIX + COSMOS_CLIENT_SUFFIX;
    public static final String COSMOS_DOCUMENT_CLIENT_SUFFIX = "deliveryDatesCosmosDocumentClient";
    public static final String COSMOS_DOCUMENT_CLIENT = PREFIX + COSMOS_DOCUMENT_CLIENT_SUFFIX;

    @Value("${bulkExecutorOfferThroughput:5000}")
    private int bulkExecutorOfferThroughput;

    public static class SourcingOptionsCustomCosmosRepositoryFactoryBean extends CustomCosmosRepositoryFactoryBean {

        public SourcingOptionsCustomCosmosRepositoryFactoryBean(Class repositoryInterface) {
            super(repositoryInterface);
        }

        @Autowired
        @Qualifier(COSMOS_TEMPLATE)
        @Override
        public void setCosmosOperations(CosmosOperations operations) {
            super.setCosmosOperations(operations);
        }

    }

    @Bean(COSMOS_DB_CONFIG)
    public CosmosConfig getConfig() {
        return super.getConfig();
    }

    @Bean(COSMOS_CLIENT)
    public CosmosClient cosmosClient(@Qualifier(COSMOS_DB_CONFIG) CosmosConfig config) {
        return this.cosmosClient();
    }

    @Bean(COSMOS_TEMPLATE)
    @Override
    public CustomCosmosTemplate cosmosTemplate(@Qualifier(COSMOS_DB_CONFIG) CosmosConfig config)
            throws ClassNotFoundException {
        return new CustomCosmosTemplate(this.cosmosFactory(), config, this.mappingCosmosConverter(),
                "delivery_dates");
    }
}
