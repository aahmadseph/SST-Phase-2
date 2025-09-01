/* eslint-disable no-use-before-define */
import React from 'react';
import Empty from 'constants/empty';
import skuUtils from 'utils/Sku';
import orderUtils from 'utils/Order';
import errorsUtils from 'utils/Errors';
import userUtils from 'utils/User';
import dateUtils from 'utils/Date';
import helperUtils from 'utils/Helpers';
import promoUtils from 'utils/Promos';
import biProfileUtils from 'utils/BiProfile';
import localeUtils from 'utils/LanguageLocale';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import * as RwdBasketConst from 'constants/RwdBasket';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PayPal from 'utils/PayPal';
import CheckoutUtils from 'utils/Checkout';
import { colors } from 'style/config';
const { SAMPLES_ONLY } = CheckoutUtils.MESSAGE_CONTEXT;
const { TYPES } = PayPal;

const { getLocaleResourceFile, getTextDirectFromResource, getCurrentLanguage, getCurrentCountry } = LanguageLocaleUtils;
import itemSubstitutionUtils from 'utils/ItemSubstitution';
import RCPSCookies from 'utils/RCPSCookies';
import skuHelpers from 'utils/skuHelpers';
import { FULFILLMENT_TYPES } from 'actions/ActionsConstants';

const { findBasketTypeByCommerceId } = itemSubstitutionUtils;
const getText = getLocaleResourceFile('components/RwdBasket/DisplaySDUErrorText/locales', 'DisplaySDUErrorText');
const getSDDErrorsText = getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions');
const getBIBenefitsRewardsText = getLocaleResourceFile(
    'components/RwdBasket/RwdBasketLayout/BIBenefits/BIBenefitsRewards/locales',
    'BIBenefitsRewards'
);

const { getProp } = helperUtils;
const {
    ROOT_BASKET_TYPES: { PRE_BASKET, MAIN_BASKET },
    MAIN_BASKET_TYPES: { DC_BASKET, BOPIS_BASKET },
    DC_BASKET_TYPES: { SAMEDAY_BASKET, AUTOREPLENISH_BASKET, STANDARD_BASKET },
    SECONDARY_COLUMN_TYPES: { PAYMENT_INFO, BI_BENEFITS },
    CART_BANNER_SECTION_TYPES: { SDU_ROUGE_INSENTIVE_BANNER, ADD_GIFT_MESSAGE_BANNER },
    BASKET_LEVEL_MESSAGES_CONTEXTS: {
        GLOBAL_BASKET_LEVEL_MESSAGES,
        BOPIS_GLOBAL_BASKET_LEVEL_MESSAGES,
        STANDARD_BASKET_LEVEL_MESSAGES,
        SDD_BASKET_LEVEL_MESSAGES,
        BOPIS_BASKET_LEVEL_MESSAGES,
        PRE_BASKET_BOPIS_ERRORS,
        PRE_BASKET_STANDARD_ERRORS,
        RRC_REMAINING_BALANCE,
        RW_REMAINING_BALANCE,
        REWARD_WARNING
    },
    BASKET_ERROR_TYPES: { GLOBAL_ERRORS, BOPIS_GLOBAL_ERRORS, SDD_ERRORS },
    DELIVERY_METHOD_TYPES: { STANDARD, SAMEDAY, BOPIS, AUTOREPLENISH },
    GIFT_MESSAGE_STATUS,
    CHANGE_METHOD_TYPES,
    BASKET_RENDERING_TYPE: { GIFT_CARD_QUICK_ADD, BI_BENEFITS_TILES, BI_BENEFITS_TILES_ITEM }
} = RwdBasketConst;

function calculateCartQuantity(items) {
    return items.reduce((acc, item) => acc + item.qty, 0);
}

function getUserSDUStatus(userSubscriptions) {
    const { isTrialEligible, status } = userSubscriptions?.filter(subscription => subscription.type === 'SDU')[0] || Empty.Object;
    const isUserSDUTrialEligible = isTrialEligible != null ? isTrialEligible : true;
    const isUserSDUMember = !!status?.startsWith('ACTIVE');

    return {
        isUserSDUTrialEligible,
        isUserSDUMember
    };
}

function getConfirmationBoxinfo({
    isBopis, switchedItem, confirmationBoxOptions, itemBasket, switchItemMessage
}) {
    if (!switchedItem || !confirmationBoxOptions) {
        return { isAvailable: false };
    }

    const {
        itemMovedMsg, skuId, qty, prevDeliveryOption, productId, switchedBasket
    } = switchedItem;
    const { itemSwitchedToBasket, itemSwitchedFromBasket } = confirmationBoxOptions;

    const [, itemDescription] = itemMovedMsg?.split('**');
    const isSwitchedToBopis = switchedBasket === CHANGE_METHOD_TYPES.BOPIS;
    const isCrossBasketChange = isBopis || isSwitchedToBopis;

    const onUndoArgs = {
        skuId,
        qty,
        prevDeliveryOption,
        productId,
        switchedBasket
    };

    return {
        isAvailable: itemBasket === itemSwitchedFromBasket,
        itemDescription,
        basketOrderVar: itemSwitchedToBasket,
        switchItemMessage,
        isLink: isCrossBasketChange,
        isLinkToBopisBasket: isSwitchedToBopis,
        onUndoArgs
    };
}

function getPickupFromStoreInfo(
    { pickupBasket, switchItemMessage },
    {
        preferredStoreInfo, preferredZipCode, userId, isSignedIn, isBIUser: isSignedInBIUser
    },
    hasMetFreeShippingThreshhold,
    confirmationBoxOptions
) {
    const { isROPISEnabled, isBOPISEnabled } = Sephora.configurationSettings;
    const bopisIsEnabled = isROPISEnabled || isBOPISEnabled;

    if (!bopisIsEnabled || pickupBasket == null || pickupBasket.items.length === 0) {
        return {
            isAvailable: false,
            totalQuantity: 0
        };
    }

    const {
        items, pickupMessage, pickupOrderNotificationMsg, storeDetails, switchedItem
    } = pickupBasket;

    return {
        isAvailable: true,
        items,
        totalQuantity: calculateCartQuantity(items),
        pickupMessage,
        pickupOrderNotificationMsg,
        itemDeliveryMethod: BOPIS,
        preferredZipCode,
        storeDetails: preferredStoreInfo?.isCustomerSelected ? preferredStoreInfo : storeDetails,
        userId,
        hasMetFreeShippingThreshhold,
        isSignedIn,
        isSignedInBIUser,
        confirmationBoxInfo: getConfirmationBoxinfo({
            isBopis: true,
            switchedItem,
            confirmationBoxOptions,
            itemBasket: BOPIS,
            switchItemMessage
        })
    };
}

