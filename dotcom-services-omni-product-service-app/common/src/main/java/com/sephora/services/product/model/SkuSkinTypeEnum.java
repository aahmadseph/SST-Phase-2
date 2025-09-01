package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;

public enum SkuSkinTypeEnum {
    DRY("Dry", "Sèche"),
    OILY("Oily", "huileuse"),
    COMBINATION("Combination", "Mixte"),
    SENSITIVE("Sensitive", "Sensible"),
    NORMAL("Normal", "Normale");


    private static final Map<String, SkuSkinTypeEnum> enumMap =
            EnumUtils.getEnumMapWithMultiType(SkuSkinTypeEnum.class, e -> e.values, StringUtils::lowerCase);

    private final List<String> values;

    SkuSkinTypeEnum(String... values) {
        this.values = List.of(values);
    }

    public static SkuSkinTypeEnum fromString(String skinType) {
        return EnumUtils.fromStringToLowerCase(skinType, enumMap);
    }
}
