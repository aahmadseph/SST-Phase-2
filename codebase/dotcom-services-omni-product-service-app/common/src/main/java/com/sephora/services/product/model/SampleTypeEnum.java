package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum SampleTypeEnum {
    PRODUCT,
    SMART;

    private static final Map<String, SampleTypeEnum> enumMap =
            EnumUtils.getEnumMap(SampleTypeEnum.class);

    public static SampleTypeEnum fromString(String sampleTypeStr) {
        return EnumUtils.fromStringToLowerCase(sampleTypeStr, enumMap);
    }
}