function getSameDayDeliveryInfo(
    {
        itemsByBasket,
        SDDRougeTestThreshold,
        SDDRougeTestRemainToFreeShipping,
        SDUProduct,
        switchedItem,
        switchItemMessage,
        isSameDayDeliveryAvailable
    },
    {
        isSDUFeatureDown,
        isSignedIn,
        isBIUser: isSignedInBIUser,
        preferredStoreInfo,
        preferredZipCode,
        userId,
        isUserSDUTrialEligible,
        isUserSDUMember
    },
    hasMetFreeShippingThreshhold,
    confirmationBoxOptions
) {
    const { isSameDayShippingEnabled, isSamedayUnlimitedEnabled } = Sephora.configurationSettings;
    const sdd = itemsByBasket?.find(e => e.basketType === SAMEDAY_BASKET);

    if (sdd == null || !isSameDayShippingEnabled) {
        return {
            isAvailable: false,
            totalQuantity: 0
        };
    }

    const { items, sameDayDeliveryMessage, sameDayTitle } = sdd;
    const isSDDRougeTestFreeShipping = !!SDDRougeTestThreshold;
    const isSDUItemInBasket = skuUtils.isSDU(items[0].sku);

    // same day service is eligible for preferredZipCode
    const sameDayAvailable = isSameDayDeliveryAvailable ?? Storage.local.getItem(LOCAL_STORAGE.SAME_DAY_DELIVERY_AVAILABLE);

    return {
        items,
        totalQuantity: calculateCartQuantity(items),
        isAvailable: true,
        isSDDAvailableAfterZipChange: sameDayAvailable,
        sameDayDeliveryMessage,
        sameDayTitle,
        isSDDRougeTestFreeShipping,
        SDDRougeTestRemainToFreeShipping,
        isSDUOnlyInBasket: items.length === 1 && isSDUItemInBasket,
        isSDUItemInBasket,
        SDDRougeTestThreshold,
        SDUProduct,
        itemDeliveryMethod: SAMEDAY,
        isSamedayUnlimitedEnabled,
        isSDUFeatureDown,
        isSignedIn,
        isSignedInBIUser,
        preferredStoreInfo,
        preferredZipCode,
        userId,
        isUserSDUTrialEligible,
        isUserSDUMember,
        hasMetFreeShippingThreshhold,
        confirmationBoxInfo: getConfirmationBoxinfo({
            isBopis: false,
            switchedItem,
            confirmationBoxOptions,
            itemBasket: SAMEDAY,
            switchItemMessage
        })
    };
}

function getStandardShippingInfo(
    { itemsByBasket, switchedItem },
    {
        isSignedIn, isBIUser: isSignedInBIUser, preferredStoreInfo, preferredZipCode, userId
    },
    hasMetFreeShippingThreshhold,
    confirmationBoxOptions
) {
    const standard = itemsByBasket?.find(e => e.basketType === STANDARD_BASKET);
    const standardFiltered = standard?.items.filter(item => !item.isReplenishment);

    if (standard == null || standardFiltered.length === 0) {
        return { isAvailable: false, totalQuantity: 0 };
    }

    return {
        items: standardFiltered,
        totalQuantity: calculateCartQuantity(standardFiltered),
        isAvailable: true,

        hasMetFreeShippingThreshhold,
        itemDeliveryMethod: STANDARD,
        isSignedIn,
        isSignedInBIUser,
        preferredStoreInfo,
        preferredZipCode,
        userId,
        confirmationBoxInfo: getConfirmationBoxinfo({ isBopis: false, switchedItem, confirmationBoxOptions, itemBasket: STANDARD })
    };
}

function getAutoreplenishInfo(
    { itemsByBasket, totalAnnualReplenishmentDiscount, switchedItem },
    {
        firstName, isSignedIn, isBIUser: isSignedInBIUser, preferredStoreInfo, preferredZipCode, userId
    },
    hasMetFreeShippingThreshhold,
    confirmationBoxOptions
) {
    const standard = itemsByBasket?.find(e => e.basketType === STANDARD_BASKET);
    const autoreplenish = standard?.items.filter(item => item.isReplenishment);
    const hasAcceleratedPromotionItems = autoreplenish?.some(item => item.sku.acceleratedPromotion);

    if (standard == null || autoreplenish.length === 0) {
        return {
            isAvailable: false,
            totalQuantity: 0
        };
    }

    return {
        isAvailable: true,
        items: autoreplenish,
        totalQuantity: calculateCartQuantity(autoreplenish),
        totalAnnualReplenishmentDiscount,
        hasAcceleratedPromotionItems,
        itemDeliveryMethod: AUTOREPLENISH,
        firstName,
        isSignedIn,
        isSignedInBIUser,
        preferredStoreInfo,
        preferredZipCode,
        userId,
        hasMetFreeShippingThreshhold,
        confirmationBoxInfo: getConfirmationBoxinfo({ isBopis: false, switchedItem, confirmationBoxOptions, itemBasket: AUTOREPLENISH })
    };
}

function getSDURougeInsentiveBannerInfo(
    { SDDRougeTestThreshold, SDUProduct },
    { isSDDRougeFreeShipEligible, isUserSDUTrialEligible },
    quantitiesByBasket
) {
    const { sddTotalQuantity } = quantitiesByBasket;
    let isAvailable;

    if (RCPSCookies.isRCPSFullProfileGroup()) {
        const { standardTotalQuantity, autoreplenishTotalQuantity } = quantitiesByBasket;

        const totalItemsNotInSddBasket = standardTotalQuantity + autoreplenishTotalQuantity;
        isAvailable = !sddTotalQuantity && totalItemsNotInSddBasket && SDDRougeTestThreshold && isSDDRougeFreeShipEligible;
    } else {
        isAvailable = !sddTotalQuantity && (SDDRougeTestThreshold || isSDDRougeFreeShipEligible);
    }

    return {
        isAvailable,
        SDDRougeTestThreshold,
        SDUProduct,
        isSDDRougeFreeShipEligible,
        isUserSDUTrialEligible
    };
}

function getAddGiftMessageBannerInfo({ digitalGiftMessagingStatus, orderId }) {
    if (digitalGiftMessagingStatus === GIFT_MESSAGE_STATUS.NOT_AVAILABLE) {
        return {
            isAvailable: false
        };
    }

    return {
        isAvailable: true,
        giftMessagingStatus: digitalGiftMessagingStatus,
        orderId
    };
}

// We should not have any reason to re-calculate the values being returned here (unless we have perf issues in which case we can memoize in HOCs)
function getCartInfo({
    basket, user, confirmationBoxOptions, hasMetFreeShippingThreshhold, rwdCheckoutErrors
}) {
    const bopisInfo = getPickupFromStoreInfo(basket, user, hasMetFreeShippingThreshhold, confirmationBoxOptions);
    const samedayInfo = getSameDayDeliveryInfo(basket, user, hasMetFreeShippingThreshhold, confirmationBoxOptions);
    const standardInfo = getStandardShippingInfo(basket, user, hasMetFreeShippingThreshhold, confirmationBoxOptions);
    const autoreplenishInfo = getAutoreplenishInfo(basket, user, hasMetFreeShippingThreshhold, confirmationBoxOptions);
    const addGiftMessageBannerInfo = getAddGiftMessageBannerInfo(basket);
    const SDURougeInsentiveBannerInfo = getSDURougeInsentiveBannerInfo(basket, user, {
        sddTotalQuantity: samedayInfo.totalQuantity,
        standardTotalQuantity: standardInfo.totalQuantity,
        autoreplenishTotalQuantity: autoreplenishInfo.totalQuantity
    });

    const totalItemsShippingBaskets = samedayInfo.totalQuantity + standardInfo.totalQuantity + autoreplenishInfo.totalQuantity;

    return {
        getTotalItemsBopisBaskets: () => bopisInfo.totalQuantity,
        getTotalItemsShippingBaskets: () => totalItemsShippingBaskets,
        getAllSaDItems: () => calculateSaDItemsWithBasketType(basket),
        getAllBOPISItems: () => bopisInfo.items.map(item => ({ ...item, sku: { ...item.sku, basketType: BOPIS_BASKET } })),
        isShippingBasketEmpty: totalItemsShippingBaskets === 0,
        [BOPIS_BASKET]: bopisInfo,
        [SAMEDAY_BASKET]: samedayInfo,
        [STANDARD_BASKET]: standardInfo,
        [AUTOREPLENISH_BASKET]: autoreplenishInfo,
        // pseudo-carts
        [ADD_GIFT_MESSAGE_BANNER]: addGiftMessageBannerInfo,
        [SDU_ROUGE_INSENTIVE_BANNER]: SDURougeInsentiveBannerInfo,
        rwdCheckoutErrors
    };
}

