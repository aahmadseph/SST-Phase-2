package com.sephora.services.product.service.commercetools.utils;

import com.commercetools.api.models.product.AttributesAccessor;
import com.sephora.services.product.model.ConfigurableProperty;
import com.sephora.services.product.model.ReplenishmentPlan;
import com.sephora.services.product.model.SampleTypeEnum;
import com.sephora.services.product.model.StandardCountryEnum;
import com.sephora.services.product.model.SubscriptionFreqTypeEnum;
import lombok.experimental.UtilityClass;
import org.jetbrains.annotations.NotNull;

import java.util.Locale;
import java.util.Set;

import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.DEFAULT_LOCALE;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getAttributeValueFromEnum;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getCountrySetFromEnumSet;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getDoubleAttributeValue;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getLongAttributeValue;
import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.*;

@UtilityClass
public class MerchSkuUtils {
    public static ReplenishmentPlan getAcceleratedReplenishmentPlan(@NotNull AttributesAccessor attributesAccessor) {
        return CustomObjectUtils.convertToReplenishmentPlan(attributesAccessor.asReference(SKU_ACCELERATED_REPLENISHMENT_PLAN));
    }

    public static Set<StandardCountryEnum> getSubscriptionCountryList(@NotNull AttributesAccessor attributesAccessor) {
        return getCountrySetFromEnumSet(attributesAccessor.asSetEnum(SKU_REPLENISHMENT_ENABLED_COUNTRIES));
    }

    public static Boolean isReplenishmentEnabled(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_REPLENISHMENT_ENABLED);
    }

    public static Long getSubscriptionFreqNum(@NotNull AttributesAccessor attributesAccessor) {
        return getLongAttributeValue(attributesAccessor.get(SKU_REPLENISHMENT_FREQUENCY_NUMBER));
    }

    public static SubscriptionFreqTypeEnum getSubscriptionFreqType(@NotNull AttributesAccessor attributesAccessor) {
        return SubscriptionFreqTypeEnum.fromString(attributesAccessor.asString(SKU_REPLENISHMENT_FREQUENCY_TYPE));
    }

    public static ReplenishmentPlan getReplenishmentPlan(@NotNull AttributesAccessor attributesAccessor) {
        return CustomObjectUtils.convertToReplenishmentPlan(attributesAccessor.asReference(SKU_REPLENISHMENT_PLAN));
    }

    public static Long getSequence(@NotNull AttributesAccessor attributesAccessor) {
        return getLongAttributeValue(attributesAccessor.get(SKU_SEQUENCE));
    }

    public static Double getValuePrice(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return locale == null || DEFAULT_LOCALE.equals(locale)
                ? getDoubleAttributeValue(attributesAccessor.get(SKU_VALUE_PRICE_US))
                : getDoubleAttributeValue(attributesAccessor.get(SKU_VALUE_PRICE_CA));
    }

    public static ConfigurableProperty getConfigurableProperties(@NotNull AttributesAccessor attributesAccessor) {
        return CustomObjectUtils.convertToConfigurableProperty(attributesAccessor.asReference(SKU_CONFIGURABLE_PROPERTIES));
    }

    public static SampleTypeEnum getSampleType(@NotNull AttributesAccessor attributesAccessor) {
        return SampleTypeEnum.fromString(getAttributeValueFromEnum(attributesAccessor.asEnum(SKU_SAMPLE_TYPE)));
    }
}
