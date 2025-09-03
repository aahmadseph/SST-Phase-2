import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import basketConstants from 'constants/Basket';
import store from 'store/Store';
import basket from 'reducers/addToBasket';
import basketUtils from 'utils/Basket';
import checkoutUtils from 'utils/Checkout';
import paymentOptionsSelector from 'selectors/order/paymentOptionsSelector';
import Actions from 'Actions';
import FrictionlessCheckout from 'components/FrictionlessCheckout/FrictionlessCheckout';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';
import { orderSelector } from 'selectors/order/orderSelector';
import { refreshCheckout } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import Empty from 'constants/empty';

const { showInfoModal } = Actions;
const { GIFT_MESSAGE_STATUS } = basketConstants;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/locales', 'FrictionlessCheckout');

const localization = createStructuredSelector({
    bopisTitle: getTextFromResource(getText, 'bopisTitle'),
    sadTitle: getTextFromResource(getText, 'sadTitle')
});

const { ACTION_TYPES } = basket;
const { SHIPPING_GROUPS } = orderUtils;
const REEDMED_BIPOINTS = 750;

const creditCardsSelector = createSelector(paymentOptionsSelector, paymentOptions => paymentOptions?.creditCards || Empty.Array);
const isCAPAvailableSelector = createSelector(orderSelector, order => order.isCAPAvailable);

const basketUpdated = () => {
    return store.watchAction(ACTION_TYPES.UPDATE_BASKET, () => {
        refreshCheckout()();
    });
};

const disablePlaceOrder = () => checkoutUtils.disablePlaceOrderButtonBasedOnCheckoutCompleteness();

const isHigherReedeemPoints = (redeemedBiPoints, isBopisOrder) =>
    redeemedBiPoints >= REEDMED_BIPOINTS && orderUtils.isZeroCheckout() && !isBopisOrder;

const validateZeroOrderWithCVVAndRedeemPoints = (higherRedeemPoints, isZeroDollarOrderWithCVVValidation) => {
    const zeroDollarHigherRedeemPointsCVV = higherRedeemPoints && isZeroDollarOrderWithCVVValidation;
    const zeroDollarHigherRedeemPointsNotCVV = higherRedeemPoints && !isZeroDollarOrderWithCVVValidation;

    return { zeroDollarHigherRedeemPointsCVV, zeroDollarHigherRedeemPointsNotCVV };
};

