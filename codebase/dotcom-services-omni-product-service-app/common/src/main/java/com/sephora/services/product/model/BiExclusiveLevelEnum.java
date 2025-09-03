package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum BiExclusiveLevelEnum {
    BI,
    VIB,
    ROUGE,
    NONE;

    private static final Map<String, BiExclusiveLevelEnum> enumMap =
            EnumUtils.getEnumMap(BiExclusiveLevelEnum.class);

    public static BiExclusiveLevelEnum fromString(String level) {
        return EnumUtils.fromStringToLowerCase(level, enumMap);
    }
}
