package com.sephora.services.sourcingoptions.model;

import lombok.Data;

import java.util.List;

@Data
public class PriorityConfig {
    
    private List<String> requestOrigin;
    private List<String> priorityOrder;
}
