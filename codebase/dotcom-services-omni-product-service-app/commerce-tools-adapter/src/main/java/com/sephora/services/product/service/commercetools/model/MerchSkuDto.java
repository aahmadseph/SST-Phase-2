package com.sephora.services.product.service.commercetools.model;

import com.commercetools.api.models.product.ProductProjection;
import com.commercetools.api.models.product.ProductVariant;
import com.sephora.services.product.model.ConfigurableProperty;
import com.sephora.services.product.model.MerchSku;
import com.sephora.services.product.model.ReplenishmentPlan;
import com.sephora.services.product.model.SampleTypeEnum;
import com.sephora.services.product.model.StandardCountryEnum;
import com.sephora.services.product.model.SubscriptionFreqTypeEnum;
import com.sephora.services.product.service.commercetools.utils.MerchSkuUtils;

import java.io.Serial;
import java.util.Locale;
import java.util.Set;

public class MerchSkuDto extends SkuDto implements MerchSku {

    @Serial
    private static final long serialVersionUID = -5346348987440154033L;

    public MerchSkuDto(ProductProjection productProjection, ProductVariant productVariant, Locale locale) {
        super(productProjection, productVariant, locale);
    }

    @Override
    public ReplenishmentPlan getAcceleratedReplenishmentPlan() {
        return MerchSkuUtils.getAcceleratedReplenishmentPlan(attributesAccessor);
    }

    @Override
    public SubscriptionFreqTypeEnum getSubscriptionFreqType() {
        return MerchSkuUtils.getSubscriptionFreqType(attributesAccessor);
    }

    @Override
    public ReplenishmentPlan getReplenishmentPlan() {
        return MerchSkuUtils.getReplenishmentPlan(attributesAccessor);
    }

    @Override
    public ConfigurableProperty getConfigurableProperty() {
        return MerchSkuUtils.getConfigurableProperties(attributesAccessor);
    }

    @Override
    public SampleTypeEnum getSampleType() {
        return MerchSkuUtils.getSampleType(attributesAccessor);
    }

    @Override
    public Set<StandardCountryEnum> getSubscriptionCountryList() {
        return MerchSkuUtils.getSubscriptionCountryList(attributesAccessor);
    }

    @Override
    public Boolean isReplenishmentEnabled() {
        return MerchSkuUtils.isReplenishmentEnabled(attributesAccessor);
    }

    @Override
    public Long getSubscriptionFreqNum() {
        return MerchSkuUtils.getSubscriptionFreqNum(attributesAccessor);
    }

    @Override
    public Long getSequence() {
        return MerchSkuUtils.getSequence(attributesAccessor);
    }

    @Override
    public Double getValuePrice() {
        return MerchSkuUtils.getValuePrice(attributesAccessor, locale);
    }
}
