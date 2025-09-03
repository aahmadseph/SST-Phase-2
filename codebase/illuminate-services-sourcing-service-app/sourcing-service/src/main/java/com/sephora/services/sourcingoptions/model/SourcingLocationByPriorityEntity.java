package com.sephora.services.sourcingoptions.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SourcingLocationByPriorityEntity {

    @JsonProperty("PartitionKey")
    private String partitionKey;

    @JsonProperty("RowKey")
    private String rowKey;

    @JsonProperty("LocationPriorities")
    private String locationPriorities;
}
