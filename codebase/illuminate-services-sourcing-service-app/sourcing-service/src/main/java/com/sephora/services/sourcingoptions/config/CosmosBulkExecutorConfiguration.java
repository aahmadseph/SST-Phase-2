package com.sephora.services.sourcingoptions.config;

import com.azure.cosmos.CosmosClientBuilder;
import com.microsoft.azure.documentdb.*;
import com.microsoft.azure.documentdb.bulkexecutor.DocumentBulkExecutor;
import com.sephora.platform.app.configuration.annotation.RequiresContextRefreshOnUpdate;
import com.sephora.platform.app.configuration.annotation.RunTimeConfiguration;
import com.sephora.platform.database.cosmosdb.CustomCosmosConfiguration;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.sephora.services.sourcingoptions.model.cosmos.Constants.ZONE_MAP_CONTAINER_NAME;

@ConditionalOnProperty(prefix = "sourcing.options.azure.cosmosdb", name = "enabled", havingValue = "true")
@Configuration("sourcingBulkExecutorConfig")
@RunTimeConfiguration
@ConfigurationProperties(prefix = "sourcing.options.bulk-executor")
@Setter
public class CosmosBulkExecutorConfiguration extends CustomCosmosConfiguration {

    @Value("${zoneMapBulkImportThroughput:20000}")
    private int zoneMapBulkImportThroughput;

    @Value("${zoneMapBulkImportMaxPoolSize:1000}")
    private int zoneMapBulkImportMaxPoolSize;

    @Autowired
    private CosmosConfig cosmosConfiguration;

    @Bean
    @RefreshScope
    public DocumentBulkExecutor zoneMapBulkExecutor() throws Exception {
        return buildBulkExecutor(ZONE_MAP_CONTAINER_NAME,
                getZoneMapBulkImportThroughput(),
                getZoneMapBulkImportMaxPoolSize());
    }

    private DocumentBulkExecutor buildBulkExecutor(String containerName, int offerThroughput, int maxPoolSize) throws Exception {
        ConnectionPolicy connectionPolicy = new ConnectionPolicy();
        connectionPolicy.setConnectionMode(ConnectionMode.DirectHttps);
        connectionPolicy.setMaxPoolSize(maxPoolSize);
        DocumentClient client = new DocumentClient(
                cosmosConfiguration.getUri(),
                cosmosConfiguration.getKey(),
                connectionPolicy,
                ConsistencyLevel.Session);

        // Set client's retry options high for initialization
        client.getConnectionPolicy().getRetryOptions().setMaxRetryWaitTimeInSeconds(30);
        client.getConnectionPolicy().getRetryOptions().setMaxRetryAttemptsOnThrottledRequests(9);

        // Builder pattern
        String collectionLink = String.format("/dbs/%s/colls/%s", cosmosConfiguration.getDbName(), containerName);
        DocumentCollection collection = client.readCollection(collectionLink, null).getResource();
        DocumentBulkExecutor.Builder bulkExecutorBuilder = DocumentBulkExecutor.builder().from(
                client,
                cosmosConfiguration.getDbName(),
                containerName,
                collection.getPartitionKey(),
                offerThroughput);

        // Instantiate DocumentBulkExecutor
        DocumentBulkExecutor bulkExecutor = bulkExecutorBuilder.build();

        // Set retries to 0 to pass complete control to bulk executor
        client.getConnectionPolicy().getRetryOptions().setMaxRetryWaitTimeInSeconds(0);
        client.getConnectionPolicy().getRetryOptions().setMaxRetryAttemptsOnThrottledRequests(0);

        return bulkExecutor;
    }

    @RequiresContextRefreshOnUpdate
    public int getZoneMapBulkImportThroughput() {
        return zoneMapBulkImportThroughput;
    }

    @RequiresContextRefreshOnUpdate
    public int getZoneMapBulkImportMaxPoolSize() {
        return zoneMapBulkImportMaxPoolSize;
    }

    @Override
    public CosmosClientBuilder getCosmosClientBuilder() {
        return cosmosConfiguration.getCosmosClientBuilder();
    }

    @Override
    protected String getDatabaseName() {
        return cosmosConfiguration.getDbName();
    }
}