function calculateSaDItemsWithBasketType(basket) {
    return basket.items.map(item => ({
        ...item,
        sku: {
            ...item.sku,
            basketType: findBasketTypeByCommerceId(item.commerceId, basket)
        }
    }));
}

function getTargetUrl(item) {
    return item.sku.fullSizeSku && item.sku.fullSizeSku.targetUrl ? item.sku.fullSizeSku.targetUrl : item.sku.targetUrl;
}

function getGrossSubtotal({ rawSubTotal, subtotal }) {
    const rawSubTotalNum = Number(rawSubTotal?.replace(/\D/g, ''));
    const subtotalNum = Number(subtotal?.replace(/\D/g, ''));

    return rawSubTotalNum > subtotalNum ? rawSubTotal : null;
}

function getApplePaymentStatus(basket) {
    return async () => {
        const ApplePay = (await import(/* webpackChunkName: "priority" */ 'services/ApplePay')).default;
        const { ENABLED } = ApplePay.TYPES;

        return (await ApplePay.getApplePaymentType(basket)) === ENABLED ? ENABLED : false;
    };
}

function getPayPalPaymentStatus({ isPaypalPaymentEnabled, items }) {
    const shippingCountry = userUtils.getShippingCountry().countryCode;
    const isEligiblePayPalShippingCountry = shippingCountry === localeUtils.COUNTRIES.US || shippingCountry === localeUtils.COUNTRIES.CA;
    const isPaypalRestricted = !items.length || items.some(item => item.sku.isPaypalRestricted);
    const isPayPayKillSwitchEnabled = Sephora.configurationSettings.isPayPalEnabled;

    const isPayPalEnabled = isPaypalPaymentEnabled && isEligiblePayPalShippingCountry && !isPaypalRestricted && isPayPayKillSwitchEnabled;

    return isPayPalEnabled ? TYPES.ENABLED : false;
}

function getVenmoPaymentStatus({ isVenmoEligible, items }) {
    const isVenmoEnabled = Sephora.configurationSettings.isVenmoEnabled;
    const isUs = localeUtils.isUS();
    const hasItems = !!items.length;
    const venmoAvailablity = isVenmoEligible && isVenmoEnabled && isUs && hasItems;

    return venmoAvailablity;
}

function calculateFreeShipping({
    isBIUser, isSignedIn, isSDDBasketAvailable, hasMetFreeShippingThreshhold, isUserSDUMember, isSDUItemInBasket
}) {
    if (isSDDBasketAvailable && !isUserSDUMember && !isSDUItemInBasket) {
        return false;
    }

    if ((isBIUser && isSignedIn) || hasMetFreeShippingThreshhold) {
        return true;
    }

    return false;
}

function getPaymentInfo({
    basket, user: { isBIUser, isUserSDUMember, isSignedIn }, cartInfo, infoModalCallbacks, hasMetFreeShippingThreshhold
}) {
    const { replenishmentDiscountAmount, pickupBasket } = basket;

    const { isAvailable: isSDDBasketAvailable, isSDUOnlyInBasket, isSDUItemInBasket } = cartInfo[SAMEDAY_BASKET];

    const isRougeRewardsApplied =
        (basket.appliedPromotions?.filter(promo => promo.sephoraPromotionType === promoUtils.CTA_TYPES.RRC) || []).length > 0;

    const shared = {
        isBIUser,
        isSignedIn
    };

    return {
        [BOPIS_BASKET]: {
            ...shared,

            isBopis: true,

            showShippingAndHandling: false,
            showPickupFree: true,
            showBagFeeSubTotal: true,
            showZeroDollarsTax: false,

            bagFeeSubTotal: pickupBasket.bagFeeSubTotal,
            discountAmount: pickupBasket.discountAmount,
            firstBuyDiscountTotal: pickupBasket.firstBuyDiscountTotal,
            redeemedBiPoints: pickupBasket.redeemedBiPoints,

            rawSubTotal: pickupBasket.rawSubTotal,
            subtotal: pickupBasket.subtotal,

            hasPickupSubstituteItems: hasSubstituteItemsInBasket(cartInfo, BOPIS_BASKET),
            grossSubTotal: getGrossSubtotal(pickupBasket),
            getApplePaymentStatus: getApplePaymentStatus(pickupBasket),
            isPaypalPayment: getPayPalPaymentStatus(pickupBasket),
            isVenmoEligible: getVenmoPaymentStatus(pickupBasket),
            totalItems: cartInfo.getTotalItemsBopisBaskets(),

            isCheckoutDisabled: cartInfo.getTotalItemsBopisBaskets() === 0,

            isAfterpayCheckoutEnabled: pickupBasket.isAfterpayCheckoutEnabled,
            isAfterpayEnabledForProfile: pickupBasket.isAfterpayEnabledForProfile,
            isKlarnaCheckoutEnabled: pickupBasket.isKlarnaCheckoutEnabled,
            isPayPalPayLaterEligible: pickupBasket.isPayPalPayLaterEligible,

            infoModalCallbacks: infoModalCallbacks[BOPIS_BASKET][PAYMENT_INFO]
        },
        [DC_BASKET]: {
            ...shared,

            isBopis: false,

            isUserSDUMember,

            showShippingAndHandling: !cartInfo.isShippingBasketEmpty,
            userHasFreeShipping: calculateFreeShipping({
                isBIUser,
                isSignedIn,
                isSDDBasketAvailable,
                hasMetFreeShippingThreshhold,
                isUserSDUMember,
                isSDUItemInBasket
            }),

            showShippingAndTaxes: !cartInfo.isShippingBasketEmpty,
            showPickupFree: false,
            showBagFeeSubTotal: false,
            showZeroDollarsTax: cartInfo.isShippingBasketEmpty,

            isSDDBasketAvailable,
            isSDUItemInBasket,
            isSDUOnlyInBasket,

            redeemedBiPoints: basket.redeemedBiPoints,
            replenishmentDiscountAmount: orderUtils.isZeroPrice(replenishmentDiscountAmount) ? null : replenishmentDiscountAmount,
            discountAmount: basket.discountAmount,
            firstBuyDiscountTotal: basket.firstBuyDiscountTotal,
            hasSameDaySubstituteItems: hasSubstituteItemsInBasket(cartInfo, SAMEDAY_BASKET),
            hasMetFreeShippingThreshhold,

            rawSubTotal: basket.rawSubTotal,
            subtotal: basket.subtotal,

            grossSubTotal: getGrossSubtotal(basket),
            getApplePaymentStatus: getApplePaymentStatus(basket),
            isPaypalPayment: getPayPalPaymentStatus(basket),
            isVenmoEligible: getVenmoPaymentStatus(basket),
            totalItems: cartInfo.getTotalItemsShippingBaskets(),

            isCheckoutDisabled: cartInfo.getTotalItemsShippingBaskets() === 0,

            isAfterpayCheckoutEnabled: basket.isAfterpayCheckoutEnabled,
            isAfterpayEnabledForProfile: basket.isAfterpayEnabledForProfile,
            isKlarnaCheckoutEnabled: basket.isKlarnaCheckoutEnabled,
            isPayPalPayLaterEligible: basket.isPayPalPayLaterEligible,

            infoModalCallbacks: infoModalCallbacks[DC_BASKET][PAYMENT_INFO],
            isRougeRewardsApplied
        }
    };
}

