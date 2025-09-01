package com.sephora.services.inventoryavailability.model.transit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TimeInTransitResponse {
    private String orgId;
    private String countryCode;
    private String destination;
    private String locationType;
    private String locationId;
    private String fulfillmentService;
    private String zones;
    private String deliveryThreshold;
    private String drivingDistance;
    private TransitTime transitTime;
    private String transitBuffer;
    private String deliveryBuffer;
    private String derived;
    private String transferCalendar;
    private String deliveryCalendar;
    private String updateTime;
    private String updateUser;

    @Builder
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TransitTime {
        private Integer min;
        private Integer max;
    }
}
