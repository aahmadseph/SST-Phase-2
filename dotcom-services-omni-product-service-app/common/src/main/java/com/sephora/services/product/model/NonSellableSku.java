package com.sephora.services.product.model;

public interface NonSellableSku extends Sku {

    Double getRewardCurrencyAmount();

    Double getRewardPoints();

    Sku getFullSizeSku();

    String getFullSizeProductId();

    Boolean isRewardActive();

    Product getOriginalSampleProduct();

    String getOriginalSampleProductId();

    RewardSubTypeEnum getRewardSubType();

    RewardTypeEnum rewardType();

    Boolean isNonsellable();

    String getNonSellableType();

}
