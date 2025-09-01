import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Payment from 'components/FrictionlessCheckout/Payment/Payment';
import orderUtils from 'utils/Order';
import paymentOptionsSelector from 'selectors/order/paymentOptionsSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import checkoutUtils from 'utils/Checkout';
import pazeSelector from 'selectors/paze/pazeSelector';
import klarnaSelector from 'selectors/klarna/klarnaSelector';
import afterpaySelector from 'selectors/afterpay/afterpaySelector';
import venmoSelector from 'selectors/venmo/venmoSelector';
import { checkSelectedPayment, getCreditCards } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import skuHelpers from 'utils/skuHelpers';
import { PAYMENT_TYPES } from 'constants/RwdBasket';
import orderErrorsSelector from 'selectors/order/orderErrorsSelector';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';
import Actions from 'Actions';
import activeCheckoutSectionSelector from 'selectors/order/activeCheckoutSectionSelector';
import OrderActions from 'actions/OrderActions';
import { commonOrderToggleActions } from 'components/FrictionlessCheckout/checkoutService/checkoutCommonActions';

const { showInfoModal } = Actions;

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/locales', 'Payment');

const localization = createStructuredSelector({
    cardTitle: getTextFromResource(getText, 'cardTitle'),
    expires: getTextFromResource(getText, 'expires'),
    useGiftCard: getTextFromResource(getText, 'useGiftCard'),
    maxGiftCards: getTextFromResource(getText, 'maxGiftCards'),
    giftCard: getTextFromResource(getText, 'giftCard'),
    applied: getTextFromResource(getText, 'applied'),
    remove: getTextFromResource(getText, 'remove'),
    secure: getTextFromResource(getText, 'secure'),
    verifyCVV: getTextFromResource(getText, 'verifyCVV'),
    accountCredit: getTextFromResource(getText, 'accountCredit'),
    giftCardsNotCombinable: getTextFromResource(getText, 'giftCardsNotCombinable'),
    paymentMethodSelection: getTextFromResource(getText, 'paymentMethodSelection'),
    somePaymentCannotUsed: getTextFromResource(getText, 'somePaymentCannotUsed')
});

const paymentMethodCondition = isNewUserFlow => {
    return !isNewUserFlow || checkoutUtils.isGuestOrder();
};

const getAvailablePaymentMethods = (orderDetails, isNewUserFlow, klarnaError) => {
    const isKlarnaEnabledForThisOrder = orderUtils.isKlarnaEnabledForThisOrder(orderDetails) && !klarnaError && paymentMethodCondition(isNewUserFlow);
    const isAfterpayEnabledForThisOrder = orderUtils.isAfterpayEnabledForThisOrder(orderDetails) && paymentMethodCondition(isNewUserFlow);
    const isPazeEnabledForThisOrder = orderUtils.isPazeEnabledForThisOrder(orderDetails) && paymentMethodCondition(isNewUserFlow);
    const isVenmoEnabledForThisOrder = orderUtils.isVenmoEnabledForThisOrder(orderDetails) && paymentMethodCondition(isNewUserFlow);
    const isAfterpayEnabledForThisProfile = checkoutUtils.isAfterpayEnabledForThisProfile(orderDetails);
    const isPayPalEnabled = orderUtils.isPayPalEnabled(orderDetails);

    return {
        isAfterpayEnabledForThisOrder,
        isAfterpayEnabledForThisProfile,
        isPayPalEnabled,
        isKlarnaEnabledForThisOrder,
        isPazeEnabledForThisOrder,
        isVenmoEnabledForThisOrder
    };
};

const getGiftCardPaymentGroup = paymentGroups => {
    return (paymentGroups?.paymentGroupsEntries || []).filter(group => group.paymentGroupType === orderUtils.PAYMENT_GROUP_TYPE.GIFT_CARD);
};

const checkIfAlternateMethodSelected = (afterpay, klarna, paze, venmo) => {
    return afterpay.isSelected || klarna.isSelected || paze.isSelected || venmo.isSelected;
};

const getAlternatePaymentName = (afterpay, klarna, venmo, paze) => {
    let alternatePaymentName = '';

    if (afterpay.isSelected) {
        alternatePaymentName = PAYMENT_TYPES.PAY_AFTERPAY;
    } else if (klarna.isSelected) {
        alternatePaymentName = PAYMENT_TYPES.PAY_KLARNA;
    } else if (venmo.isSelected) {
        alternatePaymentName = PAYMENT_TYPES.PAY_VENMO;
    } else if (paze.isSelected) {
        alternatePaymentName = PAYMENT_TYPES.PAY_PAZE;
    }

    return alternatePaymentName;
};

const getInstallment = orderDetails => {
    const amount = orderDetails.priceInfo?.creditCardAmount || orderDetails.priceInfo.paypalAmount;
    const [installmentValue] = skuHelpers.formatInstallmentValue(amount);

    return installmentValue;
};

const checkGiftCardAmountEqualsOrderTotal = priceInfo => {
    return priceInfo?.giftCardAmount && priceInfo?.giftCardAmount === priceInfo?.orderTotal;
};

