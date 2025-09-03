import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import userUtils from 'utils/User';
import CostSummary from 'components/FrictionlessCheckout/CostSummary/CostSummary';
import { userSelector } from 'selectors/user/userSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import rwdBasketUtils from 'utils/RwdBasket';
import ApplePay from 'services/ApplePay';
import localeUtils from 'utils/LanguageLocale';
import Actions from 'Actions';
import PayPal from 'utils/PayPal';
import promoUtils from 'utils/Promos';
import skuUtils from 'utils/Sku';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';
import baskeUtils from 'utils/Basket';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/CostSummary/locales', 'CostSummary');

const { TYPES } = PayPal;

const { getUserSDUStatus } = rwdBasketUtils;

const { wrapHOC } = FrameworkUtils;

function calculateFreeShipping({
    isBIUser, isSignedIn, isSameDayOrder, hasMetFreeShippingThreshhold, isUserSDUMember
}) {
    if (isSameDayOrder && !isUserSDUMember) {
        return false;
    }

    if ((isBIUser && isSignedIn) || hasMetFreeShippingThreshhold) {
        return true;
    }

    return false;
}

function getPayPalPaymentStatus({ isPaypalPaymentEnabled, items }) {
    const shippingCountry = userUtils.getShippingCountry().countryCode;
    const isEligiblePayPalShippingCountry = shippingCountry === localeUtils.COUNTRIES.US || shippingCountry === localeUtils.COUNTRIES.CA;
    const isPaypalRestricted = !items?.length || items?.some(item => item.sku.isPaypalRestricted);
    const isPayPayKillSwitchEnabled = Sephora.configurationSettings.isPayPalEnabled;

    const isPayPalEnabled = isPaypalPaymentEnabled && isEligiblePayPalShippingCountry && !isPaypalRestricted && isPayPayKillSwitchEnabled;

    return isPayPalEnabled ? TYPES.ENABLED : false;
}

const calculateMerchandiseSubtotal = ({ merchandiseSubtotal, giftCardSubtotal }) => {
    const { removeCurrency, getCurrency } = baskeUtils;

    if (!giftCardSubtotal) {
        return merchandiseSubtotal;
    } else if (!merchandiseSubtotal) {
        return giftCardSubtotal;
    }

    const amount = Number(removeCurrency(merchandiseSubtotal)) + Number(removeCurrency(giftCardSubtotal));

    return getCurrency(merchandiseSubtotal) + Number(amount).toFixed(2);
};

function hasSubstituteItemsInBasket(items) {
    return items?.some(item => item.substituteSku);
}

const localization = createStructuredSelector({
    placeOrder: getTextFromResource(getText, 'placeOrder'),
    continue: getTextFromResource(getText, 'continue'),
    reviewTerms: getTextFromResource(getText, 'reviewTerms'),
    estimatedTotal: getTextFromResource(getText, 'estimatedTotal'),
    sddSubstituteDisclaimer: getTextFromResource(getText, 'sddSubstituteDisclaimer'),
    temporarilyAuthorized: getTextFromResource(getText, 'temporarilyAuthorized'),
    forText: getTextFromResource(getText, 'forText'),
    seeFullTerms: getTextFromResource(getText, 'seeFullTerms'),
    orderCostSummaryText: getTextFromResource(getText, 'orderCostSummaryText'),
    orderTotalAndPlaceOrderSection: getTextFromResource(getText, 'orderTotalAndPlaceOrderSection')
});

const getPlaceOrderLabel = (locales, orderDetails, isSDUItemInBasket) => {
    const isAutoReplenishBasket = orderUtils.hasAutoReplenishItems(orderDetails);

    if (Sephora.isAgent) {
        if (isAutoReplenishBasket || isSDUItemInBasket) {
            return locales.reviewTerms;
        }
    }

    return isAutoReplenishBasket ? locales.continue : locales.placeOrder;
};

