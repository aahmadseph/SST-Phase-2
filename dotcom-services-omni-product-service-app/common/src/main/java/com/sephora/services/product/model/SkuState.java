package com.sephora.services.product.model;

import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public enum SkuState {
    RETIRED,
    NOT_RETIRED;

    private static final Map<String, SkuState> enumMap =
            Arrays.stream(SkuState.values()).collect(Collectors.toMap(e -> e.name().toLowerCase(), e -> e));

    public static SkuState fromString(String skuState) {
        return enumMap.get(StringUtils.lowerCase(skuState));
    }
}