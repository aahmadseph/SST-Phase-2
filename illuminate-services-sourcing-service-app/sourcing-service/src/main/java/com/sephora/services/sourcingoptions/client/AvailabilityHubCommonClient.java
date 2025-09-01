package com.sephora.services.sourcingoptions.client;

import com.sephora.services.sourcingoptions.model.dto.zonemap.SourcingHubZoneMapKafkaMessage;
import feign.Headers;
import feign.RequestLine;

public interface AvailabilityHubCommonClient {
    @RequestLine("POST /kafka-rest-services")
    @Headers({"Content-Type: application/json","correlationId: {correlationId}"})
    void submitZoneMappingKafkaMessage(SourcingHubZoneMapKafkaMessage kafkaMessage);
}