function sortRewardCertificates(rewardCertificates = [], appliedRewards = []) {
    return (
        (rewardCertificates &&
            rewardCertificates
                .map(reward => {
                    const newReward = Object.assign({}, reward);
                    appliedRewards.forEach(appliedReward => {
                        if (reward.certificateNumber.toLowerCase() === appliedReward.couponCode.toLowerCase()) {
                            newReward.isApplied = true;
                        }

                        return newReward;
                    });

                    return newReward;
                })
                .sort((a, b) => (a.isApplied === b.isApplied ? 0 : a.isApplied ? -1 : 1))) ||
        []
    );
}

function appliedRewardsTotal(rewardCertificates) {
    return rewardCertificates.reduce((total, amount) => {
        if (amount.isApplied) {
            return total + amount.rewardAmount;
        }

        return total;
    }, 0);
}

function appliedCCRewardsCount(rewardCertificates = []) {
    return rewardCertificates?.filter(certificate => certificate.isApplied).length;
}

function getCCTargetersInfo(ccTargeters, basket) {
    const { pickupBasket } = basket;
    const ccTargetersData = ccTargeters?.CCDynamicMessagingBasketTargeter && ccTargeters?.CCDynamicMessagingBasketTargeter[0];
    const firstBuyDiscountTotal = pickupBasket?.items?.length ? pickupBasket.firstBuyOrderDiscount : basket.firstBuyOrderDiscount;

    if (!ccTargetersData) {
        return null;
    }

    const formattedData = {};

    ccTargetersData?.attributes?.forEach(attr => {
        const keyValuePair = attr?.split('=');

        if (keyValuePair.length && keyValuePair?.length === 2) {
            formattedData[keyValuePair[0]] = keyValuePair[1];
        } else if (keyValuePair.length && keyValuePair?.length === 3) {
            //if icid2 url param has been included in attribute
            formattedData[keyValuePair[0]] = keyValuePair[1] + '=' + keyValuePair[2];
        }
    });

    let text = formattedData.Message;

    if (text?.includes('{0}')) {
        text = firstBuyDiscountTotal ? formattedData.Message.replace('{0}', firstBuyDiscountTotal) : '';
    }

    return {
        title: formattedData.CreditCardName,
        text,
        imagePath: formattedData.Icon,
        tcText: formattedData.TermsAndConditions,
        buttonText: formattedData.CTAText,
        buttonUrl: formattedData.CTADestination
    };
}

function getCCBannerInfo(ccBanner, basket) {
    const { pickupBasket } = basket;
    const firstBuyDiscountTotal = pickupBasket?.items?.length ? pickupBasket.firstBuyOrderDiscount : basket.firstBuyOrderDiscount;

    if (ccBanner?.length > 0) {
        const formattedData = ccBanner.reduce((acc, curr) => {
            acc[curr.key] = curr.value;

            return acc;
        }, {});

        let text = formattedData.Message;

        if (text.indexOf('{0}') !== -1) {
            text = firstBuyDiscountTotal ? formattedData.Message.replace('{0}', firstBuyDiscountTotal) : '';
        }

        return {
            title: formattedData.CreditCardName,
            text: text,
            imagePath: formattedData.Icon,
            tcText: formattedData.TermsAndConditions,
            buttonText: formattedData.CTAText,
            buttonUrl: formattedData.CTADestination
        };
    }

    return null;
}

function getCashBackRewardsInfo({
    basket: {
        availableCBRPromotions,
        maxEligibleCBR,
        appliedCBRValue,
        subtotal,
        rawSubTotal,
        netBeautyBankPointsAvailable,
        pickupBasket: {
            availableCBRPromotions: bopisAvailableCBRPromotions,
            maxEligibleCBR: bopisMaxEligibleCBR,
            appliedCBRValue: bopisAppliedCBRValue,
            subtotal: bopisSubtotal,
            rawSubTotal: bopisRawSubTotal,
            netBeautyBankPointsAvailable: bopisNetBeautyBankPointsAvailable
        }
    },
    biBenefitsPromos
}) {
    const { promoCode, errorMessages } = promoUtils.extractError(biBenefitsPromos, [promoUtils.CTA_TYPES.CBR]);
    const errorMessage = errorMessages?.length ? errorMessages.join(' ') : null;

    const error = {
        message: errorMessage,
        couponCode: promoCode?.toUpperCase() || null,
        isAvailable: errorMessage != null
    };

    return {
        [BOPIS_BASKET]: {
            isAvailable: bopisAvailableCBRPromotions?.length > 0,
            promos: bopisAvailableCBRPromotions,
            availableCash: localeUtils.getFormattedPrice(bopisMaxEligibleCBR, false, false),
            appliedValue: localeUtils.getFormattedPrice(bopisAppliedCBRValue, false, false),
            biPoints: bopisNetBeautyBankPointsAvailable,
            subtotal: bopisSubtotal,
            rawSubTotal: bopisRawSubTotal,
            error
        },
        [DC_BASKET]: {
            isAvailable: availableCBRPromotions?.length > 0,
            promos: availableCBRPromotions,
            availableCash: localeUtils.getFormattedPrice(maxEligibleCBR, false, false),
            appliedValue: localeUtils.getFormattedPrice(appliedCBRValue, false, false),
            biPoints: netBeautyBankPointsAvailable,
            subtotal,
            rawSubTotal,
            error
        }
    };
}

