package com.sephora.services.inventoryavailability.model.transit.postTimeInTransit;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class PostTimeInTransitRequest {
    @Schema(required = true, example = "SEPHORA")
    private String orgId;
    private String countryCode;
    private String destination;
    private String locationType;
    private String locationId;
    private String fulfillmentService;
    private TransitTime transitTime;
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
