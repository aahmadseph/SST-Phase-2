package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;
import lombok.Getter;

import java.util.Map;

public enum ProductVariationType {
    COLOR("Color"),
    FORMULATION("Formulation"),
    NONE("None"),
    SCENT("Scent"),
    SIZE("Size"),
    SIZE_CONCENTRATION("Size + Concentration"),
    SIZE_CONCENTRATION_FORMULATION("Size + Concentration + Formulation"),
    TYPE("Type");

    private static final Map<String, ProductVariationType> enumMap =
            EnumUtils.getEnumMapWithKeyFunction(ProductVariationType.class, ProductVariationType::getValue);


    @Getter
    private final String value;

    ProductVariationType(String val) {
        value = val;
    }

    public static ProductVariationType fromString(String name) {
        return EnumUtils.fromStringToLowerCase(name, enumMap);
    }
}
