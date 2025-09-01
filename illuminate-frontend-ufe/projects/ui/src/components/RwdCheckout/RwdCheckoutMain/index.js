import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import basketConstants from 'constants/Basket';
const { GIFT_MESSAGE_STATUS } = basketConstants;

import RwdCheckoutMain from 'components/RwdCheckout/RwdCheckoutMain/RwdCheckoutMain';

import LanguageLocaleUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';

import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import orderShippingMethodsSelector from 'selectors/order/orderShippingMethods/orderShippingMethodsSelector';
import addressListSelector from 'selectors/order/addressListSelector';
import isApplePayFlowSelector from 'selectors/order/isApplePayFlowSelector';
import klarnaSelector from 'selectors/klarna/klarnaSelector';
import venmoSelector from 'selectors/venmo/venmoSelector';
import afterpaySelector from 'selectors/afterpay/afterpaySelector';
import pazeSelector from 'selectors/paze/pazeSelector';
import bankRewardsValidPaymentsMessageSelector from 'selectors/order/bankRewardsValidPaymentsMessageSelector';
import paymentOptionsSelector from 'selectors/order/paymentOptionsSelector';
import basketSelector from 'selectors/basket/basketSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import {
    resetAccessPoint,
    changeRoute,
    createDraftHalAddress,
    checkSelectedPayment,
    orderReviewIsActive,
    sectionSaveSubscription,
    orderDetailChanges
} from 'components/RwdCheckout/RwdCheckoutMain/checkoutActionWrappers';
import {
    refreshCheckout,
    getAddressList,
    getOrderPayments,
    getCapElibility,
    getShippingMethods
} from 'components/RwdCheckout/RwdCheckoutMain/checkoutService';
import historyLocationSelector from 'selectors/historyLocation/historyLocationSelector';
import testTargetSelector from 'selectors/testTarget/testTargetSelector';
import Empty from 'constants/empty';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/RwdCheckoutMain/locales', 'RwdCheckoutMain');
const getAccordionSectionText = getLocaleResourceFile('components/RwdCheckout/AccordionSection/locales', 'AccordionSection');

const localization = createStructuredSelector({
    bopisTitle: getTextFromResource(getText, 'bopisTitle'),
    sadTitle: getTextFromResource(getText, 'sadTitle'),
    pickupOrderCheckout: getTextFromResource(getText, 'pickupOrderCheckout'),
    checkout: getTextFromResource(getText, 'checkout'),
    reviewAndPlaceOrder: getTextFromResource(getText, 'reviewAndPlaceOrder'),
    deliverToNoteAutoReplenish: getTextFromResource(getAccordionSectionText, 'deliverToNoteAutoReplenish'),
    yourGiftCardShippedToAddressMessage: getTextFromResource(getText, 'yourGiftCardShippedToAddressMessage'),
    shippedToAddressMessage: getTextFromResource(getText, 'shippedToAddressMessage')
});

const isPlaceOrderDisabledSelector = createSelector(orderSelector, order => order.isPlaceOrderDisabled);
const isCAPAvailableSelector = createSelector(orderSelector, order => order.isCAPAvailable);
const abTestingOffersSelector = createSelector(testTargetSelector, target => target.offers || Empty.Object);

const fields = createSelector(
    orderDetailsSelector,
    orderShippingMethodsSelector,
    addressListSelector,
    isApplePayFlowSelector,
    klarnaSelector,
    afterpaySelector,
    pazeSelector,
    venmoSelector,
    bankRewardsValidPaymentsMessageSelector,
    paymentOptionsSelector,
    localization,
    isPlaceOrderDisabledSelector,
    basketSelector,
    isCAPAvailableSelector,
    historyLocationSelector,
    isTestTargetReadySelector,
    abTestingOffersSelector,
    (
        orderDetails,
        orderShippingMethods,
        addressList,
        isApplePayFlow,
        klarna,
        afterpay,
        paze,
        venmo,
        bankRewardsValidPaymentsMessage,
        paymentOptions,
        locale,
        isPlaceOrderDisabled,
        basket,
        isCAPAvailable,
        historyLocation,
        isTestTargetReady,
        abTestingOffers
    ) => {
        const isBopisOrder = orderDetails?.header?.isBopisOrder;
        const hardGoodShippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
        const isZeroCheckout = orderUtils.isZeroCheckout();
        const isHalAvailable = orderDetails?.header?.isHalAvailable;
        const isSdd = orderUtils.hasSameDayDeliveryItems(orderDetails);
        const isAutoReplenishBasket = orderUtils.hasAutoReplenishItems(orderDetails);
        const isGis = orderUtils.hasStandardDeliveryItems(orderDetails) && orderUtils.hasStandardNonAutoReplenishItems(orderDetails);
        const isGiftCardAvailable =
            orderDetails?.header?.digitalGiftMessagingStatus !== GIFT_MESSAGE_STATUS.NOT_AVAILABLE && !isBopisOrder && !isAutoReplenishBasket;

        return {
            isBopisOrder,
            hardGoodShippingGroup,
            isZeroCheckout,
            isHalAvailable,
            isSdd,
            isAutoReplenishBasket,
            isGis,
            localization: locale,
            isGiftCardAvailable,
            orderShippingMethods,
            addressList,
            isApplePayFlow,
            isKlarnaSelected: klarna.isSelected,
            isAfterpaySelected: afterpay.isSelected,
            isPazeSelected: paze.isSelected,
            isVenmoSelected: venmo.isSelected,
            bankRewardsValidPaymentsMessage,
            paymentOptions,
            orderDetails,
            getAccordionSectionText,
            resetAccessPoint,
            createDraftHalAddress,
            changeRoute,
            getAddressList,
            getOrderPayments,
            getShippingMethods,
            checkSelectedPayment: checkSelectedPayment(paymentOptions),
            refreshCheckout,
            orderReviewIsActive,
            getCapElibility,
            isPlaceOrderDisabled,
            basketPromotions: isBopisOrder ? basket?.pickupBasket?.appliedPromotions : basket?.appliedPromotions,
            afterpayError: afterpay.error,
            klarnaError: klarna.error,
            isCAPAvailable,
            orderDetailChanges,
            historyLocation,
            isTestTargetReady,
            abTestingOffers,
            sectionSaveSubscription,
            ...(isGiftCardAvailable && {
                orderId: orderDetails?.header?.orderId,
                giftMessagingStatus: orderDetails?.header?.digitalGiftMessagingStatus
            })
        };
    }
);

const withRwdCheckoutMainProps = wrapHOC(connect(fields, null));

export default withRwdCheckoutMainProps(RwdCheckoutMain);
