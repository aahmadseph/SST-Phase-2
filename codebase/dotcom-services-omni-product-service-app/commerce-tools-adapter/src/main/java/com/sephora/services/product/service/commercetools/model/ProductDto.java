package com.sephora.services.product.service.commercetools.model;

import com.commercetools.api.models.product.AttributeAccessor;
import com.commercetools.api.models.product.AttributesAccessor;
import com.commercetools.api.models.product.ProductDataLike;
import com.commercetools.api.models.product.ProductProjection;
import com.sephora.services.product.model.*;
import com.sephora.services.product.service.commercetools.utils.AttributeUtils;
import com.sephora.services.product.service.commercetools.utils.ProductUtils;
import org.apache.commons.collections4.CollectionUtils;

import java.io.Serial;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getFromLocalizedString;
import static java.util.Objects.nonNull;

/*
 * Adapter class for adapt CT model to common model.
 */
public class ProductDto implements Product {

    @Serial
    private static final long serialVersionUID = -6443194796278376209L;

    public static final String MASTER_SKU_ID = "-MASTER";

    private final String productId;
    private final Locale locale;
    private AttributesAccessor attributesAccessor = AttributeUtils.EMPTY_ATTRIBUTE_ACCESSOR;
    private final ProductDataLike productData;
    private final boolean nonSellable;

    public ProductDto(String productId, ProductDataLike productData, Locale locale, boolean nonSellable) {
        this.productData = productData;
        this.productId = productId;
        this.locale = locale;
        var masterVariant = productData.getMasterVariant();
        if (masterVariant != null) {
            this.attributesAccessor = new AttributesAccessor(AttributeAccessor.asMap(masterVariant));
        } else {
            var allVariants = ProductUtils.getAllVariants(productData);
            if (CollectionUtils.isNotEmpty(allVariants)) {
                this.attributesAccessor = new AttributesAccessor(AttributeAccessor.asMap(allVariants.getFirst()));
            }
        }
        this.nonSellable = nonSellable;
    }

    public ProductDto(ProductProjection productProjection, Locale locale, boolean nonSellable) {
        this(productProjection.getKey(), productProjection, locale, nonSellable);
    }

    @Override
    public String getProductId() {
        return productId;
    }

    @Override
    public String getName() {
        return getFromLocalizedString(productData.getName(), locale);
    }

    @Override
    public String getSeoName() {
        return ProductUtils.getSeoName(attributesAccessor);
    }

    @Override
    public String getSeoFriendlyUrl() {
        return ProductUtils.getSeoFriendlyUrl(attributesAccessor);
    }

    @Override
    public ProductVariationType getVariationType() {
        return ProductUtils.getVariationType(attributesAccessor);
    }

    @Override
    public ProductSwatchTypeEnum getSwatchType() {
        return ProductUtils.getSwatchType(attributesAccessor);
    }

    @Override
    public String getPrimaryCategoryId() {
        return ProductUtils.getPrimaryCategoryId(attributesAccessor);
    }

    @Override
    public Set<String> getCategoryIds() {
        if (CollectionUtils.isNotEmpty(productData.getCategories())) {
            return productData.getCategories().stream()
                    .map(ProductUtils::getCategoryId)
                    .collect(Collectors.toSet());
        }
        return null;
    }

    @Override
    public String getBrandId() {
        return ProductUtils.getBrandId(attributesAccessor);
    }

    @Override
    public ProductTypeEnum getType() {
        return ProductUtils.getProductType(attributesAccessor);
    }

    @Override
    public String getSephoraProductType() {
        return ProductUtils.getSephoraProductType(attributesAccessor);
    }

    @Override
    public String getUseItWithTitle() {
        return ProductUtils.getUseItWithTitle(attributesAccessor, locale);
    }

    @Override
    public SkuSelectorTypeEnum getSkuSelectorType() {
        return ProductUtils.getSkuSelectorType(attributesAccessor);
    }

    @Override
    public String getShortDescription() {
        return ProductUtils.getShortDescription(attributesAccessor, locale);
    }

    @Override
    public String getLongDescription() {
        return ProductUtils.getLongDescription(attributesAccessor, locale);
    }

    @Override
    public String getSuggestedUsage() {
        return ProductUtils.getSuggestedUsage(attributesAccessor, locale);
    }

    @Override
    public String getQuickLookDescription() {
        return ProductUtils.getQuickLookDescription(attributesAccessor, locale);
    }

    @Override
    public boolean isActive() {
        return ProductUtils.isActive(attributesAccessor);
    }

    @Override
    public Boolean isPayPalRestricted() {
        return ProductUtils.isPayPalRestricted(attributesAccessor);
    }

