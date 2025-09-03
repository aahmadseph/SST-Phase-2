package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum SkuSelectorTypeEnum {
    IMAGE,
    TEXT,
    NONE;

    private static final Map<String, SkuSelectorTypeEnum> enumMap =
            EnumUtils.getEnumMap(SkuSelectorTypeEnum.class);

    public static SkuSelectorTypeEnum fromString(String selectorType) {
        return EnumUtils.fromStringToLowerCase(selectorType, enumMap);
    }
}
