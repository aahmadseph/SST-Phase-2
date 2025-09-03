package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.ReplenishmentPlan;
import com.sephora.services.product.model.StandardCountryEnum;
import com.sephora.services.product.service.commercetools.utils.CustomObjectUtils;

import java.io.Serial;
import java.util.Map;
import java.util.Set;

public class ReplenishmentPlanDto extends ValueMapDto implements ReplenishmentPlan {

    @Serial
    private static final long serialVersionUID = 7441185982836896675L;

    private static final String REPLENISHMENT_ENABLED = "enabled";
    private static final String REPLENISHMENT_PLAN_TIER = "planTier";
    private static final String REPLENISHMENT_PROMOTION_ID = "promotionId";
    private static final String REPLENISHMENT_PROMOTION_ORDER_COUNT = "promotionOrderCount";
    private static final String REPLENISHMENT_PROMO_DURATION = "promoDuration";
    private static final String REPLENISHMENT_PROMO_EXCLUDED_COUNTRIES = "promoExcludedCountries";

    private final String replenishmentPlanId;

    public ReplenishmentPlanDto(Map<String, Object> valueMap, String replenishmentPlanId) {
        super(valueMap);
        this.replenishmentPlanId = replenishmentPlanId;
    }

    @Override
    public String getReplenishmentPlanId() {
        return replenishmentPlanId;
    }

    @Override
    public Boolean isEnabled() {
        return getValue(REPLENISHMENT_ENABLED);
    }

    @Override
    public String getPlanTier() {
        return getValue(REPLENISHMENT_PLAN_TIER);
    }

    @Override
    public String getPromotionId() {
        return getValue(REPLENISHMENT_PROMOTION_ID);
    }

    @Override
    public Long getPromotionOrderCount() {
        return getValue(REPLENISHMENT_PROMOTION_ORDER_COUNT);
    }

    @Override
    public Long promoDuration() {
        return getValue(REPLENISHMENT_PROMO_DURATION);
    }

    @Override
    public Set<StandardCountryEnum> getPromoExcludedCountries() {
        return CustomObjectUtils.fromCollection(getValue(REPLENISHMENT_PROMO_EXCLUDED_COUNTRIES));
    }

}