    @Override
    public ZonedDateTime getActivationDate() {
        return ProductUtils.getStartDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getEndDate() {
        return ProductUtils.getEndDate(attributesAccessor);
    }

    @Override
    public ZonedDateTime getTempDeactivationDate() {
        return ProductUtils.getTempDeactivationDate(attributesAccessor);
    }

    @Override
    public Set<String> getRestrictedStates() {
        return ProductUtils.getRestrictedStates(attributesAccessor);
    }

    @Override
    public Set<String> getRestrictedProvinces() {
        return ProductUtils.getRestrictedProvinces(attributesAccessor);
    }

    @Override
    public List<String> getAncillarySkuKeys() {
        return ProductUtils.getAncillarySkuKeys(attributesAccessor);
    }

    @Override
    public List<Image> getPrimaryImages() {
        return ProductUtils.getPrimaryImages(attributesAccessor);
    }

    @Override
    public List<Image> getAlternativeImages() {
        return ProductUtils.getAlternativeImages(attributesAccessor);
    }

    @Override
    public List<Video> getVideos() {
        return ProductUtils.getVideos(attributesAccessor, locale);
    }

    @Override
    public Set<StandardCountryEnum> getEffectivelyAvailableCountries() {
        return ProductUtils.getEffectivelyAvailableCountries(attributesAccessor);
    }

    @Override
    public String getSeoMetaDescription() {
        return ProductUtils.getSeoMetaDescription(attributesAccessor, locale);
    }

    @Override
    public String getSeoUrlPrefix() {
        return ProductUtils.getSeoUrlPrefix(attributesAccessor);
    }

    @Override
    public String getSeoCanonicalTag() {
        return ProductUtils.getSeoCanonicalTag(attributesAccessor);
    }

    @Override
    public String getSeoPageTitle() {
        return ProductUtils.getSeoPageTitle(attributesAccessor, locale);
    }

    @Override
    public String getSeoPriority() {
        return ProductUtils.getSeoPriority(attributesAccessor);
    }

    @Override
    public String getFinalTitle() {
        return ProductUtils.getFinalTitle(attributesAccessor, locale);
    }

    @Override
    public String getFinalMetaDescription() {
        return ProductUtils.getFinalMetaDescription(attributesAccessor, locale);
    }

    @Override
    public String getProductImage() {
        return ProductUtils.getProductImage(attributesAccessor);
    }

    @Override
    public String getKeywords() {
        return ProductUtils.getKeywords(attributesAccessor, locale);
    }

    @Override
    public Boolean isReturnable() {
        return ProductUtils.isReturnable(attributesAccessor);
    }

    @Override
    public List<String> getZone1() {
        return ProductUtils.getZone1(attributesAccessor);
    }

    @Override
    public List<String> getZone2() {
        return ProductUtils.getZone2(attributesAccessor);
    }

    @Override
    public List<String> getZone3() {
        return ProductUtils.getZone3(attributesAccessor);
    }

    @Override
    public Boolean isExcludeFromSitemap() {
        return ProductUtils.isExcludeFromSitemap(attributesAccessor);
    }

    @Override
    public String getTemporaryDeactivationReason() {
        return ProductUtils.getTemporaryDeactivationReason(attributesAccessor);
    }

    @Override
    public Boolean isEnableNoindexMetaTag() {
        return ProductUtils.isEnableNoindexMetaTag(attributesAccessor);
    }

    @Override
    public Boolean isHasProductSamples() {
        return ProductUtils.isHasProductSamples(attributesAccessor);
    }

    @Override
    public Set<Sku> getSkus() {
        if (CollectionUtils.isNotEmpty(productData.getAllVariants())) {
            return productData.getAllVariants().stream()
                    .filter(variant -> variant.getKey() != null && !variant.getKey().endsWith(MASTER_SKU_ID))
                    .map(variant -> new SkuDto(ProductUtils.getProductId(variant.getKey()), this.productData.getName(), variant, this.locale))
                    .collect(Collectors.toSet());
        }
        return null;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (!(obj instanceof SkuDto other)) {
            return false;
        }

        if (Objects.equals(getProductId(), other.getSkuId())) {
            return true;
        }

        if (getProductId() == null) return false;

        // equivalence by id
        return Objects.equals(getProductId(), other.getSkuId());
    }

    @Override
    public int hashCode() {
        if (nonNull(getProductId())) {
            return getProductId().hashCode();
        }
        return super.hashCode();
    }

    @Override
    public StandardLocaleEnum getLocale() {
        return StandardLocaleEnum.fromLocale(locale);
    }

    @Override
    public boolean isNonSellable() {
        return nonSellable;
    }
}
