import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Paypal from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Paypal/Paypal';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import priceInfoSelector from 'selectors/order/orderDetails/priceInfo/priceInfoSelector';
import klarnaSelector from 'selectors/klarna/klarnaSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import checkoutUtils from 'utils/Checkout';
import orderUtils from 'utils/Order';
import Empty from 'constants/empty';
import paymentOptionsSelector from 'selectors/order/paymentOptionsSelector';
import { payPalWithInterstice } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import {
    commonOrderToggleActions,
    updatePaymentActions,
    sectionSaveOrderAction
} from 'components/FrictionlessCheckout/checkoutService/checkoutCommonActions';
import OrderActions from 'actions/OrderActions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/locales', 'Payment');

const applePayFlowSelector = createSelector(orderSelector, order => order.isApplePayFlow);
const klarnaSelectorErrorSelector = createSelector(klarnaSelector, klarna => klarna.error || Empty.object);

const functions = {
    updatePaymentActions,
    commonOrderToggleActions,
    sectionSaveOrderAction,
    setCheckoutSectionErrors: OrderActions.setCheckoutSectionErrors
};

const localizationSelector = createStructuredSelector({
    paypalRestrictedItemError: getTextFromResource(getText, 'paypalRestrictedItemError'),
    payPalAccount: getTextFromResource(getText, 'payPalAccount'),
    payWithPayPal: getTextFromResource(getText, 'payWithPayPal'),
    payNow: getTextFromResource(getText, 'payNow'),
    or: getTextFromResource(getText, 'or'),
    payLaterWithPayPal: getTextFromResource(getText, 'payLaterWithPayPal'),
    payPalDisabled: getTextFromResource(getText, 'payPalDisabled')
});

const fields = createSelector(
    orderDetailsSelector,
    priceInfoSelector,
    applePayFlowSelector,
    klarnaSelectorErrorSelector,
    paymentOptionsSelector,
    localizationSelector,
    (_ownState, ownProps) => ownProps.isNewUserFlow,
    (orderDetails, priceInfo, isApplePayFlow, klarnaError, paymentOptions, localization) => {
        const isPayPalEnabled = orderUtils.isPayPalEnabled(orderDetails);
        const isZeroCheckout = orderUtils.isZeroCheckout();
        const isPayPalPayLaterEligible = orderDetails?.items?.isPayPalPayLaterEligible;
        const isGUestOrder = checkoutUtils.isGuestOrder();
        const hasSavedPaypal = !orderUtils.userHasSavedPayPalAccount(orderDetails);
        const showSavePaypalCheckbox = Sephora.configurationSettings.payPalConfigurations?.retrievePaypalFromProfileEnabled && hasSavedPaypal;
        const hasSDUInBasket = orderUtils.hasSDUInBasket(orderDetails);

        return {
            orderDetails,
            priceInfo,
            isApplePayFlow,
            klarnaError,
            isZeroCheckout,
            paymentOptions,
            isPayPalPayLaterEligible,
            isGUestOrder,
            isPayPalEnabled,
            localization,
            payPalWithInterstice,
            showSavePaypalCheckbox,
            hasSDUInBasket
        };
    }
);

const withPaymentMethodListToProps = wrapHOC(connect(fields, functions));

export default withPaymentMethodListToProps(Paypal);
