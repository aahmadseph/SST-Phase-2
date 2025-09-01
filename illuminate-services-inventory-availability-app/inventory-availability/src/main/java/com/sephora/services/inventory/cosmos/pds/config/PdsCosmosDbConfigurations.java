package com.sephora.services.inventory.cosmos.pds.config;

import com.azure.cosmos.CosmosClient;
import com.azure.spring.data.cosmos.config.CosmosConfig;
import com.azure.spring.data.cosmos.core.CosmosOperations;
import com.azure.spring.data.cosmos.repository.config.EnableCosmosRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sephora.platform.database.cosmosdb.BaseCosmosConfiguration;
import com.sephora.platform.database.cosmosdb.CustomCosmosRepositoryFactoryBean;
import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;

import lombok.Getter;
import lombok.Setter;

import static com.sephora.services.inventory.cosmos.pds.config.PdsCosmosDbConfigurations.COSMOS_TEMPLATE;

@ConditionalOnProperty(prefix = "pds.azure.cosmosdb", name = "uri")
@EnableCosmosRepositories(
        basePackages = {"com.sephora.services.inventory.cosmos.pds.repository"},
        repositoryFactoryBeanClass = PdsCosmosDbConfigurations.InventoryAvailabilityCustomPdsCosmosRepositoryFactoryBean.class,
        cosmosTemplateRef = COSMOS_TEMPLATE
)
@Configuration(PdsCosmosDbConfigurations.COSMOS_CONFIG)
@ConfigurationProperties(prefix = "pds.azure.cosmosdb")
@Getter
@Setter
public class PdsCosmosDbConfigurations extends BaseCosmosConfiguration {
	public static final String DYNAMIC_CONFIG_CONTAINER_NAME = "";
	
	public static final String PREFIX = "inventoryAvailability";
	public static final String COSMOS_CONFIG_SUFFIX = "PdsCosmosConfig";
	public static final String COSMOS_DB_CONFIG_SUFFIX = "PdsCosmosDBConfig";
	public static final String COSMOS_CLIENT_SUFFIX = "PdsCosmosClient";
	public static final String COSMOS_TEMPLATE_SUFFIX = "PdsCosmosTemplate";
	
	public static final String COSMOS_CONFIG = PREFIX + COSMOS_CONFIG_SUFFIX;
	public static final String COSMOS_DB_CONFIG = PREFIX + COSMOS_DB_CONFIG_SUFFIX;
	public static final String COSMOS_CLIENT = PREFIX + COSMOS_CLIENT_SUFFIX;
	public static final String COSMOS_TEMPLATE = PREFIX + COSMOS_TEMPLATE_SUFFIX;

	@Bean(COSMOS_DB_CONFIG)
    public CosmosConfig getConfig() {
        return super.getConfig();
    }
	
	@Bean(COSMOS_CLIENT)
    @Override
    public CosmosClient cosmosClient() {
        return super.cosmosClient();
    }
	
	@Bean(COSMOS_TEMPLATE)
    @Override
    public CustomCosmosTemplate cosmosTemplate(@Qualifier(COSMOS_DB_CONFIG) CosmosConfig config)
            throws ClassNotFoundException {
        return new CustomCosmosTemplate(this.cosmosFactory(), config,this.mappingCosmosConverter(),
                super.getDatabaseName());
    }
	
	public static class InventoryAvailabilityCustomPdsCosmosRepositoryFactoryBean extends CustomCosmosRepositoryFactoryBean {

        public InventoryAvailabilityCustomPdsCosmosRepositoryFactoryBean(Class repositoryInterface) {
            super(repositoryInterface);
        }

        @Autowired
        @Qualifier(COSMOS_TEMPLATE)
        @Override
        public void setCosmosOperations(CosmosOperations operations) {
            super.setCosmosOperations(operations);
        }

    }

}