function getRougeRewardsInfo({ rougeRewardsCoupons, basket, biBenefitsPromos }) {
    const availableRougeRewards = rougeRewardsCoupons?.coupons?.length ? sortRougeRewardsByDate(rougeRewardsCoupons?.coupons) : [];
    const appliedRougeRewards = basket.appliedPromotions?.filter(promo => promo.sephoraPromotionType === promoUtils.CTA_TYPES.RRC) || [];
    const isRougeRewardsApplied = appliedRougeRewards.length > 0;
    const firstAppliedRougeReward = isRougeRewardsApplied
        ? availableRougeRewards.filter(reward => reward.couponCode.toLowerCase() === appliedRougeRewards[0].couponCode.toLowerCase())[0]
        : null;
    const rewardToShow = isRougeRewardsApplied ? firstAppliedRougeReward : availableRougeRewards[0];
    const rrcRemainingBalanceMessage =
        availableRougeRewards.length === 1
            ? getRemainingBalanceMessage({ basketLevelMessages: basket?.basketLevelMessages, messageContext: RRC_REMAINING_BALANCE })
            : null;

    return {
        showRougeRewardsUI: availableRougeRewards.length > 0,
        ...(availableRougeRewards?.length && {
            promo: biBenefitsPromos,
            mainRougeReward: {
                denomination: rewardToShow?.denomination,
                expirationDate: rewardToShow?.expirationDate ? dateUtils.getDateInMMDDYYFormat(rewardToShow?.expirationDate) : null,
                couponCode: rewardToShow?.couponCode,
                country: rewardToShow?.country,
                isApplied:
                    basket.appliedPromotions?.length &&
                    rewardToShow &&
                    basket.appliedPromotions.filter(promo => promo.couponCode.toLowerCase() === rewardToShow.couponCode.toLowerCase()).length
            },
            rrcRemainingBalanceMessage,
            showRougeRewardsChevron: availableRougeRewards?.length > 1
        }),
        ...(availableRougeRewards?.length > 1 && {
            availableRougeRewards: availableRougeRewards,
            appliedRougeRewards: isRougeRewardsApplied ? appliedRougeRewards : []
        })
    };
}

function getFirstTimeCCDiscount(ccRewards) {
    if (!ccRewards?.firstPurchaseDiscountEligible) {
        return null;
    }

    return {
        expireDate: ccRewards.ccFirstTimeDiscountExpireDate,
        creditCardCouponCode: ccRewards.firstPurchaseDiscountCouponCode,
        shortDisplayName: `${parseInt(ccRewards.firstPurchaseDiscountPercentOff)}% off`
    };
}

function getCCRewardsInfo({ user, basket, biBenefitsPromos }) {
    const bankRewards = user.ccRewards?.bankRewards || userUtils.getBankRewards();
    const appliedRewards = promoUtils.getAppliedPromotions(promoUtils.PROMO_TYPES.CCR);
    const creditCardPromoDetails = getFirstTimeCCDiscount(user.ccRewards);
    const appliedPromotions = basket?.appliedPromotions;
    const isFirstPurchaseDiscountApplied =
        creditCardPromoDetails && appliedRewards.some(reward => reward.couponCode === promoUtils.FIRST_INCENTIVE_DISCOUNT);
    const isFirstPurchaseDiscountAvailable = creditCardPromoDetails != null;
    const firstTimeCCDiscount = isFirstPurchaseDiscountAvailable
        ? {
            ...creditCardPromoDetails,
            isFirstPurchaseDiscount: true,
            isApplied: !!isFirstPurchaseDiscountApplied,
            certificateNumber: creditCardPromoDetails.creditCardCouponCode,
            rewardAmount: 0
        }
        : null;

    const rewardCertificates = sortRewardCertificates(bankRewards?.rewardCertificates, appliedRewards) || [];
    const appliedCCRewardsTotal = appliedRewardsTotal(rewardCertificates);
    const availableRewardsTotal = userUtils.getRewardsAmount(bankRewards) - appliedCCRewardsTotal;
    const isMultipleCCRewards = rewardCertificates.length > 1 || (rewardCertificates.length > 0 && isFirstPurchaseDiscountAvailable);
    const ccRemainingBalanceMessage = getRemainingBalanceMessage({
        basketLevelMessages: basket?.basketLevelMessages,
        messageContext: RW_REMAINING_BALANCE
    });
    const showCCRewards = rewardCertificates.length > 0 || isFirstPurchaseDiscountAvailable;
    const hasRemainingBalanceWarning = Boolean(basket?.basketLevelMessages?.find(message => message.messageContext.includes(RW_REMAINING_BALANCE)));

    return {
        showCCRewards,
        ...(showCCRewards && {
            ccRewardsData: {
                promo: biBenefitsPromos,
                appliedPromotions,
                rewardCertificates,
                availableRewardsTotal,
                appliedCCRewardsTotal,
                isMultipleCCRewards,
                appliedRewardsCount: appliedCCRewardsCount(rewardCertificates),
                ccRemainingBalanceMessage,
                firstTimeCCDiscount,
                hasRemainingBalanceWarning
            }
        })
    };
}

function getRewardsBazaarInfo({ isOmniRewardEnabled }) {
    const rewardsByBasketList = skuHelpers.getRewardsByBasketList();

    const showOmniRewardsNotice = rewardsByBasketList?.length === 0 && isOmniRewardEnabled;

    return {
        rewardsByBasketList,
        showOmniRewardsNotice
    };
}

function getBIBenefitTiles({ biBenefitsCmsData = [] }) {
    const biBenefitItems = (biBenefitsCmsData.find(contentData => contentData.renderingType === BI_BENEFITS_TILES)?.items || []).filter(
        biBenefitTiles => biBenefitTiles.renderingType === BI_BENEFITS_TILES_ITEM
    );

    return biBenefitItems;
}

function getBIBenefitTilesForCheckout({ biBenefitsCmsData = [] }) {
    const biBenefitItems = biBenefitsCmsData.filter(biBenefitTiles => biBenefitTiles.renderingType === BI_BENEFITS_TILES_ITEM) || [];

    return biBenefitItems;
}

