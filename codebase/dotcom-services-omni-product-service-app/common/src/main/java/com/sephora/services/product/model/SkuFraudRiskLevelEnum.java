package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum SkuFraudRiskLevelEnum {
    HIGH,
    MEDIUM,
    LOW,
    NONE;

    private static final Map<String, SkuFraudRiskLevelEnum> enumMap =
            EnumUtils.getEnumMap(SkuFraudRiskLevelEnum.class);

    public static SkuFraudRiskLevelEnum fromString(String country) {
        return EnumUtils.fromStringToLowerCase(country, enumMap);
    }
}
