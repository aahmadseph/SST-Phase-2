package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum ConfigurationOptionTypeEnum {
    SKU,
    PRODUCT;

    private static final Map<String, ConfigurationOptionTypeEnum> enumMap =
            EnumUtils.getEnumMap(ConfigurationOptionTypeEnum.class);

    public static ConfigurationOptionTypeEnum fromString(String locale) {
        return EnumUtils.fromStringToLowerCase(locale, enumMap);
    }
    }
