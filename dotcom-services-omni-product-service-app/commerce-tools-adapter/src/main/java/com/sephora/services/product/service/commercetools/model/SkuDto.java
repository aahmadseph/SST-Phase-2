package com.sephora.services.product.service.commercetools.model;

import com.commercetools.api.models.common.LocalizedString;
import com.commercetools.api.models.product.AttributeAccessor;
import com.commercetools.api.models.product.AttributesAccessor;
import com.commercetools.api.models.product.ProductProjection;
import com.commercetools.api.models.product.ProductVariant;
import com.sephora.services.product.model.*;
import com.sephora.services.product.service.commercetools.utils.AttributeUtils;
import com.sephora.services.product.service.commercetools.utils.ProductUtils;
import com.sephora.services.product.service.commercetools.utils.SkuUtils;
import lombok.Setter;
import org.springframework.util.CollectionUtils;

import java.io.Serial;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getFromLocalizedString;
import static java.util.Objects.nonNull;

/*
 * Adapter class for adapt CT model to common model.
 */
public class SkuDto implements Sku {

    @Serial
    private static final long serialVersionUID = 6047414343203042860L;

    protected final Locale locale;
    protected AttributesAccessor attributesAccessor = AttributeUtils.EMPTY_ATTRIBUTE_ACCESSOR;
    protected final LocalizedString localizedName;

    @Setter
    private Set<String> parentProductIds;

    public SkuDto(String productId, LocalizedString localizedName, ProductVariant productVariant, Locale locale) {
        addParentProductId(productId);
        this.localizedName = localizedName;
        this.locale = locale;
        if (productVariant != null) {
            this.attributesAccessor = new AttributesAccessor(AttributeAccessor.asMap(productVariant));
        }
    }

    public SkuDto(ProductProjection productProjection, ProductVariant productVariant, Locale locale) {
        this(ProductUtils.getProductId(productProjection.getKey()), productProjection.getName(), productVariant, locale);
    }

    @Override
    public String getSkuId() {
        return SkuUtils.getSkuId(attributesAccessor);
    }

    @Override
    public String getName() {
        return getFromLocalizedString(localizedName, locale);
    }

    @Override
    public SkuState getState() {
        return SkuUtils.getSkuState(attributesAccessor);
    }

    @Override
    public String getSize() {
        return SkuUtils.getSize(attributesAccessor, locale);
    }

    @Override
    public String getColor() {
        return SkuUtils.getColor(attributesAccessor, locale);
    }

    @Override
    public String getScent() {
        return SkuUtils.getScent(attributesAccessor, locale);
    }

    @Override
    public String getFormulation() {
        return SkuUtils.getFormulation(attributesAccessor, locale);
    }

    @Override
    public String getConcentration() {
        return SkuUtils.getConcentration(attributesAccessor, locale);
    }

    @Override
    public SkuTypeEnum getType() {
        return SkuUtils.getType(attributesAccessor);
    }

    @Override
    public OutOfStockTreatmentEnum getOosTreatment() {
        return SkuUtils.getOosTreatment(attributesAccessor);
    }

    @Override
    public String getVariationDesc() {
        return SkuUtils.getVariationDesc(attributesAccessor, locale);
    }

    @Override
    public String getSephoraType() {
        return SkuUtils.getSephoraType(attributesAccessor, locale);
    }

    @Override
    public String getBiType() {
        return SkuUtils.getBiType(attributesAccessor);
    }

    @Override
    public BiExclusiveLevelEnum getBiExclusiveLevel() {
        return SkuUtils.getBiExclusiveLevel(attributesAccessor);
    }

    @Override
    public String getIngredientDesc() {
        return SkuUtils.getIngredientDesc(attributesAccessor);
    }

    @Override
    public String getFulfiller() {
        return SkuUtils.getFulfiller(attributesAccessor);
    }

    @Override
    public String getPrimaryProductId() {
        return SkuUtils.getPrimaryProductId(attributesAccessor);
    }

