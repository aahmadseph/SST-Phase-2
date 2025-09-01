package com.sephora.services.productaggregationservice.productaggregationservice.configuration;

import com.azure.cosmos.models.ConflictResolutionPolicy;
import com.azure.cosmos.models.CosmosContainerProperties;
import com.azure.spring.data.cosmos.CosmosFactory;
import com.azure.spring.data.cosmos.config.CosmosConfig;
import com.azure.spring.data.cosmos.core.CosmosOperations;
import com.azure.spring.data.cosmos.core.convert.MappingCosmosConverter;
import com.azure.spring.data.cosmos.repository.config.EnableCosmosRepositories;
import com.azure.spring.data.cosmos.repository.support.CosmosEntityInformation;
import com.sephora.platform.database.cosmosdb.BaseCosmosConfiguration;
import com.sephora.platform.database.cosmosdb.CustomCosmosRepositoryFactoryBean;
import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ConditionalOnProperty(prefix = "example.options.azure.cosmosdb", name = "uri")
@EnableCosmosRepositories(
        basePackages = {"com.sephora.services.example.repository"},
        cosmosTemplateRef = CosmosDBConfig.COSMOS_TEMPLATE
)
@Configuration(CosmosDBConfig.COSMOS_CONFIG)
@ConfigurationProperties(prefix = "example.options.azure.cosmosdb")
public class CosmosDBConfig extends BaseCosmosConfiguration {

   public static final String PREFIX = "example";
   public static final String COSMOS_CONFIG = CosmosDBConfig.PREFIX + "CosmosDBConfig";
   private static final String COSMOS_DB_CONFIG_SUFFIX = "CosmosConfig";
   private static final String COSMOS_DB_CONFIG = PREFIX + COSMOS_DB_CONFIG_SUFFIX;
   private static final String COSMOS_TEMPLATE_SUFFIX = "CosmosTemplate";
   public static final String COSMOS_TEMPLATE = PREFIX + COSMOS_TEMPLATE_SUFFIX;
   private static final String REF_CONTAINER = "ReferenceItemsCollection";

   public static class exampleCustomCosmosRepositoryFactoryBean extends CustomCosmosRepositoryFactoryBean {

      public exampleCustomCosmosRepositoryFactoryBean(Class repositoryInterface) {
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

   @Bean(COSMOS_TEMPLATE)
   @Override
   public CustomCosmosTemplate cosmosTemplate(@Qualifier(COSMOS_DB_CONFIG) CosmosConfig config)
           throws ClassNotFoundException {
      return new ReferenceImplemnetationCusotomCosmoTemplate(super.cosmosFactory(), config, this.mappingCosmosConverter(), this.getDbName());
   }

   private class ReferenceImplemnetationCusotomCosmoTemplate extends CustomCosmosTemplate {

      public ReferenceImplemnetationCusotomCosmoTemplate(CosmosFactory cosmosDbFactory, CosmosConfig cosmosConfig, MappingCosmosConverter mappingCosmosConverter, String dbName) {
         super(cosmosDbFactory, cosmosConfig, mappingCosmosConverter, dbName);
      }
      @Override
      public CosmosContainerProperties createContainerIfNotExists(CosmosEntityInformation<?, ?> information) {
         ConflictResolutionPolicy policy = ConflictResolutionPolicy.createLastWriterWinsPolicy("/_ts");
         CosmosContainerProperties containerProperties = new CosmosContainerProperties(information.getContainerName(), information.getPartitionKeyPath());
         containerProperties.setConflictResolutionPolicy(policy);
         CosmosContainerProperties properties = super.createContainerIfNotExists(information);

         if (REF_CONTAINER.equals(information.getContainerName())) {
            // createPreTrigger(INVENTORY_UPDATE_PRE_TRIGGER, information.getCollectionName(), this);
            log.info("Container name" + information.getContainerName());
         }
         return properties;
      }
   }
}

