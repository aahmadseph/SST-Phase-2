package com.sephora.services.product.model;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

public interface Product extends Serializable {
    String getProductId();

    String getName();

    String getSeoName();

    String getSeoFriendlyUrl();

    ProductVariationType getVariationType();

    ProductSwatchTypeEnum getSwatchType();

    String getPrimaryCategoryId();

    Set<String> getCategoryIds();

    String getBrandId();

    ProductTypeEnum getType();

    String getSephoraProductType();

    String getUseItWithTitle();

    SkuSelectorTypeEnum getSkuSelectorType();

    String getShortDescription();

    String getLongDescription();

    String getSuggestedUsage();

    String getQuickLookDescription();

    boolean isActive();

    Boolean isPayPalRestricted();

    ZonedDateTime getActivationDate();

    ZonedDateTime getEndDate();

    ZonedDateTime getTempDeactivationDate();

    Set<String> getRestrictedStates();

    Set<String> getRestrictedProvinces();

    List<String> getAncillarySkuKeys();

    List<Image> getPrimaryImages();

    List<Image> getAlternativeImages();

    List<Video> getVideos();

    Set<StandardCountryEnum> getEffectivelyAvailableCountries();

    String getSeoMetaDescription();

    String getSeoUrlPrefix();

    String getSeoCanonicalTag();

    String getSeoPageTitle();

    String getSeoPriority();

    String getFinalTitle();

    String getFinalMetaDescription();

    String getProductImage();

    String getKeywords();

    Boolean isReturnable();

    List<String> getZone1();

    List<String> getZone2();

    List<String> getZone3();

    Boolean isExcludeFromSitemap();

    String getTemporaryDeactivationReason();

    Boolean isEnableNoindexMetaTag();

    Boolean isHasProductSamples();

    Set<Sku> getSkus();

    StandardLocaleEnum getLocale();

    boolean isNonSellable();
}
