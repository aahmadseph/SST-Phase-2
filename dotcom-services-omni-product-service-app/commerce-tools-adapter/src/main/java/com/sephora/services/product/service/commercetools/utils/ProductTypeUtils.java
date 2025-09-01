package com.sephora.services.product.service.commercetools.utils;

import com.sephora.services.product.service.commercetools.service.ProductTypeService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductTypeUtils {

    public static final String PRODUCT_TYPE_NON_SELLABLE = "Non-Sellable";
    public static final String PRODUCT_TYPE_MERCH = "Merch";

    private final ProductTypeService productTypeService;

    public ProductTypeEnum getProductType(String productTypeId) {
        var productType = productTypeService.getProductTypeById(productTypeId);
        if (productType != null) {
            return ProductTypeEnum.fromString(productType.getName());
        }
        return null;
    }

    @Getter
    public enum ProductTypeEnum {

        NON_SELLABLE(PRODUCT_TYPE_NON_SELLABLE),
        MERCH(PRODUCT_TYPE_MERCH);

        private static final Map<String, ProductTypeEnum> enumMap =
                Arrays.stream(ProductTypeEnum.values())
                        .collect(Collectors.toMap(e -> e.getType().toLowerCase(), Function.identity()));
        private final String type;

        ProductTypeEnum(String type) {
            this.type = type;
        }

        public static ProductTypeEnum fromString(String productType) {
            return enumMap.get(StringUtils.lowerCase(productType));
        }
    }

}
