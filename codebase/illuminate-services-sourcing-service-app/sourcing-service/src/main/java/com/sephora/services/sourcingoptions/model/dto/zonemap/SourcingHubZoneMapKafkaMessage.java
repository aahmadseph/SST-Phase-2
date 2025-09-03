package com.sephora.services.sourcingoptions.model.dto.zonemap;

import java.util.Map;

public class SourcingHubZoneMapKafkaMessage {
   /* "isFullyQualifiedTopicName": false,
            "key": {

    },
            "operation": "CREATE",
            "topic": "zone",
            "value": {

    }*/
    private Boolean isFullyQualifiedTopicName;
    private Map<String,String> key;
    private SourcingHubZoneMapInfo value;
    private String operation;
    private String topic;

    public Boolean getIsFullyQualifiedTopicName() {
        return isFullyQualifiedTopicName;
    }

    public void setIsFullyQualifiedTopicName(Boolean fullyQualifiedTopicName) {
        isFullyQualifiedTopicName = fullyQualifiedTopicName;
    }

    public Map<String, String> getKey() {
        return key;
    }

    public void setKey(Map<String, String> key) {
        this.key = key;
    }

    public SourcingHubZoneMapInfo getValue() {
        return value;
    }

    public void setValue(SourcingHubZoneMapInfo value) {
        this.value = value;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}
