package com.sephora.services.product.service.commercetools.utils;

import com.commercetools.api.models.category.CategoryReference;
import com.commercetools.api.models.category.CategoryReferenceImpl;
import com.commercetools.api.models.product.Attribute;
import com.commercetools.api.models.product.AttributesAccessor;
import com.commercetools.api.models.product.ProductDataLike;
import com.commercetools.api.models.product.ProductVariant;
import com.sephora.services.product.model.Image;
import com.sephora.services.product.model.ProductSwatchTypeEnum;
import com.sephora.services.product.model.ProductTypeEnum;
import com.sephora.services.product.model.ProductVariationType;
import com.sephora.services.product.model.SkuSelectorTypeEnum;
import com.sephora.services.product.model.StandardCountryEnum;
import com.sephora.services.product.model.Video;
import lombok.experimental.UtilityClass;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getAttributeSetFromEnumSet;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getCountrySetFromEnumSet;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getCustomObjectReferenceKey;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getFromLocalizedString;
import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.*;
import static com.sephora.services.product.service.commercetools.utils.SkuUtils.PRODUCT_KEY_DELIMITER;
import static java.util.Objects.nonNull;

@UtilityClass
public class ProductUtils {

    private static final String VERTICAL_PAGE_TEMPLATE_KEY = "9100022";
    private static final String COLLECTION_PAGE_TEMPLATE_KEY = "200002";
    private static final String STANDARD_PAGE_TEMPLATE_KEY = "200006";