function getBiBenefitsInfo(
    {
        basket,
        user,
        cmsData,
        rougeRewardsCoupons,
        infoModalCallbacks,
        biBenefitsPromos,
        ccTargeters,
        ccBanner,
        rwdCheckoutErrors,
        isOmniRewardEnabled,
        isCheckout = false
    },
    hideFreeSamplesOnBasket
) {
    const { pickupBasket } = basket;
    const isBIDown = user.isSignedIn && biProfileUtils.isBiDown();
    const isNonBI = user.biStatus === userUtils.types.NON_BI.toLowerCase();
    const rougeRewardsInfo = user.isSignedIn ? getRougeRewardsInfo({ rougeRewardsCoupons, basket, biBenefitsPromos }) : {};
    const ccRewardsInfo = user.isSignedIn ? getCCRewardsInfo({ user, basket, biBenefitsPromos }) : {};
    const rewardsBazaarInfo = getRewardsBazaarInfo({ isOmniRewardEnabled });
    const cbrInfo = getCashBackRewardsInfo({ basket, biBenefitsPromos });
    const sameDayItems = basket.itemsByBasket?.find(e => e.basketType === SAMEDAY_BASKET);
    const bopisRougeMessage = getBIBenefitsRewardsText('bopisRougeMessage');
    const bopisRougeMessageRedirect = getBIBenefitsRewardsText('bopisRougeMessageRedirect');
    const sameDayDeliveryRougeMessage = getBIBenefitsRewardsText('sameDayDeliveryRougeMessage');
    const biBenefitTiles = !isCheckout
        ? getBIBenefitTiles({ biBenefitsCmsData: cmsData?.biBenifits })
        : getBIBenefitTilesForCheckout({ biBenefitsCmsData: cmsData?.biBenifits });
    const samples = basket?.items?.filter(item => skuUtils.isSample(item.sku)) || [];
    const filteredSamples = skuUtils.getFilteredSamples(samples);

    const shared = {
        isSignedIn: user.isSignedIn,
        biBenefitsContentData: biBenefitTiles,
        ccTargeters: getCCTargetersInfo(ccTargeters, basket),
        ccBanner: getCCBannerInfo(ccBanner, basket),
        isBIDown,
        isNonBI,
        biAccount: {
            biStatus: user.biStatus,
            birthdayRewardDaysLeft: user.birthdayRewardDaysLeft
        },
        biBenefitsErrors: rwdCheckoutErrors.biBenefitsErrors
    };

    return {
        [BOPIS_BASKET]: {
            ...shared,
            biAccount: {
                ...shared.biAccount,
                biPoints: basket.pickupBasket.netBeautyBankPointsAvailable
            },
            rougeRewards: {
                ...rougeRewardsInfo,
                disableRougeRewards: true,
                showRougeRewardsChevron: false,
                rougeDisabledMessage: bopisRougeMessage,
                rougeDisabledRedirectMessage: bopisRougeMessageRedirect
            },
            ccRewards: { ...ccRewardsInfo, orderSubTotal: pickupBasket.subtotal, grossSubTotal: getGrossSubtotal(pickupBasket) },
            rewardsBazaar: {
                showRewardsBazaar: isOmniRewardEnabled && user.isSignedIn && !isNonBI,
                isBopis: true,
                ...rewardsBazaarInfo
            },
            showFreeSamplesUI: false,
            infoModalCallbacks: infoModalCallbacks[BOPIS_BASKET][BI_BENEFITS],
            bopisFeaturedOffers: true,
            cbr: cbrInfo[BOPIS_BASKET],
            bopisErrors: rwdCheckoutErrors.bopisZone2
        },
        [DC_BASKET]: {
            ...shared,
            biAccount: {
                ...shared.biAccount,
                biPoints: basket.netBeautyBankPointsAvailable
            },
            rougeRewards: {
                ...rougeRewardsInfo,
                disableRougeRewards: sameDayItems?.items?.length || hasPhysicalGiftCardInBasket(basket),
                rougeDisabledMessage: sameDayDeliveryRougeMessage
            },
            ccRewards: { ...ccRewardsInfo, orderSubTotal: basket.subtotal, grossSubTotal: getGrossSubtotal(basket) },
            rewardsBazaar: { ...rewardsBazaarInfo, showRewardsBazaar: user.isSignedIn && !isNonBI },
            showFreeSamplesUI: !hideFreeSamplesOnBasket,
            samplesAdded: filteredSamples?.length || 0,
            infoModalCallbacks: infoModalCallbacks[DC_BASKET][BI_BENEFITS],
            bopisFeaturedOffers: false,
            cbr: cbrInfo[DC_BASKET],
            standardErrors: [...rwdCheckoutErrors.sddZone2, ...rwdCheckoutErrors.gisZone2]
        }
    };
}

function sortRougeRewardsByDate(rougeRewards) {
    let sortedRewards = [];

    if (rougeRewards.length) {
        sortedRewards = rougeRewards.slice().sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    }

    return sortedRewards;
}

function getScrollToNext(topOfBasket) {
    let scrollToNextShipping = null;

    if (topOfBasket[DC_BASKET].isAvailable) {
        scrollToNextShipping = topOfBasket.ref;
    }

    let scrollToNextBopis = null;

    if (topOfBasket[BOPIS_BASKET].isAvailable) {
        scrollToNextBopis = topOfBasket.ref;
    }

    return {
        [BOPIS_BASKET]: {
            scrollToNextBopis
        },
        [DC_BASKET]: {
            scrollToNextShipping
        }
    };
}

function formatBasketLevelMessage(message) {
    const [title, body] = errorsUtils.splitFormattedError(message);

    return title ? (
        <React.Fragment>
            <b>{title}</b>
            {body}
        </React.Fragment>
    ) : (
        body
    );
}

function getShippingBasketLevelErrors({ error = [], basketLevelMessages = [] }) {
    return [
        ...error
            .filter(
                errorMsg =>
                    !basketLevelMessages.some(msg => {
                        const { messages, messageContext } = msg;

                        return messageContext === SAMPLES_ONLY && messages.some(message => message === errorMsg);
                    })
            )
            .reduce((acc, obj) => {
                if (GLOBAL_ERRORS.includes(obj.type)) {
                    acc.push(formatBasketLevelMessage(error[obj.type]));
                }

                return acc;
            }, []),
        ...basketLevelMessages.reduce((acc, obj) => {
            if (GLOBAL_BASKET_LEVEL_MESSAGES.includes(obj.messageContext)) {
                acc.push(obj.messages[0]);
            }

            return acc;
        }, [])
    ];
}

function getBopisBasketLevelErrors({ pickupError, pickupBasketLevelMessages }) {
    return [
        ...pickupBasketLevelMessages.reduce((acc, obj) => {
            if (BOPIS_GLOBAL_BASKET_LEVEL_MESSAGES.includes(obj.messageContext)) {
                acc.push(obj.messages[0]);
            }

            return acc;
        }, []),
        ...pickupError.reduce((acc, obj) => {
            if (BOPIS_GLOBAL_ERRORS.includes(obj.type)) {
                acc.push(formatBasketLevelMessage(pickupError[obj.type]));
            }

            return acc;
        }, [])
    ];
}

function getTopOfBasketErrors({
    error, basketLevelMessages, pickupError, pickupBasketLevelMessages, cartInfo
}) {
    const basketLevelErrors = getShippingBasketLevelErrors({ error, basketLevelMessages });
    const bopisBasketLevelErrors = getBopisBasketLevelErrors({ pickupError, pickupBasketLevelMessages });
    const standardErrors = cartInfo?.rwdCheckoutErrors?.topOfPageSad || [];
    const bopisErrors = cartInfo?.rwdCheckoutErrors?.topOfPageBopis || [];

    // Combine the arrays and remove duplicates in one step
    const uniqueBopisErrors = [...new Set([...bopisBasketLevelErrors, ...bopisErrors])];
    const dcBasketErrors = [...basketLevelErrors, ...standardErrors];

    return {
        [BOPIS_BASKET]: {
            messages: uniqueBopisErrors,
            isAvailable: uniqueBopisErrors.length > 0,
            ref: React.createRef()
        },
        [DC_BASKET]: {
            messages: dcBasketErrors,
            isAvailable: dcBasketErrors.length > 0,
            ref: React.createRef()
        }
    };
}

function getSameDayBasketLevelErrors({ isSDUFeatureDown }) {
    const labels = ['benefitsFor', 'sameDayUnlimited', 'unavailable', 'workingToResolve'];
    const localizedStrings = labels.map(label => getTextDirectFromResource(getText, label));

    return isSDUFeatureDown ? [localizedStrings.join(' ')] : [];
}

