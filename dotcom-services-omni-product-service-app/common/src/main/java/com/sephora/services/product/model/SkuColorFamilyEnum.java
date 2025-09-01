package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;

public enum SkuColorFamilyEnum {
    UNCONVENTIONAL("Unconventional"),
    WHITE_OFF_WHITE("White/off-white", "Blanc"),
    ORANGE("Orange"),
    YELLOW("Yellow"),
    SILVER("Silver", "Argent"),
    UNIVERSAL("Universal", "Universel"),
    CLEAR("Clear", "Incolore"),
    GREY("Grey", "Gris"),
    CORAL("Coral"),
    BLUE("Blue", "Bleu"),
    BROWN("Brown", "Brun"),
    BERRY("Berry"),
    MULTI("Multi"),
    NUDE("Nude"),
    PURPLE("Purple"),
    GOLD("Gold"),
    GREEN("Green"),
    RED("Red", "Rouge"),
    BLACK("Black", "Noir"),
    PINK("Pink", "Rose"),
    OTHER(StringUtils.EMPTY);

    private static final Map<String, SkuColorFamilyEnum> enumMap =
            EnumUtils.getEnumMapWithMultiType(SkuColorFamilyEnum.class, e -> e.colors, StringUtils::lowerCase);

    public static SkuColorFamilyEnum fromString(String skuType) {
        return EnumUtils.fromStringIgnoreWhitespace(skuType, enumMap, OTHER);
    }

    private final List<String> colors;

    SkuColorFamilyEnum(String... colors) {
        this.colors = List.of(colors);
    }

}
