package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.*;
import lombok.RequiredArgsConstructor;

import java.io.Serial;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor(staticName = "of")
public class SkuDtoWithIdOnly implements Sku {

    @Serial
    private static final long serialVersionUID = 503854778685090225L;

    public final String skuId;

    @Override
    public String getName() {
        return null;
    }

    @Override
    public SkuState getState() {
        return null;
    }

    @Override
    public String getSize() {
        return null;
    }

    @Override
    public String getColor() {
        return null;
    }

    @Override
    public String getScent() {
        return null;
    }

    @Override
    public String getFormulation() {
        return null;
    }

    @Override
    public String getConcentration() {
        return null;
    }

    @Override
    public SkuTypeEnum getType() {
        return null;
    }

    @Override
    public OutOfStockTreatmentEnum getOosTreatment() {
        return null;
    }

    @Override
    public String getVariationDesc() {
        return null;
    }

    @Override
    public String getSephoraType() {
        return null;
    }

    @Override
    public String getBiType() {
        return null;
    }

    @Override
    public BiExclusiveLevelEnum getBiExclusiveLevel() {
        return null;
    }

    @Override
    public String getIngredientDesc() {
        return null;
    }

    @Override
    public String getFulfiller() {
        return null;
    }

    @Override
    public String getPrimaryProductId() {
        return null;
    }

    @Override
    public Set<String> getParentProductIds() {
        return null;
    }

    @Override
    public String getUpc() {
        return null;
    }

    @Override
    public String getSeoFriendlyUrl() {
        return null;
    }

    @Override
    public Set<StandardCountryEnum> getLimitedTimeOfferRestrictedCountries() {
        return null;
    }

    @Override
    public Set<StandardCountryEnum> getFirstAccessRestrictedCountries() {
        return null;
    }

    @Override
    public Set<StandardCountryEnum> getAppExclusiveRestrictedCountries() {
        return null;
    }

    @Override
    public Set<StandardCountryEnum> getRestrictedCountryList() {
        return null;
    }

    @Override
    public Set<String> getRestrictedStates() {
        return null;
    }

    @Override
    public Set<String> getRestrictedProvinces() {
        return null;
    }

    @Override
    public String getFormulationRefinement() {
        return null;
    }

    @Override
    public String getFinishRefinement() {
        return null;
    }

    @Override
    public String getSizeRefinement() {
        return null;
    }

    @Override
    public String getColorFamily() {
        return null;
    }

    @Override
    public Long getMaxPurchaseQuantity() {
        return null;
    }

    @Override
    public Long getTempMaxPurchaseQuantity() {
        return null;
    }

    @Override
    public ZonedDateTime getTempMaxPurchaseQuantityStartDate() {
        return null;
    }

    @Override
    public ZonedDateTime getTempMaxPurchaseQuantityEndDate() {
        return null;
    }

    @Override
    public Double getTaxCode() {
        return null;
    }

    @Override
    public Boolean isActive() {
        return null;
    }

    @Override
    public Boolean isStoreOnly() {
        return null;
    }

    @Override
    public Boolean isOnHold() {
        return null;
    }

    @Override
    public Boolean isComingSoon() {
        return null;
    }

    @Override
    public ZonedDateTime getComingSoonSkuEndDate() {
        return null;
    }

    @Override
    public boolean isHazmat() {
        return false;
    }

    @Override
    public Boolean isHawaiiHazmatFlag() {
        return null;
    }

    @Override
    public Boolean isBiOnly() {
        return null;
    }

    @Override
    public ZonedDateTime getBiOnlyStartDate() {
        return null;
    }

    @Override
    public ZonedDateTime getBiOnlyEndDate() {
        return null;
    }

    @Override
    public Boolean isOnlineOnly() {
        return null;
    }

    @Override
    public ZonedDateTime getOnlineOnlyEndDate() {
        return null;
    }

    @Override
    public Boolean isExternallySellable() {
        return null;
    }

    @Override
    public Boolean isGiftWrappable() {
        return null;
    }

    @Override
    public Boolean isLimitedEdition() {
        return null;
    }

    @Override
    public Boolean isNew() {
        return null;
    }

