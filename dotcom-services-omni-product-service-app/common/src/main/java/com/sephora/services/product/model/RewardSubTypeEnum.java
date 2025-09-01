package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum RewardSubTypeEnum {
    /**
     * Use value to send in api responses as this value is expected in OMS
     */
    BONUS_POINTS("Bonus_Points"),
    MAKEOVER("Makeover"),
    FLASH("Flash"),
    FREE_SHIPPING_VIB("Free_Shipping_VIB"),
    REWARD_CARD("Reward_Card"),
    EXPERIENTIAL_CONCIERGE("Experiential_Concierge"),
    EXPERIENTIAL_PERSONALIZATION("Experiential_Personalization"),
    EXPERIENTIAL_MAKEOVER("Experiential_Makeover"),
    EXPERIENTIAL_NOTRIGGER("Experiential_notrigger"),
    PRODUCT("Product"),
    CHARITY("Charity"),
    CHARITY_CA("Charity_Ca"),
    OTHER("");

    private final String value;

    public String getValue() {
        return this.value;
    }

    RewardSubTypeEnum(String value) {
        this.value = value;
    }

    private static final Map<String, RewardSubTypeEnum> enumMap =
            EnumUtils.getEnumMapWithIgnoreEmpty(RewardSubTypeEnum.class, e -> e.value);

    public static RewardSubTypeEnum fromString(String country) {
        return EnumUtils.fromStringToLowerCase(country, enumMap, OTHER);
    }
}
