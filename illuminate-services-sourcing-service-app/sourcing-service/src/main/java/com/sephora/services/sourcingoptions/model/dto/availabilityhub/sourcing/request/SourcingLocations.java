package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SourcingLocations {
    Map<String, List<Location>> include;
}