const checkIsAltenateMethodDefaultPayment = (alternatePaymentName, defaultPayment) => {
    return (
        (alternatePaymentName === PAYMENT_TYPES.PAY_AFTERPAY && defaultPayment === 'afterpay') ||
        (alternatePaymentName === PAYMENT_TYPES.PAY_KLARNA && defaultPayment === 'klarna') ||
        (alternatePaymentName === PAYMENT_TYPES.PAY_VENMO && defaultPayment === 'venmo')
    );
};

const fields = createSelector(
    localization,
    paymentOptionsSelector,
    orderDetailsSelector,
    pazeSelector,
    klarnaSelector,
    afterpaySelector,
    venmoSelector,
    orderErrorsSelector,
    activeCheckoutSectionSelector,
    (_ownState, ownProps) => ownProps.isNewUserFlow,
    (_ownState, ownProps) => ownProps.zeroDollarHigherRedeemPointsCVV,
    (
        locale,
        paymentOptions,
        orderDetails,
        paze,
        klarna,
        afterpay,
        venmo,
        sectionErrors,
        activeSection,
        isNewUserFlow,
        zeroDollarHigherRedeemPointsCVV
    ) => {
        const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails);
        const storeCredits = orderUtils.getStoreCredits(orderDetails);
        const isPaymentComplete = checkoutUtils.isPaymentInOrderComplete();
        const giftCardPaymentGroups = getGiftCardPaymentGroup(orderDetails.paymentGroups);
        const availablePaymentMethods = getAvailablePaymentMethods(orderDetails, isNewUserFlow, klarna.error);
        const payPalPaymentGroup = orderUtils.getPayPalPaymentGroup(orderDetails) || { isComplete: false };
        const venmoUsername = orderUtils.getPaymentGroup(orderDetails, 'VenmoPaymentGroup')?.username;
        const isPayPalEnabled = orderUtils.isPayPalEnabled(orderDetails);
        const showErrorIcon = checkoutUtils.renderFrictionlessPaymentErrorView() || zeroDollarHigherRedeemPointsCVV;
        const alternatePaymentName = getAlternatePaymentName(afterpay, klarna, venmo, paze);
        const physicalGiftCardShippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);
        const hardGoodShippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
        const isPhysicalGiftCardOnly = physicalGiftCardShippingGroup && !hardGoodShippingGroup;
        const isZeroCheckout = orderUtils.isZeroCheckout();
        const shouldRenderGiftCardSection = !isPhysicalGiftCardOnly && !isZeroCheckout;
        const paymentSectionError = sectionErrors?.[SECTION_NAMES.PAYMENT];
        const sectionLevelError =
            (paymentSectionError?.length || (typeof paymentSectionError === 'boolean' && paymentSectionError)) && paymentSectionError;

        const tmpCardMessage = orderUtils.getTempSephoraCardMessage();
        const gcAmountNotEnoughMessage = checkoutUtils.getGiftCardAmountNotEnoughMessage(orderDetails?.paymentGroups?.paymentMessages);
        const isPhysicalGiftCardAndHardGoodShippingGroup = !!physicalGiftCardShippingGroup && !!hardGoodShippingGroup;
        const giftCardAmountEqualsOrderTotal = checkGiftCardAmountEqualsOrderTotal(orderDetails?.priceInfo);

        return {
            localization: locale,
            orderDetails,
            paymentOptions,
            creditCardPaymentGroup,
            isPaymentComplete,
            storeCredits,
            giftCardPaymentGroups,
            alternateMethodSelected: checkIfAlternateMethodSelected(afterpay, klarna, paze, venmo),
            checkSelectedPayment: checkSelectedPayment(paymentOptions, availablePaymentMethods),
            availablePaymentMethods,
            isPaypalSelected: isPayPalEnabled && payPalPaymentGroup.isComplete,
            payPalPaymentGroup,
            venmoUsername,
            alternatePaymentName,
            installmentValue: getInstallment(orderDetails),
            isCombinableGiftCards: alternatePaymentName.length === 0 || alternatePaymentName === PAYMENT_TYPES.PAY_VENMO,
            isAlternateMethodDefaultPayment: checkIsAltenateMethodDefaultPayment(alternatePaymentName, paymentOptions?.defaultPayment),
            showErrorIcon,
            shouldRenderGiftCardSection,
            sectionLevelError,
            tmpCardMessage,
            activeSection,
            getCreditCards,
            orderId: orderDetails?.header?.orderId,
            gcAmountNotEnoughMessage,
            isPhysicalGiftCardOnly,
            isPhysicalGiftCardAndHardGoodShippingGroup,
            giftCardAmountEqualsOrderTotal
        };
    }
);

const withPaymentProps = wrapHOC(
    connect(fields, {
        showInfoModal,
        setActiveSection: OrderActions.setCheckoutActiveSection,
        setCheckoutSectionErrors: OrderActions.setCheckoutSectionErrors,
        clearCheckoutSectionErrors: OrderActions.clearCheckoutSectionErrors,
        commonOrderToggleActions
    })
);

export default withPaymentProps(Payment);
