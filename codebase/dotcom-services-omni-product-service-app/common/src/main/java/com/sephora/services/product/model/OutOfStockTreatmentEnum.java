package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;

import java.util.Map;

public enum OutOfStockTreatmentEnum {
    SHOW_SKU_WITH_BACK_IN_STOCK_REMINDER("Show SKU - With Back-in-Stock Reminder (Used for Sellable)"),
    SHOW_SKU_WITHOUT_BACK_IN_STOCK_REMINDER("Show SKU - WITHOUT Back-in-Stock Reminder (Used for Sellable & Rewards, Default for all GWP)"),
    SHOW_SKU_AS_STORE_ONLY("Show SKU - Show as Store Only (Used for Sellable)"),
    DO_NOT_SHOW_SKU("Do Not Show SKU (Used for Sellable, Rewards)");

    private static final Map<String, OutOfStockTreatmentEnum> enumMap =
            EnumUtils.getEnumMapWithIgnoreWhitespace(OutOfStockTreatmentEnum.class, e -> e.treatment);

    public static OutOfStockTreatmentEnum fromString(String skuType) {
        return EnumUtils.fromStringIgnoreWhitespace(skuType, enumMap);
    }

    private final String treatment;

    OutOfStockTreatmentEnum(String treatment) {
        this.treatment = treatment;
    }
}


