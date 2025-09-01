package com.sephora.services.product.model;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

public interface Sku extends Serializable {

    String getSkuId();

    String getName();

    SkuState getState();

    String getSize();

    String getColor();

    String getScent();

    String getFormulation();

    String getConcentration();

    SkuTypeEnum getType();

    OutOfStockTreatmentEnum getOosTreatment();

    String getVariationDesc();

    String getSephoraType();

    String getBiType();

    BiExclusiveLevelEnum getBiExclusiveLevel();

    String getIngredientDesc();

    String getFulfiller();

    String getPrimaryProductId();

    Set<String> getParentProductIds();

    String getUpc();

    String getSeoFriendlyUrl();

    Set<StandardCountryEnum> getLimitedTimeOfferRestrictedCountries();

    Set<StandardCountryEnum> getFirstAccessRestrictedCountries();

    Set<StandardCountryEnum> getAppExclusiveRestrictedCountries();

    Set<StandardCountryEnum> getRestrictedCountryList();

    Set<String> getRestrictedStates();

    Set<String> getRestrictedProvinces();

    String getFormulationRefinement();

    String getFinishRefinement();

    String getSizeRefinement();

    String getColorFamily();

    Long getMaxPurchaseQuantity();

    Long getTempMaxPurchaseQuantity();

    ZonedDateTime getTempMaxPurchaseQuantityStartDate();

    ZonedDateTime getTempMaxPurchaseQuantityEndDate();

    Double getTaxCode();

    Boolean isActive();

    Boolean isStoreOnly();

    Boolean isOnHold();

    Boolean isComingSoon();

    ZonedDateTime getComingSoonSkuEndDate();

    boolean isHazmat();

    Boolean isHawaiiHazmatFlag();

    Boolean isBiOnly();

    ZonedDateTime getBiOnlyStartDate();

    ZonedDateTime getBiOnlyEndDate();

    Boolean isOnlineOnly();

    ZonedDateTime getOnlineOnlyEndDate();

    Boolean isExternallySellable();

    Boolean isGiftWrappable();

    Boolean isLimitedEdition();

    Boolean isNew();

    ZonedDateTime getNewUntilDate();

    Boolean isSephoraExclusive();

    Boolean isFirstAccessFlag();

    Boolean isAppExclusiveFlag();

    Boolean isTrialEligible();

    String getTrialPeriod();

    Boolean isConfigurable();

    Boolean isReturnable();

    Boolean isLimitedTimeOfferFlag();

    Boolean isProp65();

    Boolean isNotSentToWarehouse();

    String getLabCode();

    List<Badge> getBadges();

    String getFullSizeSkuId();

    ZonedDateTime getStartDate();

    ZonedDateTime getEndDate();

    ZonedDateTime getTempDeactivationDate();

    ZonedDateTime getLimitedTimeOfferStartDate();

    ZonedDateTime getLimitedTimeOfferEndDate();

    ZonedDateTime getFirstAccessStartDate();

    ZonedDateTime getFirstAccessEndDate();

    ZonedDateTime getAppExclusiveStartDate();

    ZonedDateTime getAppExclusiveEndDate();

    List<Image> getPrimaryImages();

    List<Image> getAlternativeImages();

    ZonedDateTime getSephoraExclusiveUntilDate();

    List<Highlight> getHighlights();

    Boolean isPayPalPayLaterEligible();

    String getTemporaryDeactivationReason();

    Boolean isPaypalRestricted();

    Boolean isCalculateTax();

    Boolean isHideFromSale();

    Boolean isExcludeFromSearch();

    Boolean isReservationsEnabled();

    SkuFraudRiskLevelEnum getFraudRiskLevel();

    Set<SkuSkinTypeEnum> getBestForSkinTypes();

    String getPrimaryConcern();

    String getClassNumber();

    String getDepartmentNumber();

    Boolean isDiscountable();

    String getCountryOfManufacture();

    String getSubclassNumber();

    String getEfficacyIngredient();

    SkuEfficacyEnum getEfficacy();

    String getShopNumber();

    String getBiDescription();

    SkuProductLineEnum getProductLine();

    Boolean isDisplaySkuAsProductInSearchResult();

    Boolean isCallCenterOnly();

    StandardLocaleEnum getLocale();
}
