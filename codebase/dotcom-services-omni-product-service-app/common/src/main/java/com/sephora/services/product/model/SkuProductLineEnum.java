package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum SkuProductLineEnum {
    MERCH,
    SERVICE;

    private static final Map<String, SkuProductLineEnum> enumMap =
            EnumUtils.getEnumMap(SkuProductLineEnum.class);

    public static SkuProductLineEnum fromString(String country) {
        return EnumUtils.fromStringToLowerCase(country, enumMap);
    }
}
