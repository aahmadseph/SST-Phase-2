package com.sephora.services.sourcingoptions.model;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
public class AzureTableEntityResponse {

    @JsonProperty("PartitionKey")
    private String partitionKey;

    @JsonProperty("RowKey")
    private String rowKey;

    @JsonProperty("Timestamp")
    private String timestamp;

    private Map<String, Object> properties = new HashMap<>();

    @JsonAnySetter
    public void setProperty(String name, Object value) {
        if (!"PartitionKey".equals(name) && !"RowKey".equals(name) && !"Timestamp".equals(name)) {
            properties.put(name, value);
        }
    }
}
