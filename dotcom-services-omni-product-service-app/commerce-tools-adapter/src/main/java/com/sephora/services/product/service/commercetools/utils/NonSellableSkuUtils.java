package com.sephora.services.product.service.commercetools.utils;

import com.commercetools.api.models.common.Reference;
import com.commercetools.api.models.product.AttributesAccessor;
import com.commercetools.api.models.product.Product;
import com.commercetools.api.models.product.ProductCatalogData;
import com.commercetools.api.models.product.ProductData;
import com.commercetools.api.models.product.ProductReference;
import com.sephora.services.product.model.RewardSubTypeEnum;
import com.sephora.services.product.model.RewardTypeEnum;
import com.sephora.services.product.service.commercetools.model.ProductDto;
import lombok.experimental.UtilityClass;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Locale;
import java.util.Optional;

import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getAttributeValueFromEnum;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getDoubleAttributeValue;
import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.*;


@UtilityClass
public class NonSellableSkuUtils {

    @Nullable
    public static RewardTypeEnum getRewardType(@NotNull AttributesAccessor attributesAccessor) {
        return RewardTypeEnum.fromString(attributesAccessor.asString(SKU_REWARD_TYPE));
    }

    public static RewardSubTypeEnum getRewardSubType(@NotNull AttributesAccessor attributesAccessor) {
        return RewardSubTypeEnum.fromString(attributesAccessor.asString(SKU_REWARD_SUBTYPE));
    }

    public static Boolean getIsRewardActive(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_REWARD_IS_ACTIVE);
    }

    public static Double getRewardPoints(@NotNull AttributesAccessor attributesAccessor) {
        return getDoubleAttributeValue(attributesAccessor.get(SKU_REWARD_PRICE));
    }

    public static Double getRewardCurrencyAmount(@NotNull AttributesAccessor attributesAccessor) {
        return getDoubleAttributeValue(attributesAccessor.get(SKU_REWARD_CURRENCY_AMOUNT));
    }

    public static String getNonSellableType(AttributesAccessor attributesAccessor) {
        return getAttributeValueFromEnum(attributesAccessor.asEnum(SKU_NON_SELLABLE_TYPE));
    }

    public static String getFullSizeProductId(AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(FULL_SIZE_PRODUCT_KEY);
    }

    public static String getOriginalSampleProductId(AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(ORIGINAL_SAMPLE_PRODUCT_KEY);
    }

    public static ProductData getFullSizeProductData(AttributesAccessor attributesAccessor) {
        return getProductData(attributesAccessor.asReference(FULL_SIZE_PRODUCT));
    }


    public static ProductData getProductData(Reference productReference) {
        return Optional.ofNullable(productReference)
                .map(ProductReference.class::cast)
                .map(ProductReference::getObj)
                .map(Product::getMasterData)
                .map(ProductCatalogData::getCurrent)
                .orElse(null);
    }

    public static com.sephora.services.product.model.Product getOriginalSampleProduct(AttributesAccessor attributesAccessor,
                                                                                      Locale locale) {
        var productReference = getProductData(attributesAccessor.asReference(ORIGINAL_SAMPLE_PRODUCT));
        return Optional.ofNullable(productReference)
                .map(ProductReference.class::cast)
                .map(ProductReference::getObj)
                .map(product -> {
                    if (product.getMasterData() == null || product.getMasterData().getCurrent() == null) {
                        return null;
                    }
                    return new ProductDto(
                            product.getKey(),
                            product.getMasterData().getCurrent(),
                            locale,
                            true);
                })
                .orElse(null);
    }

}