function getCartLevelErrors({ error = [], basketLevelMessages = [], pickupBasketLevelMessages = [], cartInfo }) {
    const { rwdCheckoutErrors } = cartInfo;

    const sddErrorsFromFlags = getSameDayBasketLevelErrors({ isSDUFeatureDown: cartInfo[SAMEDAY_BASKET].isSDUFeatureDown });

    const sameDayBasketLevelMessages = basketLevelMessages.reduce((acc, obj) => {
        if (SDD_BASKET_LEVEL_MESSAGES.includes(obj.messageContext)) {
            acc.push(obj.messages[0]);
        }

        return acc;
    }, []);

    const sameDayErrorMessages = error.reduce((acc, obj) => {
        if (SDD_ERRORS.includes(obj.type)) {
            acc.push(formatBasketLevelMessage(error[obj.type]));
        }

        return acc;
    }, []);

    let sameDayErrors = [...sddErrorsFromFlags, ...sameDayBasketLevelMessages, ...sameDayErrorMessages];

    let standardErrors = basketLevelMessages.reduce((acc, obj) => {
        if (STANDARD_BASKET_LEVEL_MESSAGES.includes(obj.messageContext)) {
            acc.push(obj.messages[0]);
        }

        return acc;
    }, []);

    let bopisErrors = pickupBasketLevelMessages.reduce((acc, obj) => {
        if (BOPIS_BASKET_LEVEL_MESSAGES.includes(obj.messageContext)) {
            acc.push(obj.messages[0]);
        }

        return acc;
    }, []);

    const bopisRewardErrors = pickupBasketLevelMessages.find(obj => obj.messageContext === REWARD_WARNING)?.messages || [];
    const standardRewardErrors = basketLevelMessages.find(obj => obj.messageContext === REWARD_WARNING)?.messages || [];
    const sameDayRewardErrors = sameDayBasketLevelMessages.find(obj => obj.messageContext === REWARD_WARNING)?.messages || [];

    // Basket contract calls (that populate sameDayErrors, standardErrors and bopisErrors)
    // can be made many times while user in on basket page and fires after checkout init call (that populates rwdCheckoutErrors).
    // INFL-5071 prioritzied non-checkout errors over the others to avoid rendering duplicate error messages.
    standardErrors = standardErrors?.length > 0 ? standardErrors : rwdCheckoutErrors?.gisZone2;
    bopisErrors = bopisErrors?.length > 0 ? bopisErrors : rwdCheckoutErrors?.bopisZone2;
    // INFL-5678 is prioritizing SDD specific checkout errors to avoid hiding more important SDD errors such as "SDD service down".
    // At this point we only know of one SDD bucket error that comes in basketLevelMessage and that one also comes in Checkout.
    sameDayErrors = rwdCheckoutErrors?.sddZone2?.length > 0 ? rwdCheckoutErrors?.sddZone2 : sameDayErrors;

    return {
        [BOPIS_BASKET]: {
            messages: bopisErrors,
            isAvailable: bopisErrors.length > 0,
            ref: React.createRef(),
            bopisRewardErrors
        },
        [DC_BASKET]: {
            [SAMEDAY_BASKET]: {
                messages: sameDayErrors,
                isAvailable: sameDayErrors.length > 0,
                ref: React.createRef(),
                sameDayRewardErrors
            },
            [AUTOREPLENISH_BASKET]: {
                isAvailable: false
            },
            [STANDARD_BASKET]: {
                messages: standardErrors,
                isAvailable: standardErrors.length > 0,
                ref: React.createRef(),
                standardRewardErrors
            }
        }
    };
}

function extractItemLevelMessages(cartInfo) {
    if (!cartInfo.isAvailable) {
        return null;
    }

    return cartInfo.items.reduce((acc, { commerceId, itemLevelMessages = [] }) => {
        if (itemLevelMessages != null) {
            const filteredMessages = itemLevelMessages.filter(
                msg =>
                    msg.messageContext !== 'item.hazmatSku' &&
                    msg.messageContext !== 'item.californiaRestricted' &&
                    msg.messageContext !== 'item.skuOutOfStock' &&
                    msg.messageContext !== 'basket.pickupsku.outOfStock'
            );

            // isAvailable === the error is available to show
            acc.push([
                commerceId,
                filteredMessages.length > 0
                    ? {
                        ref: React.createRef(),
                        message: filteredMessages[0].messages[0],
                        isAvailable: true
                    }
                    : { isAvailable: false }
            ]);
        }

        return acc;
    }, []);
}

function getItemLevelErrors({ cartInfo }) {
    const bopisErrorMap = new Map(extractItemLevelMessages(cartInfo[BOPIS_BASKET]));
    const samedayErrorMap = new Map(extractItemLevelMessages(cartInfo[SAMEDAY_BASKET]));
    const autoreplenishErrorMap = new Map(extractItemLevelMessages(cartInfo[AUTOREPLENISH_BASKET]));
    const standardErrorMap = new Map(extractItemLevelMessages(cartInfo[STANDARD_BASKET]));

    return {
        [BOPIS_BASKET]: bopisErrorMap,
        [DC_BASKET]: {
            [SAMEDAY_BASKET]: samedayErrorMap,
            [AUTOREPLENISH_BASKET]: autoreplenishErrorMap,
            [STANDARD_BASKET]: standardErrorMap
        }
    };
}

function getPreBasketErrors({ basketLevelMessages = [], pickupBasketLevelMessages = [] }) {
    const bopisErrors = pickupBasketLevelMessages.reduce((acc, obj) => {
        if (PRE_BASKET_BOPIS_ERRORS.includes(obj.messageContext)) {
            acc.push(obj.messages[0]);
        }

        return acc;
    }, []);

    const standardErrors = basketLevelMessages.reduce((acc, obj) => {
        if (PRE_BASKET_STANDARD_ERRORS.includes(obj.messageContext)) {
            acc.push(obj.messages[0]);
        }

        return acc;
    }, []);

    return {
        [BOPIS_BASKET]: {
            isAvailable: bopisErrors.length > 0,
            messages: bopisErrors,
            type: BOPIS_BASKET
        },
        [DC_BASKET]: {
            isAvailable: standardErrors.length > 0,
            messages: standardErrors,
            type: DC_BASKET
        }
    };
}

const getRemainingBalanceMessage = ({ basketLevelMessages = [], messageContext }) => {
    const rrcRemainingBalance = basketLevelMessages.find(msg => msg.messageContext === messageContext);
    const messages = getProp(rrcRemainingBalance, 'messages', []);

    return messages[0];
};

function getMessageInfo({
    basket: { basketLevelMessages: basketLevelMessages, error = [] },
    pickupBasket: { basketLevelMessages: pickupBasketLevelMessages = [], error: pickupError = [] },
    cartInfo
}) {
    const topOfBasketErrors = getTopOfBasketErrors({
        error,
        basketLevelMessages,
        pickupError,
        pickupBasketLevelMessages,
        cartInfo
    });
    const cartLevelErrors = getCartLevelErrors({
        error,
        basketLevelMessages,
        pickupError,
        pickupBasketLevelMessages,
        cartInfo
    });
    const itemLevelErrors = getItemLevelErrors({ cartInfo });
    const preBasketErrors = getPreBasketErrors({ basketLevelMessages, pickupBasketLevelMessages });

    // TODO Need a story for Anchoring.
    // We started this feature but apps team couldn't do it and PdM wanted parity across clients
    // PdM said one day, anchoring feature will be built so this was left.
    const scrollToNext = getScrollToNext(topOfBasketErrors, cartLevelErrors, itemLevelErrors);

    const dcBasketErrors = Object.values(itemLevelErrors[DC_BASKET] || {});

    // isAvailable === the error is available to show
    const dcBasketErrorsExist =
        cartLevelErrors[DC_BASKET]?.messages?.length > 0 ||
        dcBasketErrors.some(map => Array.from(map.values()).some(value => value?.isAvailable !== false));

    return {
        [MAIN_BASKET]: {
            [BOPIS_BASKET]: {
                ...scrollToNext[BOPIS_BASKET],
                topOfBasketErrors: topOfBasketErrors[BOPIS_BASKET],
                cartLevelErrors: cartLevelErrors[BOPIS_BASKET],
                itemLevelErrors: itemLevelErrors[BOPIS_BASKET]
            },
            [DC_BASKET]: {
                ...scrollToNext[DC_BASKET],
                topOfBasketErrors: topOfBasketErrors[DC_BASKET],
                cartLevelErrors: cartLevelErrors[DC_BASKET],
                itemLevelErrors: itemLevelErrors[DC_BASKET],
                dcBasketErrorsExist
            }
        },
        [PRE_BASKET]: {
            [BOPIS_BASKET]: preBasketErrors[BOPIS_BASKET],
            [DC_BASKET]: preBasketErrors[DC_BASKET]
        }
    };
}

