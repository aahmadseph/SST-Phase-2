package com.sephora.services.sourcingoptions.client;

import com.sephora.services.sourcingoptions.model.AzureTableQueryResponse;
import com.sephora.services.sourcingoptions.model.SourcingLocationByPriorityEntity;
import feign.Headers;
import feign.Param;
import feign.RequestLine;

public interface AzureTableClient {

    @RequestLine("GET /{tableName}?$filter=PartitionKey%20eq%20%27{partitionKey}%27%20and%20RowKey%20eq%20%27{rowKey}%27")
    @Headers({
            "Accept: application/json;odata=nometadata",
            "x-ms-version: 2025-05-05"
    })
    AzureTableQueryResponse getEntityByKeys(@Param("tableName") String tableName, @Param("partitionKey") String partitionKey, @Param("rowKey") String rowKey);

    @RequestLine("PUT /{tableName}(PartitionKey='{partitionKey}',RowKey='{rowKey}')")
    @Headers({
            "Content-Type: application/json",
            "Accept: application/json;odata=nometadata",
            "x-ms-version: 2025-05-05"
    })
    void upsertEntity(
            @Param("tableName") String tableName,
            @Param("partitionKey") String partitionKey,
            @Param("rowKey") String rowKey,
            SourcingLocationByPriorityEntity entity);
}
