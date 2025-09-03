package com.sephora.services.sourcingoptions.config;


import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class CarrierLevelConfiguration {
    private Map<String, Map<String, List<String>>> levelOfService;
}
