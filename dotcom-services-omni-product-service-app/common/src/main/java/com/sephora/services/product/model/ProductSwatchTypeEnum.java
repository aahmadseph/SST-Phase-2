package com.sephora.services.product.model;

import com.sephora.services.product.utils.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.Map;

public enum ProductSwatchTypeEnum {

    IMAGE_RECTANGLE("Image - Rectangle"),
    IMAGE_42("Image - 42"),
    IMAGE_36("Image - 36"),
    IMAGE_62("Image - 62"),
    OTHER(StringUtils.EMPTY);

    private static final Map<String, ProductSwatchTypeEnum> enumMap =
            EnumUtils.getEnumMapWithIgnoreWhitespace(ProductSwatchTypeEnum.class, e -> e.type);

    public static ProductSwatchTypeEnum fromString(String skuType) {
        return EnumUtils.fromStringIgnoreWhitespace(skuType, enumMap, OTHER);
    }

    private final String type;

    ProductSwatchTypeEnum(String type) {
        this.type = type;
    }


}
