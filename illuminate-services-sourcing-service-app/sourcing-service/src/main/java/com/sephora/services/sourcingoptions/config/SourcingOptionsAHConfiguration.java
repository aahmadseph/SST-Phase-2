package com.sephora.services.sourcingoptions.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix="sourcingoptions.availabilityhub.constants")
@Data
public class SourcingOptionsAHConfiguration {
    private String orgId = "SEPHORA";
    private String uom = "EACH";
    private String sourcingConstraint = "SINGLE_LOCATION";
    private String transactionType = "DEFAULT";
    private String OptimizationRuleId = "SDD_MINIMIZE_DISTANCE"; //GUAR-4688

}