const fields = createSelector(userSelector, orderDetailsSelector, localization, (user, orderDetails, locales) => {
    const { isUserSDUMember } = getUserSDUStatus(user.userSubscriptions);
    let isApplePayEnabled;

    ApplePay.getApplePaymentType(orderDetails).then(applePayType => {
        isApplePayEnabled = applePayType !== ApplePay.TYPES.HIDDEN;
    });

    const {
        isAfterpayCheckoutEnabled, isAfterpayEnabledForProfile, isKlarnaCheckoutEnabled, isPayPalPayLaterEligible, isBopisOrder
    } =
        orderDetails.header || {};
    const {
        bagFeeSubtotal, orderTotalWithoutDiscount, orderTotal, merchandiseSubtotal, giftCardSubtotal, storeCardAmount, creditCardAmount
    } =
        orderDetails.priceInfo || {};
    const isSDUItemInBasket = skuUtils.isSDU(orderDetails?.items?.items?.[0]?.sku);

    const isRougeRewardsApplied =
        (orderDetails.promotion.appliedPromotions?.filter(promo => promo.sephoraPromotionType === promoUtils.CTA_TYPES.RRC) || []).length > 0;

    const rawSubTotal = calculateMerchandiseSubtotal({ merchandiseSubtotal, giftCardSubtotal });

    return {
        isSignedIn: user.isInitialized && !userUtils.isAnonymous(),
        isBIUser: user.beautyInsiderAccount?.vibSegment != null,
        rawSubTotal: rawSubTotal,
        redeemedBiPoints: orderDetails.items.redeemedBiPoints,
        replenishmentDiscountAmount: orderDetails.items.replenishmentDiscountAmount || orderDetails.items.totalAnnualReplenishmentDiscount,
        discountAmount: orderDetails.items.discountAmount,
        bagFeeSubTotal: bagFeeSubtotal,
        showShippingAndHandling: !isBopisOrder,
        showPickupFree: isBopisOrder,
        showBagFeeSubTotal: isBopisOrder,
        userHasFreeShipping: calculateFreeShipping({
            isBIUser: user.beautyInsiderAccount?.vibSegment != null,
            isSignedIn: user.isInitialized && !userUtils.isAnonymous(),
            isSameDayOrder: orderDetails.header.isSameDayOrder,
            isUserSDUMember,
            hasMetFreeShippingThreshhold: orderDetails.items.remainToFreeShipping
        }),
        priceInfo: orderDetails.priceInfo,
        isApplePayEnabled,
        isPaypalPayment: getPayPalPaymentStatus(orderDetails.header.isPaypalPaymentEnabled, orderDetails.items?.items),
        isBopis: orderDetails.header.isBopisOrder,
        isAfterpayCheckoutEnabled,
        isAfterpayEnabledForProfile,
        isKlarnaCheckoutEnabled,
        grossSubTotal: orderTotalWithoutDiscount,
        subtotal: orderTotal,
        totalItems: orderDetails.items?.itemCount,
        firstBuyDiscountTotal: orderDetails.items?.firstBuyDiscountTotal,
        hasPickupSubstituteItems: hasSubstituteItemsInBasket(orderDetails.pickup?.items),
        hasSameDaySubstituteItems: orderDetails.header.isSameDayOrder && hasSubstituteItemsInBasket(orderDetails.items?.items),
        isSDUItemInBasket,
        isUserSDUMember,
        isSDUOnlyInBasket: orderDetails.items.length === 1 && isSDUItemInBasket,
        isPayPalPayLaterEligible,
        isRougeRewardsApplied,
        locales: {
            ...locales,
            bopisIncreasedAuthorizationWarning: getText('bopisIncreasedAuthorizationWarning', [orderDetails?.priceInfo?.maxAmountToBeAuthorized])
        },
        placeOrderLabel: getPlaceOrderLabel(locales, orderDetails, isSDUItemInBasket),
        storeCardAmount,
        creditCardAmount
    };
});

const functions = {
    showSDUAgreementModal: Actions.showSDUAgreementModal
};

const withCostSummaryProps = wrapHOC(connect(fields, functions));

export default withCostSummaryProps(CostSummary);
