package com.sephora.services.sourcingoptions.model.dto.zonemap;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ZoneMapMapperContext {
    String countryCode;
    String orgId = "SEPHORA";
    String updateUser = "SEPHORA";
    String operation = "CREATE";
    String topic = "zone";
}
