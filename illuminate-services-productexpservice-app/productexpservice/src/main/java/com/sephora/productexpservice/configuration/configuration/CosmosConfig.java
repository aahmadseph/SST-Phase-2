package com.sephora.productexpservice.configuration.configuration;

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

@ConditionalOnProperty(prefix = "example.options.azure.cosmosdb", name = "uri")
@EnableCosmosRepositories(
        basePackages = {"com.sephora.productexpservice.repository"},
        repositoryFactoryBeanClass = CosmosConfig.exampleCustomCosmosRepositoryFactoryBean.class,
        cosmosTemplateRef = CosmosConfig.COSMOS_TEMPLATE
)
@Configuration(CosmosConfig.COSMOS_CONFIG)
@ConfigurationProperties(prefix = "example.options.azure.cosmosdb")

public class CosmosConfig extends BaseCosmosConfiguration {

   public static final String PREFIX = "example";
   public static final String COSMOS_CONFIG = CosmosConfig.PREFIX + "CosmosConfig";
   private static final String COSMOS_DB_CONFIG_SUFFIX = "CosmosDbConfig";
   private static final String COSMOS_DB_CONFIG = PREFIX + COSMOS_DB_CONFIG_SUFFIX;
   private static final String COSMOS_TEMPLATE_SUFFIX = "CosmosTemplate";
   public static final String COSMOS_TEMPLATE = PREFIX + COSMOS_TEMPLATE_SUFFIX;

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
   public com.azure.spring.data.cosmos.config.CosmosConfig getConfig() {
      return super.getConfig();
   }

   @Bean(COSMOS_TEMPLATE)
   @Override
   public CustomCosmosTemplate cosmosTemplate(@Qualifier(COSMOS_DB_CONFIG) com.azure.spring.data.cosmos.config.CosmosConfig config)
           throws ClassNotFoundException {
      return new CustomCosmosTemplate(this.cosmosFactory(), config, this.mappingCosmosConverter(),
              super.getDatabaseName());
   }
}
