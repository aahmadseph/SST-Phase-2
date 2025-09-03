package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response;

import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AHCartSourceResponse {
	private String cartId;
    private Double fulfillmentScore;
    private List<Shipment> shipments;
    private Map<String, Map<String,AuditDetail>> auditDetails;
}