    @Override
    public Set<String> getParentProductIds() {
        return parentProductIds;
    }

    protected boolean isNonSellable() {
        return false; // This method can be overridden if needed
    }

    @Override
    public String getUpc() {
        return SkuUtils.getUpc(attributesAccessor);
    }

    @Override
    public String getSeoFriendlyUrl() {
        return SkuUtils.getSeoFriendlyUrl(attributesAccessor);
    }

    @Override
    public Set<StandardCountryEnum> getLimitedTimeOfferRestrictedCountries() {
        return SkuUtils.getLimitedTimeOfferRestrictedCountries(attributesAccessor);
    }

    @Override
    public Set<StandardCountryEnum> getFirstAccessRestrictedCountries() {
        return SkuUtils.getFirstAccessRestrictedCountries(attributesAccessor);
    }

    @Override
    public Set<StandardCountryEnum> getAppExclusiveRestrictedCountries() {
        return SkuUtils.getAppExclusiveRestrictedCountries(attributesAccessor);
    }

    @Override
    public Set<StandardCountryEnum> getRestrictedCountryList() {
        return SkuUtils.getRestrictedCountrySet(attributesAccessor);
    }

    @Override
    public Set<String> getRestrictedStates() {
        return SkuUtils.getRestrictedStates(attributesAccessor);
    }

    @Override
    public Set<String> getRestrictedProvinces() {
        return SkuUtils.getRestrictedProvinces(attributesAccessor);
    }

    @Override
    public String getFormulationRefinement() {
        return SkuUtils.getFormulationRefinement(attributesAccessor, locale);
    }

    @Override
    public String getFinishRefinement() {
        return SkuUtils.getFinishRefinement(attributesAccessor, locale);
    }

    @Override
    public String getSizeRefinement() {
        return SkuUtils.getSizeRefinement(attributesAccessor, locale);
    }

    @Override
    public String getColorFamily() {
        return SkuUtils.getColorFamily(attributesAccessor, locale);
    }

    @Override
    public Long getMaxPurchaseQuantity() {
        return SkuUtils.getMaxPurchaseQuantity(attributesAccessor);
    }

    @Override
    public Long getTempMaxPurchaseQuantity() {
        return SkuUtils.getTempMaxPurchaseQuantity(attributesAccessor);
    }

