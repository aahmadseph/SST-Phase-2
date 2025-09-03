package com.sephora.services.sourcingoptions.model.dto;

import com.sephora.services.sourcingoptions.model.CountryEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class LocationsByPriorityResponse {

    private String zipCode;
    private CountryEnum country;
    private List<LocationPriority> locationPriorities;
}
