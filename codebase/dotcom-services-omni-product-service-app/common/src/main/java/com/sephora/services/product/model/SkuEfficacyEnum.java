package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.Map;

public enum SkuEfficacyEnum {
    EFFICACY_A("A"),
    EFFICACY_B("B"),
    EFFICACY_C("C"),
    EFFICACY_D("D"),
    EFFICACY_E("E"),
    EFFICACY_2("2"),
    EFFICACY_3("3"),
    EFFICACY_4("4"),
    EFFICACY_5("5"),
    OTHER(StringUtils.EMPTY);

    private static final Map<String, SkuEfficacyEnum> enumMap =
            EnumUtils.getEnumMapWithIgnoreEmpty(SkuEfficacyEnum.class, e -> e.efficacy);

    public static SkuEfficacyEnum fromString(String skuType) {
        return EnumUtils.fromStringToLowerCase(skuType, enumMap, OTHER);
    }

    private final String efficacy;

    SkuEfficacyEnum(String efficacy) {
        this.efficacy = efficacy;
    }
}
