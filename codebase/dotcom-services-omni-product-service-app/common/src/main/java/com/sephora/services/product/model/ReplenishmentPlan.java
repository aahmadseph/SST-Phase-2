package com.sephora.services.product.model;

import java.io.Serializable;
import java.util.Set;

public interface ReplenishmentPlan extends Serializable {

    String getReplenishmentPlanId();

    Boolean isEnabled();

    String getPlanTier();

    String getPromotionId();

    Long getPromotionOrderCount();

    Long promoDuration();

    Set<StandardCountryEnum> getPromoExcludedCountries();
}
