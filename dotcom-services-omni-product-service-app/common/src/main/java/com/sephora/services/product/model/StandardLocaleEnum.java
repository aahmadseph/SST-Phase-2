package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;
import lombok.Getter;

import java.util.Locale;
import java.util.Map;

public enum StandardLocaleEnum {
    EN_CA(Locale.CANADA),
    FR_CA(Locale.CANADA_FRENCH),
    EN_US(Locale.US);

    private static final Map<String, StandardLocaleEnum> enumMap =
            EnumUtils.getEnumMap(StandardLocaleEnum.class);

    private static final Map<Locale, StandardLocaleEnum> enumLocaleMap =
            EnumUtils.getEnumMapWithType(StandardLocaleEnum.class, e -> e.locale);

    public static StandardLocaleEnum fromString(String locale) {
        return EnumUtils.fromStringToLowerCaseWithDefault(locale, enumMap, EN_US);
    }

    public static StandardLocaleEnum fromLocale(Locale locale) {
        return EnumUtils.fromType(locale, enumLocaleMap, EN_US);
    }

    @Getter
    private final Locale locale;

    StandardLocaleEnum(Locale locale) {
        this.locale = locale;
    }

}
