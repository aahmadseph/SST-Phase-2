package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum SkuTypeEnum {
    STANDARD("Standard"),
    SAMPLE("Sample"),
    GWP("GWP"),
    SUBSCRIPTION("Subscription"),
    PLAYBOX("Playbox"),
    SDU("SDU"),
    GIFT_CARD("Gift Card"),
    BAG_FEE("Bag Fee"),
    GIFT_WRAP_OPTION("Gift Wrap Option"),
    E_CERTIFICATE("e-Certificate"),
    FLASH_SKU("Flash SKU"),
    RETAIL_DELIVERY_FEE("Retail Delivery Fee");

    private static final Map<String, SkuTypeEnum> enumMap =
            EnumUtils.getEnumMapWithIgnoreWhitespace(SkuTypeEnum.class, e -> e.type);

    public static SkuTypeEnum fromString(String skuType) {
        return EnumUtils.fromStringIgnoreWhitespace(skuType, enumMap);
    }

    private final String type;

    SkuTypeEnum(String type) {
        this.type = type;
    }
}
