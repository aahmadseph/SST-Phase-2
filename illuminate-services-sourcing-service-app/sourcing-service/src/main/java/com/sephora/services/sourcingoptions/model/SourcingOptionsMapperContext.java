package com.sephora.services.sourcingoptions.model;

import com.sephora.services.sourcingoptions.config.SourcingOptionsConfiguration;
import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SourcingOptionsMapperContext {
    private String orgId = "SEPHORA";
    private String uom = "EACH";
    private String sourcingConstraint = "SINGLE_LOCATION";
    private String transactionType = "DEFAULT";
    //TODO remove as this is used as temporary value to pass to mapper
    private CarrierService carrierService;
    private List<CarrierService> carrierServices;
    private Map<String, CarrierService> itemCarrierServiceMap;
    private SourcingOptionsConfiguration configuration;
    private Integer counter;
    private Map<String, List<CarrierService>> levelOfServiceMap;
    private String levelOfService;
    private String timeZoneOffset;
    private String timeZone;
}
