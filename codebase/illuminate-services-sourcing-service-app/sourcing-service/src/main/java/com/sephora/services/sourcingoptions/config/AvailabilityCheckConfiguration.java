package com.sephora.services.sourcingoptions.config;

import lombok.Data;
import java.util.List;

@Data
public class AvailabilityCheckConfiguration {
    private List<String> requestOrigin;
}