function getGiftCardInfo(cartInfo, { giftCardSku }) {
    const gcInBasket = cartInfo.getAllSaDItems().some(item => item.sku.type?.toLowerCase() === skuUtils.skuTypes.GC);

    return {
        [BOPIS_BASKET]: {
            isAvailable: false
        },
        [DC_BASKET]: {
            isAvailable: !gcInBasket && giftCardSku?.renderingType === GIFT_CARD_QUICK_ADD
        }
    };
}

const isSDDNotAvailableInZipCode = error => (error?.errorCode === -1 && error?.errors?.invalidInput) || error?.errors?.ZipcodeException;

async function getItemSddBopisAvailability({ userId, item, options = Empty.Object, preferredZipCode }) {
    const { getRopisSpecificProductDetails, getSameDaySpecificProductDetails } = (await import(/* webpackMode: "eager" */ 'services/api/profile'))
        .default;

    const { getFulfillmentOptions } = (await import(/* webpackChunkName: "components" */ 'services/api/upfunnel')).default;

    const defaultOptions = {
        fetchPickup: Sephora.configurationSettings.isBOPISEnabled,
        fetchSameDay: Sephora.configurationSettings.isSameDayShippingEnabled
    };

    const { fetchPickup, fetchSameDay, fetchStandard } = {
        ...defaultOptions,
        ...options
    };

    const getPickupProductDetails = fetchPickup
        ? getRopisSpecificProductDetails(userId, item.sku.productId, item.sku.skuId, 'basket').catch(error => error)
        : Promise.resolve(null);

    const getSDDProductDetails = fetchSameDay
        ? getSameDaySpecificProductDetails(userId, item.sku.productId, item.sku.skuId, 'basket').catch(error => {
            const serviceUnavailableErrors = error?.errors?.serviceUnavailable?.length > 0;
            const serviceExceptionErrors = error?.errors?.serviceException?.length > 0;

            if (serviceUnavailableErrors || serviceExceptionErrors) {
                const sddUnavailableMessage = getTextDirectFromResource(getSDDErrorsText, 'sddTemporarilyUnavailableAtLocation');
                error.serviceUnavailable = true;
                error.errors.serviceUnavailable = [sddUnavailableMessage];
            }

            if (error?.errorCode === 404 || error?.errors?.serviceException) {
                error.sddTemporarilyUnavailable = true;
            } else if (isSDDNotAvailableInZipCode(error)) {
                error.sddNotAvailableForZipCode = true;
                error.notAvailableZipCode = preferredZipCode;
            }

            return error;
        })
        : Promise.resolve(null);

    const source = 'BASKET';
    const requestOrigin = 'BASKET';
    const country = getCurrentCountry();
    const locale = `${country}_${getCurrentLanguage()}`;
    const isUS = localeUtils.isUS();

    const payload = {
        source,
        requestOrigin,
        country,
        locale,
        fulfillmentOptions: [
            {
                fulfillmentType: FULFILLMENT_TYPES.SHIP,
                items: [item.sku.skuId],
                address: {
                    zipCode: preferredZipCode,
                    country
                }
            }
        ],
        enterpriseCode: isUS ? 'SEPHORAUS' : 'SEPHORACA',
        sellerCode: isUS ? 'SEPHORADOTCOM' : 'SEPHORADOTCA'
    };

    const getStandardDeliveryEstimate = fetchStandard
        ? getFulfillmentOptions(payload, false, fetchStandard).catch(error => error)
        : Promise.resolve(null);

    return await Promise.all([getPickupProductDetails, getSDDProductDetails, getStandardDeliveryEstimate]);
}

function hasSubstituteItemsInBasket(cartInfo, BASKET) {
    const { items, isAvailable } = cartInfo[BASKET];

    if (isAvailable) {
        return items.some(item => item.substituteSku);
    }

    return false;
}

function hasPhysicalGiftCardInBasket(basket) {
    const { items } = basket;

    return items.some(item => item.sku.type?.toLowerCase() === skuUtils.skuTypes.GC);
}

function findBasketTypeBySkuId(skuId, itemsByBasket, pickupBasketItems) {
    const pickupItem = pickupBasketItems?.find(item => item.sku.skuId === skuId);

    if (pickupItem) {
        return BOPIS;
    }

    for (const basketItem of itemsByBasket) {
        const foundItem = basketItem?.items?.find(item => item.sku.skuId === skuId);

        if (foundItem) {
            return basketItem.basketType;
        }
    }

    return null;
}

function applyTopLevelBackground(components, showBasketGreyBackground) {
    if (!Array.isArray(components)) {
        return components;
    }

    return components.map((Component, index) => {
        if (React.isValidElement(Component)) {
            return React.cloneElement(Component, {
                key: Component.key ?? index,
                backgroundColor: showBasketGreyBackground ? colors.white : undefined,
                showBasketGreyBackground
            });
        }

        return Component;
    });
}

function applyShowBasketGreyBackgroundToProductLists(component, showBasketGreyBackground) {
    if (React.isValidElement(component) && Array.isArray(component.props.items)) {
        const updatedItems = component.props.items.map(item => {
            if (item && item.type === 'ProductList' && typeof item === 'object') {
                return {
                    ...item,
                    showBasketGreyBackground: showBasketGreyBackground
                };
            }

            if (React.isValidElement(item) && Array.isArray(item.props.items)) {
                return React.cloneElement(item, {
                    items: this.applyShowBasketGreyBackgroundToProductLists(item).props.items
                });
            }

            return item;
        });

        return React.cloneElement(component, { items: updatedItems });
    }

    return component;
}

function getProductIdsFromStandardBasket(basket) {
    const basketData = basket ? basket : Storage.local.getItem(LOCAL_STORAGE.BASKET);
    const items = getProp(basketData, 'items', []);

    return items.map(item => item.sku.productId);
}

/**
 *
 * @param {*} basket
 * @returns Boolean
 *
 * Sift through basket to find if there is a SEPHORA COLLECTION item
 */
function basketHasSephoraCollection(basket) {
    return basket.items.some(item => item.sku?.brandName === 'SEPHORA COLLECTION');
}

export default {
    getCartInfo,
    getTargetUrl,
    getPaymentInfo,
    getMessageInfo,
    getItemSddBopisAvailability,
    getUserSDUStatus,
    getBiBenefitsInfo,
    getGiftCardInfo,
    getRemainingBalanceMessage,
    findBasketTypeBySkuId,
    applyTopLevelBackground,
    applyShowBasketGreyBackgroundToProductLists,
    getProductIdsFromStandardBasket,
    basketHasSephoraCollection
};