    @Override
    public ZonedDateTime getNewUntilDate() {
        return null;
    }

    @Override
    public Boolean isSephoraExclusive() {
        return null;
    }

    @Override
    public Boolean isFirstAccessFlag() {
        return null;
    }

    @Override
    public Boolean isAppExclusiveFlag() {
        return null;
    }

    @Override
    public Boolean isTrialEligible() {
        return null;
    }

    @Override
    public String getTrialPeriod() {
        return null;
    }

    @Override
    public Boolean isConfigurable() {
        return null;
    }

    @Override
    public Boolean isReturnable() {
        return null;
    }

    @Override
    public Boolean isLimitedTimeOfferFlag() {
        return null;
    }

    @Override
    public Boolean isProp65() {
        return null;
    }

    @Override
    public Boolean isNotSentToWarehouse() {
        return null;
    }

    @Override
    public String getLabCode() {
        return null;
    }

    @Override
    public List<Badge> getBadges() {
        return null;
    }

    @Override
    public String getFullSizeSkuId() {
        return null;
    }

    @Override
    public ZonedDateTime getStartDate() {
        return null;
    }

    @Override
    public ZonedDateTime getEndDate() {
        return null;
    }

    @Override
    public ZonedDateTime getTempDeactivationDate() {
        return null;
    }

    @Override
    public ZonedDateTime getLimitedTimeOfferStartDate() {
        return null;
    }

    @Override
    public ZonedDateTime getLimitedTimeOfferEndDate() {
        return null;
    }

    @Override
    public ZonedDateTime getFirstAccessStartDate() {
        return null;
    }

    @Override
    public ZonedDateTime getFirstAccessEndDate() {
        return null;
    }

    @Override
    public ZonedDateTime getAppExclusiveStartDate() {
        return null;
    }

    @Override
    public ZonedDateTime getAppExclusiveEndDate() {
        return null;
    }

    @Override
    public List<Image> getPrimaryImages() {
        return null;
    }

    @Override
    public List<Image> getAlternativeImages() {
        return null;
    }

    @Override
    public ZonedDateTime getSephoraExclusiveUntilDate() {
        return null;
    }

    @Override
    public List<Highlight> getHighlights() {
        return null;
    }

    @Override
    public Boolean isPayPalPayLaterEligible() {
        return null;
    }

    @Override
    public String getTemporaryDeactivationReason() {
        return null;
    }

    @Override
    public Boolean isPaypalRestricted() {
        return null;
    }

    @Override
    public Boolean isCalculateTax() {
        return null;
    }

    @Override
    public Boolean isHideFromSale() {
        return null;
    }

    @Override
    public Boolean isExcludeFromSearch() {
        return null;
    }

    @Override
    public Boolean isReservationsEnabled() {
        return null;
    }

    @Override
    public SkuFraudRiskLevelEnum getFraudRiskLevel() {
        return null;
    }

    @Override
    public Set<SkuSkinTypeEnum> getBestForSkinTypes() {
        return null;
    }

    @Override
    public String getPrimaryConcern() {
        return null;
    }

    @Override
    public String getClassNumber() {
        return null;
    }

    @Override
    public String getDepartmentNumber() {
        return null;
    }

    @Override
    public Boolean isDiscountable() {
        return null;
    }

    @Override
    public String getCountryOfManufacture() {
        return null;
    }

    @Override
    public String getSubclassNumber() {
        return null;
    }

    @Override
    public String getEfficacyIngredient() {
        return null;
    }

    @Override
    public SkuEfficacyEnum getEfficacy() {
        return null;
    }

    @Override
    public String getShopNumber() {
        return null;
    }

    @Override
    public String getBiDescription() {
        return null;
    }

    @Override
    public SkuProductLineEnum getProductLine() {
        return null;
    }

    @Override
    public Boolean isDisplaySkuAsProductInSearchResult() {
        return null;
    }

    @Override
    public Boolean isCallCenterOnly() {
        return null;
    }

    @Override
    public StandardLocaleEnum getLocale() {
        return null;
    }

    @Override
    public String getSkuId() {
        return skuId;
    }
}
