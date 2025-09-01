package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum StandardCountryEnum {
    CA,
    US;

    private static final Map<String, StandardCountryEnum> enumMap =
            EnumUtils.getEnumMap(StandardCountryEnum.class);

    public static StandardCountryEnum fromString(String country) {
        return EnumUtils.fromStringToLowerCase(country, enumMap);
    }
}
