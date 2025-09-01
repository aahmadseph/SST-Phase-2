package com.sephora.services.sourcingoptions.model.dto;

import com.sephora.services.sourcingoptions.model.CountryEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LocationsByPriorityInput {

    private String currentDateTime;
    private String zipCode;
    private String requestOrigin;
    private CountryEnum country;
}
