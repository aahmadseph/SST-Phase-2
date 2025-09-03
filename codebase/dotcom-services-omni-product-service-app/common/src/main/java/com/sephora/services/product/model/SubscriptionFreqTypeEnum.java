package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum SubscriptionFreqTypeEnum {
    MONTH, WEEK;

    private static final Map<String, SubscriptionFreqTypeEnum> enumMap =
            EnumUtils.getEnumMap(SubscriptionFreqTypeEnum.class);

    public static SubscriptionFreqTypeEnum fromString(String subscriptionFreqTypeStr) {
        return EnumUtils.fromStringToLowerCase(subscriptionFreqTypeStr, enumMap);
    }
}
