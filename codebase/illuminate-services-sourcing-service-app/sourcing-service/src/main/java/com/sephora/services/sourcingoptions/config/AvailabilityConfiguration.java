package com.sephora.services.sourcingoptions.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
public class AvailabilityConfiguration {
    @Value("${availabilityhub.defaultTransactionType:DEFAULT}")
    private String defaultTransactionType;
    @Value("#{'${shipment.dc-locations:0701,0801,1001,1021,1050,0750,US_NONSHIP,CA_NONSHIP,1070}'.split(',')}")
    private List<String> dcLocations;
    @Value("#{'${shipment.us-locations:1021,1001,0801,0701,US_NONSHIP,US_INFINITE}'.split(',')}")
    private List<String> usLocations;
    @Value("#{'${shipment.ca-locations:1050,0750,CA_NONSHIP,CA_INFINITE,1070}'.split(',')}")
    private List<String> caLocations;
}
