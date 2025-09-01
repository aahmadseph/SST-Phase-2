package com.sephora.services.product.model;

import java.util.Set;

public interface MerchSku extends Sku {

    ReplenishmentPlan getAcceleratedReplenishmentPlan();

    SubscriptionFreqTypeEnum getSubscriptionFreqType();

    ReplenishmentPlan getReplenishmentPlan();

    ConfigurableProperty getConfigurableProperty();

    SampleTypeEnum getSampleType();

    Set<StandardCountryEnum> getSubscriptionCountryList();

    Boolean isReplenishmentEnabled();

    Long getSubscriptionFreqNum();

    Long getSequence();

    Double getValuePrice();
}