    @Override
    public ZonedDateTime getTempMaxPurchaseQuantityStartDate() {
        return SkuUtils.getTempMaxPurchaseQuantityStartDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getTempMaxPurchaseQuantityEndDate() {
        return SkuUtils.getTempMaxPurchaseQuantityEndDate(attributesAccessor);
    }

    @Override
    public Double getTaxCode() {
        return SkuUtils.getTaxCode(attributesAccessor);
    }

    @Override
    public Boolean isActive() {
        return SkuUtils.isActive(attributesAccessor);
    }

    @Override
    public Boolean isStoreOnly() {
        return SkuUtils.isStoreOnly(attributesAccessor);
    }

    @Override
    public Boolean isOnHold() {
        return SkuUtils.isOnHold(attributesAccessor, locale);
    }

    @Override
    public Boolean isComingSoon() {
        return SkuUtils.isComingSoon(attributesAccessor);
    }

    @Override
    public ZonedDateTime getComingSoonSkuEndDate() {
        return SkuUtils.getComingSoonSkuEndDate(attributesAccessor);
    }

    @Override
    public boolean isHazmat() {
        return SkuUtils.isHazmat(attributesAccessor);
    }

    @Override
    public Boolean isHawaiiHazmatFlag() {
        return SkuUtils.isHawaiiHazmatFlag(attributesAccessor);
    }

    @Override
    public Boolean isBiOnly() {
        return SkuUtils.isBiOnly(attributesAccessor);
    }

    @Override
    public ZonedDateTime getBiOnlyStartDate() {
        return SkuUtils.getBiOnlyStartDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getBiOnlyEndDate() {
        return SkuUtils.getBiOnlyEndDate(attributesAccessor);
    }

    @Override
    public Boolean isOnlineOnly() {
        return SkuUtils.isOnlineOnly(attributesAccessor);
    }

    @Override
    public ZonedDateTime getOnlineOnlyEndDate() {
        return SkuUtils.getOnlineOnlyEndDate(attributesAccessor);
    }

    @Override
    public Boolean isExternallySellable() {
        return SkuUtils.isExternallySellable(attributesAccessor);
    }

    @Override
    public Boolean isGiftWrappable() {
        return SkuUtils.isGiftWrappable(attributesAccessor);
    }

    @Override
    public Boolean isLimitedEdition() {
        return SkuUtils.isLimitedEdition(attributesAccessor);
    }

    @Override
    public Boolean isNew() {
        return SkuUtils.isNew(attributesAccessor);
    }

    @Override
    public ZonedDateTime getNewUntilDate() {
        return SkuUtils.getNewUntilDate(attributesAccessor);
    }

    @Override
    public Boolean isSephoraExclusive() {
        return SkuUtils.isSephoraExclusive(attributesAccessor);
    }

    @Override
    public Boolean isFirstAccessFlag() {
        return SkuUtils.isFirstAccessFlag(attributesAccessor);
    }

    @Override
    public Boolean isAppExclusiveFlag() {
        return SkuUtils.isAppExclusiveFlag(attributesAccessor);
    }

    @Override
    public Boolean isTrialEligible() {
        return SkuUtils.isTrialEligible(attributesAccessor);
    }

    @Override
    public String getTrialPeriod() {
        return SkuUtils.getTrialPeriod(attributesAccessor);
    }

    @Override
    public Boolean isConfigurable() {
        return SkuUtils.isConfigurable(attributesAccessor);
    }

    @Override
    public Boolean isReturnable() {
        return SkuUtils.isReturnable(attributesAccessor);
    }

    @Override
    public Boolean isLimitedTimeOfferFlag() {
        return SkuUtils.isLimitedTimeOfferFlag(attributesAccessor);
    }

    @Override
    public Boolean isProp65() {
        return SkuUtils.isProp65(attributesAccessor);
    }

    @Override
    public Boolean isNotSentToWarehouse() {
        return SkuUtils.isNotSentToWarehouse(attributesAccessor);
    }

    @Override
    public String getLabCode() {
        return SkuUtils.getLabCode(attributesAccessor);
    }

    @Override
    public List<Badge> getBadges() {
        return SkuUtils.getBadges(attributesAccessor, locale);
    }

    @Override
    public String getFullSizeSkuId() {
        return SkuUtils.getFullSizeSkuId(attributesAccessor);
    }

    @Override
    public ZonedDateTime getStartDate() {
        return SkuUtils.getStartDate(attributesAccessor, locale);
    }

    @Override
    public ZonedDateTime getEndDate() {
        return SkuUtils.getEndDate(attributesAccessor, locale);
    }

    @Override
    public ZonedDateTime getTempDeactivationDate() {
        return SkuUtils.getTempDeactivationDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getLimitedTimeOfferStartDate() {
        return SkuUtils.getLimitedTimeOfferStartDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getLimitedTimeOfferEndDate() {
        return SkuUtils.getLimitedTimeOfferEndDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getFirstAccessStartDate() {
        return SkuUtils.getFirstAccessStartDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getFirstAccessEndDate() {
        return SkuUtils.getFirstAccessEndDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getAppExclusiveStartDate() {
        return SkuUtils.getAppExclusiveStartDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getAppExclusiveEndDate() {
        return SkuUtils.getAppExclusiveEndDate(attributesAccessor);
    }

    @Override
    public List<Image> getPrimaryImages() {
        return SkuUtils.getPrimaryImages(attributesAccessor);
    }

    @Override
    public List<Image> getAlternativeImages() {
        return SkuUtils.getAlternativeImages(attributesAccessor);
    }

    @Override
    public ZonedDateTime getSephoraExclusiveUntilDate() {
        return SkuUtils.getSephoraExclusiveUntilDate(attributesAccessor);
    }

    @Override
    public List<Highlight> getHighlights() {
        return SkuUtils.getHighlights(attributesAccessor, locale);
    }

    @Override
    public Boolean isPayPalPayLaterEligible() {
        return SkuUtils.isPayPalPayLaterEligible(attributesAccessor);
    }

    @Override
    public String getTemporaryDeactivationReason() {
        return SkuUtils.getTemporaryDeactivationReason(attributesAccessor);
    }

    @Override
    public Boolean isPaypalRestricted() {
        return SkuUtils.isPaypalRestricted(attributesAccessor);
    }

    @Override
    public Boolean isCalculateTax() {
        return SkuUtils.isCalculateTax(attributesAccessor);
    }

    @Override
    public Boolean isHideFromSale() {
        return SkuUtils.isHideFromSale(attributesAccessor);
    }

    @Override
    public Boolean isExcludeFromSearch() {
        return SkuUtils.isExcludeFromSearch(attributesAccessor);
    }

    @Override
    public Boolean isReservationsEnabled() {
        return SkuUtils.isReservationsEnabled(attributesAccessor);
    }

    @Override
    public SkuFraudRiskLevelEnum getFraudRiskLevel() {
        return SkuUtils.getFraudRiskLevel(attributesAccessor);
    }

    @Override
    public Set<SkuSkinTypeEnum> getBestForSkinTypes() {
        return SkuUtils.getBestForSkinTypes(attributesAccessor);
    }

    @Override
    public String getPrimaryConcern() {
        return SkuUtils.getPrimaryConcern(attributesAccessor);
    }

    @Override
    public String getClassNumber() {
        return SkuUtils.getClassNumber(attributesAccessor);
    }

    @Override
    public String getDepartmentNumber() {
        return SkuUtils.getDepartmentNumber(attributesAccessor);
    }

    @Override
    public Boolean isDiscountable() {
        return SkuUtils.isDiscountable(attributesAccessor);
    }

    @Override
    public String getCountryOfManufacture() {
        return SkuUtils.getCountryOfManufacture(attributesAccessor);
    }

    @Override
    public String getSubclassNumber() {
        return SkuUtils.getSubclassNumber(attributesAccessor);
    }

    @Override
    public String getEfficacyIngredient() {
        return SkuUtils.getEfficacyIngredient(attributesAccessor);
    }

    @Override
    public SkuEfficacyEnum getEfficacy() {
        return SkuUtils.getEfficacy(attributesAccessor);
    }

    @Override
    public String getShopNumber() {
        return SkuUtils.getShopNumber(attributesAccessor);
    }

    @Override
    public String getBiDescription() {
        return SkuUtils.getBiDescription(attributesAccessor, locale);
    }

    @Override
    public SkuProductLineEnum getProductLine() {
        return SkuUtils.getProductLine(attributesAccessor);
    }

    @Override
    public Boolean isDisplaySkuAsProductInSearchResult() {
        return SkuUtils.isDisplaySkuAsProductInSearchResult(attributesAccessor);
    }

    @Override
    public Boolean isCallCenterOnly() {
        return SkuUtils.isCallCenterOnly(attributesAccessor);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof SkuDto other)) {
            return false;
        }

        if (Objects.equals(getSkuId(), other.getSkuId())) {
            return true;
        }

        if (getSkuId() == null) return false;

        // equivalence by id
        return Objects.equals(getSkuId(), other.getSkuId());
    }

    @Override
    public int hashCode() {
        if (nonNull(getSkuId())) {
            return getSkuId().hashCode();
        }
        return super.hashCode();
    }

    @Override
    public StandardLocaleEnum getLocale() {
        return StandardLocaleEnum.fromLocale(locale);
    }

    public void addParentProductId(String parentProductId) {
        if (CollectionUtils.isEmpty(parentProductIds)) {
            this.parentProductIds = new HashSet<>();
        }
        this.parentProductIds.add(parentProductId);
    }
}
