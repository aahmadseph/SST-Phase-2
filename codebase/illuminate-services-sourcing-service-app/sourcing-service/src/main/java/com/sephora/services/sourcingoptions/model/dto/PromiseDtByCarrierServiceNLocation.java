package com.sephora.services.sourcingoptions.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromiseDtByCarrierServiceNLocation {

    private String carrierServiceCode;
    private List<Location> locations;
}
