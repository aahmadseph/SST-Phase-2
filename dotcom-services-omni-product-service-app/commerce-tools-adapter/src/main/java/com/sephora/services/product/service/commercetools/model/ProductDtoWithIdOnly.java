package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.*;
import lombok.RequiredArgsConstructor;

import java.io.Serial;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor(staticName = "of")
public class ProductDtoWithIdOnly implements Product {

    @Serial
    private static final long serialVersionUID = -6898136325598128031L;

    private final String productId;

    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getSeoName() {
        return null;
    }

    @Override
    public String getSeoFriendlyUrl() {
        return null;
    }

    @Override
    public ProductVariationType getVariationType() {
        return null;
    }

    @Override
    public ProductSwatchTypeEnum getSwatchType() {
        return null;
    }

    @Override
    public String getPrimaryCategoryId() {
        return null;
    }

    @Override
    public Set<String> getCategoryIds() {
        return null;
    }

    @Override
    public String getBrandId() {
        return null;
    }

    @Override
    public ProductTypeEnum getType() {
        return null;
    }

    @Override
    public String getSephoraProductType() {
        return null;
    }

    @Override
    public String getUseItWithTitle() {
        return null;
    }

    @Override
    public SkuSelectorTypeEnum getSkuSelectorType() {
        return null;
    }

    @Override
    public String getShortDescription() {
        return null;
    }

    @Override
    public String getLongDescription() {
        return null;
    }

    @Override
    public String getSuggestedUsage() {
        return null;
    }

    @Override
    public String getQuickLookDescription() {
        return null;
    }

    @Override
    public boolean isActive() {
        return false;
    }

    @Override
    public Boolean isPayPalRestricted() {
        return null;
    }

    @Override
    public ZonedDateTime getActivationDate() {
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
    public Set<String> getRestrictedStates() {
        return null;
    }

    @Override
    public Set<String> getRestrictedProvinces() {
        return null;
    }

    @Override
    public List<String> getAncillarySkuKeys() {
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
    public List<Video> getVideos() {
        return null;
    }

    @Override
    public Set<StandardCountryEnum> getEffectivelyAvailableCountries() {
        return null;
    }

    @Override
    public String getSeoMetaDescription() {
        return null;
    }

    @Override
    public String getSeoUrlPrefix() {
        return null;
    }

    @Override
    public String getSeoCanonicalTag() {
        return null;
    }

    @Override
    public String getSeoPageTitle() {
        return null;
    }

    @Override
    public String getSeoPriority() {
        return null;
    }

    @Override
    public String getFinalTitle() {
        return null;
    }

    @Override
    public String getFinalMetaDescription() {
        return null;
    }

    @Override
    public String getProductImage() {
        return null;
    }

    @Override
    public String getKeywords() {
        return null;
    }

    @Override
    public Boolean isReturnable() {
        return null;
    }

    @Override
    public List<String> getZone1() {
        return null;
    }

    @Override
    public List<String> getZone2() {
        return null;
    }

    @Override
    public List<String> getZone3() {
        return null;
    }

    @Override
    public Boolean isExcludeFromSitemap() {
        return null;
    }

    @Override
    public String getTemporaryDeactivationReason() {
        return null;
    }

    @Override
    public Boolean isEnableNoindexMetaTag() {
        return null;
    }

    @Override
    public Boolean isHasProductSamples() {
        return null;
    }

    @Override
    public Set<Sku> getSkus() {
        return null;
    }

    @Override
    public StandardLocaleEnum getLocale() {
        return null;
    }

    @Override
    public boolean isNonSellable() {
        return false;
    }

    @Override
    public String getProductId() {
        return productId;
    }
}