    public static String getSeoName(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SEO_PRODUCT_NAME);
    }

    public static String getSeoFriendlyUrl(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SEO_FRIENDLY_URL);
    }

    public static ProductVariationType getVariationType(@NotNull AttributesAccessor attributesAccessor) {
        return ProductVariationType.fromString(attributesAccessor.asString(PRODUCT_VARIATION_TYPE));
    }

    public static ProductSwatchTypeEnum getSwatchType(@NotNull AttributesAccessor attributesAccessor) {
        return ProductSwatchTypeEnum.fromString(attributesAccessor.asString(PRODUCT_SWATCH_TYPE));
    }

    public static String getPrimaryCategoryId(@NotNull AttributesAccessor attributesAccessor) {
        return getCategoryId(attributesAccessor.get(PRIMARY_CATEGORY_PRODUCT));
    }

    public static String getCategoryId(final Attribute attribute) {
        if (nonNull(attribute)
                && nonNull(attribute.getValue())
                && attribute.getValue() instanceof CategoryReferenceImpl categoryReference
                && nonNull(categoryReference.getObj())) {
            return categoryReference.getObj().getKey();
        }
        return null;
    }

    public static String getCategoryId(final CategoryReference categoryReference) {
        if (nonNull(categoryReference.getObj())) {
            return categoryReference.getObj().getKey();
        }
        return null;
    }

    public static String getBrandId(@NotNull AttributesAccessor attributesAccessor) {
        var key = getCustomObjectReferenceKey(attributesAccessor.get(BRAND));
        if (nonNull(key)) {
            return key;
        }
        return null;
    }

    public static boolean isActive(@NotNull AttributesAccessor attributesAccessor) {
        return BooleanUtils.isTrue(attributesAccessor.asBoolean(IS_ACTIVE_PRODUCT));
    }

    public static ZonedDateTime getEndDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(END_DATE_PRODUCT);
    }

    public static ZonedDateTime getStartDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(START_DATE_PRODUCT);
    }

    public static ZonedDateTime getTempDeactivationDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(TEMPORARY_DEACTIVATION_PRODUCT);
    }

    public static ProductTypeEnum getProductType(AttributesAccessor attributesAccessor) {
        var key = getCustomObjectReferenceKey(attributesAccessor.get(PRODUCT_PAGE_TEMPLATE));
        if (nonNull(key)) {
            return switch (key) {
                case VERTICAL_PAGE_TEMPLATE_KEY -> ProductTypeEnum.VERTICAL;
                case COLLECTION_PAGE_TEMPLATE_KEY -> ProductTypeEnum.COLLECTION;
                default -> ProductTypeEnum.STANDARD;
            };
        }
        return ProductTypeEnum.STANDARD;
    }

    public static String getSephoraProductType(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SEPHORA_PRODUCT_TYPE);
    }

    public static String getUseItWithTitle(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_USE_IT_WITH_LOC), locale);
    }

    public static SkuSelectorTypeEnum getSkuSelectorType(@NotNull AttributesAccessor attributesAccessor) {
        return SkuSelectorTypeEnum.fromString(attributesAccessor.asString(PRODUCT_SELECTOR_TYPE));
    }

    public static String getShortDescription(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_DESCRIPTION_TAB_SHORT), locale);
    }

    public static String getLongDescription(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_DESCRIPTION_TAB_LONG), locale);
    }

    public static String getSuggestedUsage(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_SUGGESTED_USAGE), locale);
    }

    public static String getQuickLookDescription(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_DESCRIPTION_TAB_QUICK_LOOK), locale);
    }

    public static Boolean isPayPalRestricted(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(PRODUCT_PAYPAL_RESTRICTED);
    }

    public static Set<String> getRestrictedStates(@NotNull AttributesAccessor attributesAccessor) {
        return getAttributeSetFromEnumSet(attributesAccessor.asSetEnum(PRODUCT_RESTRICTED_STATE));
    }

    public static Set<String> getRestrictedProvinces(@NotNull AttributesAccessor attributesAccessor) {
        return getAttributeSetFromEnumSet(attributesAccessor.asSetEnum(PRODUCT_RESTRICTED_PROVINCE));
    }

    public static List<String> getAncillarySkuKeys(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asSetString(PRODUCT_ANCILLARY_SKUS);
    }

    public static List<Image> getPrimaryImages(@NotNull AttributesAccessor attributesAccessor) {
        return CustomObjectUtils.convertToImages(attributesAccessor.asSetReference(PRODUCT_PRIMARY_IMAGES));
    }

    public static List<Image> getAlternativeImages(@NotNull AttributesAccessor attributesAccessor) {
        return CustomObjectUtils.convertToImages(attributesAccessor.asSetReference(PRODUCT_ALTERNATIVE_IMAGES));
    }

    public static List<Video> getVideos(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return CustomObjectUtils.convertToProductVideos(attributesAccessor.asSetReference(SKU_PRODUCT_VIDEOS), locale);
    }

    public static Set<StandardCountryEnum> getEffectivelyAvailableCountries(@NotNull AttributesAccessor attributesAccessor) {
        return getCountrySetFromEnumSet(attributesAccessor.asSetEnum(PRODUCT_EFFECTIVELY_AVAILABLE_COUNTRY_LIST));
    }

    public static String getSeoMetaDescription(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_SEO_META_DESCRIPTION), locale);
    }

    public static String getSeoUrlPrefix(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(PRODUCT_SEO_URL_PREFIX);
    }

    public static String getSeoCanonicalTag(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(PRODUCT_SEO_CANONICAL_TAG);
    }

    public static String getSeoPageTitle(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_SEO_PAGE_TITLE), locale);
    }

    public static String getSeoPriority(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(PRODUCT_SEO_PRIORITY);
    }

    public static String getFinalTitle(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_FINAL_TITLE), locale);
    }

    public static String getFinalMetaDescription(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_FINAL_META_DESCRIPTION), locale);
    }

    public static String getProductImage(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(PRODUCT_DEFAULT_IMAGE);
    }

    public static String getKeywords(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(PRODUCT_KEYWORDS), locale);
    }

    public static Boolean isReturnable(@NotNull AttributesAccessor attributesAccessor) {
        return BooleanUtils.negate(attributesAccessor.asBoolean(PRODUCT_NONRETURNABLE));
    }

    public static List<String> getZone1(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asSetString(PRODUCT_ZONE1);
    }

    public static List<String> getZone2(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asSetString(PRODUCT_ZONE2);
    }

    public static List<String> getZone3(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asSetString(PRODUCT_ZONE3);
    }

    public static Boolean isExcludeFromSitemap(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(PRODUCT_EXCLUDE_FROM_SITEMAP);
    }

    public static String getTemporaryDeactivationReason(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(PRODUCT_TEMPORARY_DEACTIVATION_REASON);
    }

    public static Boolean isEnableNoindexMetaTag(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(PRODUCT_NO_INDEX);
    }

    public static Boolean isHasProductSamples(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(PRODUCT_HAS_SAMPLE);
    }

    public static String getProductId(String productSkuPair) {
        return StringUtils.substringBefore(productSkuPair, PRODUCT_KEY_DELIMITER);
    }

    /**
     * Enhanced method com.commercetools.api.models.product.ProductsPackage#getAllVariants(com.commercetools.api.models.product.ProductDataLike)
     * On CT the method can return null on list id master variant is null.
     *
     * @param product product data object
     * @return all variants
     */
    public static List<ProductVariant> getAllVariants(final ProductDataLike product) {
        final List<ProductVariant> nonMasterVariants = product.getVariants();
        final var masterVariant = product.getMasterVariant();
        if (masterVariant != null && !CollectionUtils.isEmpty(nonMasterVariants)) {
            final ArrayList<ProductVariant> result = new ArrayList<>(1 + nonMasterVariants.size());
            result.add(product.getMasterVariant());
            result.addAll(nonMasterVariants);
            return result;
        } else if (masterVariant != null) {
            return List.of(masterVariant);
        } else if (!CollectionUtils.isEmpty(nonMasterVariants)) {
            return nonMasterVariants;
        } else {
            return List.of();
        }
    }

    public static String getStringAttribute(ProductVariant productVariant, String attributeName) {
        if (productVariant != null && !CollectionUtils.isEmpty(productVariant.getAttributes())) {
            for (Attribute attr : productVariant.getAttributes()) {
                if (Objects.equals(attr.getName(), attributeName)
                        && attr.getValue() instanceof String value) {
                    return value;
                }
            }
        }
        return null;
    }
}
