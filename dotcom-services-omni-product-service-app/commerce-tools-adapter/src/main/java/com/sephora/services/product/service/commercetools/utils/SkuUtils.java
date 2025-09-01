package com.sephora.services.product.service.commercetools.utils;

import com.commercetools.api.models.product.AttributesAccessor;
import com.sephora.services.product.model.*;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.DEFAULT_LOCALE;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getAttributeSetFromEnumSet;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getAttributeValueFromEnum;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getCountrySetFromEnumSet;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getDoubleAttributeValue;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getFirstOrNull;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getFromLocalizedString;
import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getLongAttributeValue;
import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.*;

@UtilityClass
public class SkuUtils {

    public static final String PRODUCT_KEY_DELIMITER = "-";
    public static final String SKIN_TYPE_SEPARATOR = "||";

    public static SkuState getSkuState(@NotNull AttributesAccessor attributesAccessor) {
        return SkuState.fromString(getAttributeValueFromEnum(attributesAccessor.asEnum(SKU_STATE)));
    }

    public static String getSize(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_SIZE), locale);
    }

    public static String getColor(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_COLOR_NAME), locale);
    }

    public static String getScent(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_LOC_SCENT), locale);
    }

    public static String getFormulation(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_FORMULATION), locale);
    }

    public static String getConcentration(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_CONCENTRATION), locale);
    }

    public static SkuTypeEnum getType(@NotNull AttributesAccessor attributesAccessor) {
        return SkuTypeEnum.fromString(attributesAccessor.asString(SKU_TYPE));
    }

    public static OutOfStockTreatmentEnum getOosTreatment(@NotNull AttributesAccessor attributesAccessor) {
        return OutOfStockTreatmentEnum.fromString(attributesAccessor.asString(SKU_OOS_TREATMENT));
    }

    public static String getVariationDesc(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_SHADE_DESCRIPTION), locale);
    }

    public static String getSephoraType(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_VALUE_DESCRIPTION_TYPE), locale);
    }

    public static String getBiType(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(BI_TYPE);
    }

    public static BiExclusiveLevelEnum getBiExclusiveLevel(@NotNull AttributesAccessor attributesAccessor) {
        return BiExclusiveLevelEnum.fromString(attributesAccessor.asString(SKU_BIEXCLUSIVITY_LEVEL));
    }

    public static String getIngredientDesc(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_INGREDIENTS_TAB);
    }

    public static String getFulfiller(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_FULLFILLER);
    }

    public static String getPrimaryProductId(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(PRIMARY_PRODUCT);
    }

    public static String getUpc(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_UPC);
    }

    public static String getSeoFriendlyUrl(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_SEO_FRIENDLY_URL);
    }

    public static Set<StandardCountryEnum> getLimitedTimeOfferRestrictedCountries(@NotNull AttributesAccessor attributesAccessor) {
        return getCountrySetFromEnumSet(attributesAccessor.asSetEnum(SKU_LIMITED_TIME_OFFER_RESTRICTED_COUNTRY));
    }

    public static Set<StandardCountryEnum> getFirstAccessRestrictedCountries(@NotNull AttributesAccessor attributesAccessor) {
        return getCountrySetFromEnumSet(attributesAccessor.asSetEnum(SKU_FIRST_ACCESS_RESTRICTED_COUNTRY));
    }

    public static Set<StandardCountryEnum> getAppExclusiveRestrictedCountries(@NotNull AttributesAccessor attributesAccessor) {
        return getCountrySetFromEnumSet(attributesAccessor.asSetEnum(SKU_APP_EXCLUSIVE_RESTRICTED_COUNTRY));
    }

    public static String getFormulationRefinement(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return Optional.ofNullable(getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_FORMULATION_REFINEMENT_LOC), locale))
                .orElseGet(() -> attributesAccessor.asString(SKU_FORMULATION_REFINEMENT_PREV));
    }

    public static String getFinishRefinement(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return Optional.ofNullable(getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_FINISH_REFINEMENT_LOC), locale))
                .orElseGet(() -> getFirstOrNull(attributesAccessor.asSetString(SKU_FINISH_REFINEMENT_PREV)));
    }

    public static String getSizeRefinement(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return Optional.ofNullable(getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_SIZE_REFINEMENT_LOC), locale))
                .orElseGet(() -> getFirstOrNull(attributesAccessor.asSetString(SKU_SIZE_REFINEMENT_PREV)));
    }

    public static String getColorFamily(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return Optional.ofNullable(getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_COLOR_FAMILY_LOC), locale))
                .orElseGet(() -> getFirstOrNull(attributesAccessor.asSetString(SKU_COLOR_FAMILY_PREV)));
    }

    public static Long getMaxPurchaseQuantity(@NotNull AttributesAccessor attributesAccessor) {
        return getLongAttributeValue(attributesAccessor.get(SKU_MAX_PURCHASE_QTY_PER_ORDER));
    }

    public static Long getTempMaxPurchaseQuantity(@NotNull AttributesAccessor attributesAccessor) {
        return getLongAttributeValue(attributesAccessor.get(SKU_TEMP_MAX_PURCHASE_QTY_PER_ORDER));
    }

    public static ZonedDateTime getTempMaxPurchaseQuantityStartDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_TEMP_MAX_PURCHASE_QTY_START_DATE);
    }

    public static ZonedDateTime getTempMaxPurchaseQuantityEndDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_TEMP_MAX_PURCHASE_QTY_END_DATE);
    }

    public static Double getTaxCode(@NotNull AttributesAccessor attributesAccessor) {
        return getDoubleAttributeValue(attributesAccessor.get(SKU_TAX_CODE));
    }

    public static Boolean isActive(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_ACTIVE);
    }

    public static Boolean isStoreOnly(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(IS_STORE_ONLY);
    }

    public static boolean isTemporaryNotDeactivated(@NotNull AttributesAccessor attributesAccessor, Instant currentDate) {
        ZonedDateTime productEndDate = attributesAccessor.asDateTime(SKU_TEMP_DEACTIVATION_DATE);
        return productEndDate == null || currentDate.isBefore(productEndDate.toInstant());
    }

    @Nullable
    public static String getSkuId(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_ID);
    }

    public static ZonedDateTime getEndDate(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return locale == null || DEFAULT_LOCALE.equals(locale)
                ? attributesAccessor.asDateTime(SKU_US_END_DATE)
                : attributesAccessor.asDateTime(SKU_CA_END_DATE);
    }

    public static ZonedDateTime getStartDate(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return locale == null || DEFAULT_LOCALE.equals(locale)
                ? attributesAccessor.asDateTime(SKU_US_START_DATE)
                : attributesAccessor.asDateTime(SKU_CA_START_DATE);
    }

    public static Boolean isOnHold(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return locale == null || DEFAULT_LOCALE.equals(locale)
                ? attributesAccessor.asBoolean(SKU_ON_HOLD_US)
                : attributesAccessor.asBoolean(SKU_ON_HOLD_CA);
    }

    public static Set<StandardCountryEnum> getRestrictedCountrySet(@NotNull AttributesAccessor attributesAccessor) {
        return getCountrySetFromEnumSet(attributesAccessor.asSetEnum(SKU_RESTRICTED_COUNTRY));
    }

    public static Set<String> getRestrictedStates(@NotNull AttributesAccessor attributesAccessor) {
        return getAttributeSetFromEnumSet(attributesAccessor.asSetEnum(SKU_RESTRICTED_STATE));
    }

    public static Set<String> getRestrictedProvinces(@NotNull AttributesAccessor attributesAccessor) {
        return getAttributeSetFromEnumSet(attributesAccessor.asSetEnum(SKU_RESTRICTED_PROVINCE));
    }

    public static List<Badge> getBadges(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return CustomObjectUtils.convertToBadges(attributesAccessor.asSetReference(SKU_BADGES), locale);
    }

    public static String getSkuId(String productSkuPair) {
        return StringUtils.substringAfterLast(productSkuPair, PRODUCT_KEY_DELIMITER);
    }

    public static String getFullSizeSkuId(AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(FULL_SIZE_SKU);
    }

    public static Boolean isComingSoon(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_COMING_SOON);
    }

    public static ZonedDateTime getComingSoonSkuEndDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_COMING_SOON_END_DATE);
    }

    public static boolean isHazmat(@NotNull AttributesAccessor attributesAccessor) {
        return BooleanUtils.toBoolean(attributesAccessor.asString(SKU_MCS_HAZMAT_VALUE));
    }

    public static Boolean isHawaiiHazmatFlag(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_MCS_HAWAII_HAZMAT_VALUE);
    }

    public static Boolean isBiOnly(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_BI_EXCLUSIVE);
    }

    public static ZonedDateTime getBiOnlyStartDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_BI_EXCLUSIVE_START_DATE);
    }

    public static ZonedDateTime getBiOnlyEndDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_BI_EXCLUSIVE_END_DATE);
    }

    public static Boolean isOnlineOnly(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_ONLINE_ONLY);
    }

    public static ZonedDateTime getOnlineOnlyEndDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_ONLINE_ONLY_END_DATE);
    }

    public static Boolean isExternallySellable(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_EXTERNALLY_SELLABLE);
    }

    public static Boolean isGiftWrappable(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_GIFT_WRAPPABLE);
    }

    public static Boolean isLimitedEdition(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_LIMITED_EDITION);
    }

    public static Boolean isNew(@NotNull AttributesAccessor attributesAccessor) {
        ZonedDateTime newUntilDate = getNewUntilDate(attributesAccessor);
        return newUntilDate == null ? attributesAccessor.asBoolean(SKU_IS_NEW) : (Boolean) newUntilDate.isAfter(ZonedDateTime.now());
    }

    public static ZonedDateTime getNewUntilDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_NEW_UNTIL_DATE);
    }

    public static Boolean isSephoraExclusive(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_SEPHORA_EXCLUSIVE);
    }

    public static Boolean isFirstAccessFlag(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_FIRST_ACCESS);
    }

    public static Boolean isAppExclusiveFlag(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_APP_EXCLUSIVE);
    }

    public static Boolean isTrialEligible(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_TRIAL_ELIGIBLE);
    }

    public static String getTrialPeriod(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_TRIAL_PERIOD);
    }

    public static Boolean isConfigurable(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_CONFIGURABLE);
    }

    public static Boolean isReturnable(@NotNull AttributesAccessor attributesAccessor) {
        return BooleanUtils.negate(attributesAccessor.asBoolean(SKU_NONRETURNABLE));
    }

    public static Boolean isLimitedTimeOfferFlag(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_LIMITED_TIME_OFFER);
    }

    public static Boolean isProp65(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_PROP65);
    }

    public static Boolean isNotSentToWarehouse(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_NOT_SEND_TO_WAREHOUSE);
    }

    public static String getLabCode(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_LABCODE);
    }

    public static ZonedDateTime getTempDeactivationDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_TEMP_DEACTIVATION_DATE);
    }

    public static ZonedDateTime getLimitedTimeOfferStartDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_LIMITED_TIME_OFFER_START_DATE);
    }

    public static ZonedDateTime getLimitedTimeOfferEndDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_LIMITED_TIME_OFFER_END_DATE);
    }

    public static ZonedDateTime getFirstAccessStartDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_FIRST_ACCESS_START_DATE);
    }

    public static ZonedDateTime getFirstAccessEndDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_FIRST_ACCESS_END_DATE);
    }

    public static ZonedDateTime getAppExclusiveStartDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_APP_EXCLUSIVE_START_DATE);
    }

    public static ZonedDateTime getAppExclusiveEndDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_APP_EXCLUSIVE_END_DATE);
    }

    public static List<Image> getPrimaryImages(@NotNull AttributesAccessor attributesAccessor) {
        return CustomObjectUtils.convertToImages(attributesAccessor.asSetReference(SKU_PRIMARY_IMAGES));
    }

    public static List<Image> getAlternativeImages(@NotNull AttributesAccessor attributesAccessor) {
        return CustomObjectUtils.convertToImages(attributesAccessor.asSetReference(SKU_ALTERNATIVE_IMAGES));
    }

    public static ZonedDateTime getSephoraExclusiveUntilDate(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asDateTime(SKU_SEPHORA_EXCLUSIVE_UNTIL_DATE);
    }

    public static List<Highlight> getHighlights(AttributesAccessor attributesAccessor, Locale locale) {
        return CustomObjectUtils.convertToHighlights(attributesAccessor.asSetReference(SKU_HIGHLIGHTS), locale);
    }

    public static Boolean isPayPalPayLaterEligible(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_IS_PAYPAL_PAY_LATER_ELIGIBLE);
    }

    public static String getTemporaryDeactivationReason(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_TEMP_DEACTIVATION_REASON);
    }

    public static Boolean isPaypalRestricted(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_PAYPAL_RESTRICTED);
    }

    public static Boolean isCalculateTax(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_CALCULATE_TAX);
    }

    public static Boolean isHideFromSale(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_HIDE_FROM_SALE);
    }

    public static Boolean isExcludeFromSearch(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_EXCLUDE_FROM_SEARCH);
    }

    public static Boolean isReservationsEnabled(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_RESERVATIONS_ENABLED);
    }

    public static SkuFraudRiskLevelEnum getFraudRiskLevel(@NotNull AttributesAccessor attributesAccessor) {
        return SkuFraudRiskLevelEnum.fromString(attributesAccessor.asString(SKU_FRAUD_RISK_LEVEL));
    }

    public static Set<SkuSkinTypeEnum> getBestForSkinTypes(@NotNull AttributesAccessor attributesAccessor) {
        String bestForSkinTypes = attributesAccessor.asString(SKU_SKIN_TYPE);
        if (StringUtils.isBlank(bestForSkinTypes)) {
            return null;
        }
        if (bestForSkinTypes.contains(SKIN_TYPE_SEPARATOR)) {
            return Arrays.stream(StringUtils.split(bestForSkinTypes, SKIN_TYPE_SEPARATOR))
                    .map(SkuSkinTypeEnum::fromString)
                    .collect(Collectors.toSet());
        }
        return Set.of(SkuSkinTypeEnum.fromString(attributesAccessor.asString(SKU_SKIN_TYPE)));
    }

    public static String getPrimaryConcern(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_PRIMARY_CONCERN);
    }

    public static String getClassNumber(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_CLASS_NUMBER);
    }

    public static String getDepartmentNumber(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_DEPARTMENT_NUMBER);
    }

    public static Boolean isDiscountable(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_DISCOUNTABLE);
    }

    public static String getCountryOfManufacture(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_COUNTRY_OF_MANUFACTURE);
    }

    public static String getSubclassNumber(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_SUBCLASSNUMBER);
    }

    public static String getEfficacyIngredient(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_EFFICACY_INGREDIENT);
    }

    public static SkuEfficacyEnum getEfficacy(@NotNull AttributesAccessor attributesAccessor) {
        return SkuEfficacyEnum.fromString(attributesAccessor.asString(SKU_EFFICACY));
    }

    public static String getShopNumber(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asString(SKU_SHOP_NUMBER);
    }

    public static String getBiDescription(@NotNull AttributesAccessor attributesAccessor, Locale locale) {
        return getFromLocalizedString(attributesAccessor.asLocalizedString(SKU_BI_DESCRIPTION), locale);
    }

    public static SkuProductLineEnum getProductLine(@NotNull AttributesAccessor attributesAccessor) {
        return SkuProductLineEnum.fromString(attributesAccessor.asString(SKU_PRODUCT_LINE));
    }

    public static Boolean isDisplaySkuAsProductInSearchResult(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_DISPLAY_SKU_AS_PRODUCT_SEARCH);
    }

    public static Boolean isCallCenterOnly(@NotNull AttributesAccessor attributesAccessor) {
        return attributesAccessor.asBoolean(SKU_CALL_CENTER_ONLY);
    }

}