const fields = createSelector(
    orderDetailsSelector,
    creditCardsSelector,
    localization,
    isCAPAvailableSelector,
    // eslint-disable-next-line complexity
    (orderDetails, creditCards, locale, isCAPAvailable) => {
        const isBopisOrder = orderDetails?.header?.isBopisOrder;
        const hardGoodShippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
        const isZeroCheckout = orderUtils.isZeroCheckout();
        const isHalAvailable = orderDetails?.header?.isHalAvailable;
        const isSdd = orderUtils.hasSameDayDeliveryItems(orderDetails);
        const isAutoReplenishBasket = orderUtils.hasAutoReplenishItems(orderDetails);
        const isGis = orderUtils.hasStandardDeliveryItems(orderDetails) && orderUtils.hasStandardNonAutoReplenishItems(orderDetails);
        const isGiftCardAvailable =
            orderDetails?.header?.digitalGiftMessagingStatus !== GIFT_MESSAGE_STATUS.NOT_AVAILABLE && !isBopisOrder && !isAutoReplenishBasket;
        const hasRRC = orderUtils.hasRRC(orderDetails);
        const hasCCR = orderUtils.hasCCR(orderDetails);
        const hasAutoReplenishment = orderUtils.hasAutoReplenishItems(orderDetails);
        const isCBRPromoAppliedInBasket = basketUtils.isCBRPromoAppliedInBasket();
        const isSDUOnlyOrder = orderUtils.isSDUOnlyOrder(orderDetails);
        const hasSDUOnlyInSddBasket = orderUtils.hasSDUOnlyInSddBasket(orderDetails);
        const hasStandardItems = orderUtils.hasStandardDeliveryItems(orderDetails);
        let sameDayShippingGroup =
            !isSDUOnlyOrder && (hasSDUOnlyInSddBasket || hasStandardItems)
                ? orderDetails.shippingGroups.shippingGroupsEntries.find(
                    group => group.shippingGroupType !== SHIPPING_GROUPS.SDU_ELECTRONIC && group.shippingGroupType !== SHIPPING_GROUPS.SAME_DAY
                )
                : orderDetails.shippingGroups?.shippingGroupsEntries?.find(group => group.shippingGroupType === SHIPPING_GROUPS.SAME_DAY);
        const isElectronicShippingGroup = sameDayShippingGroup && orderUtils.isElectronicShippingGroup(sameDayShippingGroup);
        const hasSDUInBasket = orderUtils.hasSDUInBasket(orderDetails);
        const physicalGiftCardShippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);
        const hardGoodOrGiftCardShippingGroup = hardGoodShippingGroup || physicalGiftCardShippingGroup;
        const isChangePermittedForShippingMethods = !isSdd || (isSdd && hasSDUOnlyInSddBasket);
        const hardGoodAddressComplete = hasStandardItems && hardGoodShippingGroup?.isComplete;
        const sddAddressComplete = isSdd && !hasSDUOnlyInSddBasket && sameDayShippingGroup?.shippingGroup?.isComplete;
        const giftCardAddressComplete = physicalGiftCardShippingGroup?.isComplete;
        const isShippableOrder = orderUtils.isShippableOrder(orderDetails);
        const isNewUserFlow = isShippableOrder && !(hardGoodAddressComplete || sddAddressComplete || giftCardAddressComplete);
        const isZeroDollarOrderWithCVVValidation = orderUtils.isZeroDollarOrderWithCVVValidation();
        const orderHasPhysicalGiftCard = !!physicalGiftCardShippingGroup;
        const isGuestCheckout = checkoutUtils.isGuestOrder();
        const higherRedeemPoints = isHigherReedeemPoints(orderDetails?.items?.redeemedBiPoints, isBopisOrder);
        const { zeroDollarHigherRedeemPointsCVV, zeroDollarHigherRedeemPointsNotCVV } = validateZeroOrderWithCVVAndRedeemPoints(
            higherRedeemPoints,
            isZeroDollarOrderWithCVVValidation
        );
        const isEfullfillmentOrder = !isShippableOrder && isZeroCheckout;

        const shouldRenderPayment = () => {
            if (
                !isZeroCheckout ||
                (isZeroCheckout && hasRRC) ||
                (isZeroCheckout && hasCCR) ||
                hasAutoReplenishment ||
                isCBRPromoAppliedInBasket ||
                isZeroDollarOrderWithCVVValidation ||
                (zeroDollarHigherRedeemPointsNotCVV && !creditCards.length)
            ) {
                return true;
            }

            if (isSdd && (!isZeroCheckout || isSDUOnlyOrder || hasAutoReplenishment || hasSDUInBasket || isElectronicShippingGroup)) {
                return true;
            }

            return false;
        };

        const displayHalAvailability = orderUtils.isHalAvailable(isHalAvailable, isCAPAvailable);

        if (isElectronicShippingGroup && isSdd) {
            sameDayShippingGroup = orderDetails.shippingGroups?.shippingGroupsEntries?.find(
                group => group.shippingGroupType === SHIPPING_GROUPS.SAME_DAY
            );
        }

        return {
            isBopisOrder,
            hardGoodShippingGroup,
            isZeroCheckout,
            isHalAvailable: displayHalAvailability,
            isSdd,
            isAutoReplenishBasket,
            isGis,
            isNewUserFlow,
            localization: locale,
            isGiftCardAvailable,
            hasRRC,
            isSDUOnlyOrder,
            isElectronicShippingGroup,
            hasSDUInBasket,
            sameDayShippingGroup,
            hardGoodOrGiftCardShippingGroup,
            physicalGiftCardShippingGroup,
            hasStandardItems,
            isChangePermittedForShippingMethods,
            ...(isGiftCardAvailable && {
                orderId: orderDetails?.header?.orderId,
                giftMessagingStatus: orderDetails?.header?.digitalGiftMessagingStatus
            }),
            basketUpdated,
            shouldRenderPayment: shouldRenderPayment(),
            orderDetails,
            disablePlaceOrder,
            isShippableOrder,
            hasSDUOnlyInSddBasket,
            orderHasPhysicalGiftCard,
            isGuestCheckout,
            zeroDollarHigherRedeemPointsCVV,
            zeroDollarHigherRedeemPointsNotCVV,
            isEfullfillmentOrder,
            creditCardsCount: creditCards.length
        };
    }
);

const functions = {
    showInfoModal
};

const withFrictionlessCheckoutProps = wrapHOC(connect(fields, functions));

export default withFrictionlessCheckoutProps(FrictionlessCheckout);
