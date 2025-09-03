package com.sephora.services.inventory.cosmos;//package com.sephora.services.inventory.cosmos;
//
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import com.microsoft.azure.spring.data.cosmosdb.config.CosmosDBConfig;
//import com.microsoft.azure.spring.data.cosmosdb.repository.config.EnableCosmosRepositories;
//import com.sephora.platform.database.cosmosdb.BaseCosmosConfiguration;
//import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
//import com.sephora.services.inventory.cosmos.template.InventoryCosmosTemplate;
//
//import lombok.extern.log4j.Log4j2;
//
//@Log4j2
//@EnableCosmosRepositories(
//        basePackages = {"com.sephora.services.inventory.cosmos.repository"}
//)
//@Configuration
//@ConfigurationProperties(prefix = "azure.cosmosdb")
//@ConditionalOnProperty(prefix = "azure", name = "enabled", havingValue = "true", matchIfMissing = true)
//public class CosmosConfiguration extends BaseCosmosConfiguration {
//
//	@Bean
//    public CosmosDBConfig getConfig() {
//        return  super.getConfig();
//    }
//
//	 @Bean
//	    public CustomCosmosTemplate cosmosTemplate(CosmosDBConfig config)
//	            throws ClassNotFoundException {
//	        return new InventoryCosmosTemplate(this.cosmosDbFactory(config), this.mappingCosmosConverter(),
//	                config.getDatabase());
//	    }
//}
