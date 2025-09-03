package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum RewardTypeEnum {
    CELEBRATION_VIB,
    CURTAINS_UP_VIB,
    CURTAINS_UP_ROUGE,
    CELEBRATION_ROUGE,
    ROUGE_WELCOME_KIT,
    BD_GIFT,
    POINTS,
    VIB_WK,
    ROUGE_WK,
    ROUGE_RQ_WK,
    REWARD_CARD,
    PERSONALIZED,
    CASH_BACK,
    PERCENT_OFF,
    OTHER;

    private static final Map<String, RewardTypeEnum> enumMap =
            EnumUtils.getEnumMap(RewardTypeEnum.class);

    public static RewardTypeEnum fromString(String country) {
        return EnumUtils.fromStringToLowerCase(country, enumMap, OTHER);
    }
}
