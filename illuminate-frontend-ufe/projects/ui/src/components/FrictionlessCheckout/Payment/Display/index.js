import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import PaymentDisplay from 'components/FrictionlessCheckout/Payment/Display/PaymentDisplay';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/Display/locales', 'PaymentDisplay');

const localization = createStructuredSelector({
    defaultCard: getTextFromResource(getText, 'defaultCard'),
    expires: getTextFromResource(getText, 'expires'),
    payPalAccount: getTextFromResource(getText, 'payPalAccount'),
    payWithPayPal: getTextFromResource(getText, 'payWithPayPal'),
    payNow: getTextFromResource(getText, 'payNow'),
    or: getTextFromResource(getText, 'or'),
    payLaterWithPayPal: getTextFromResource(getText, 'payLaterWithPayPal'),
    payWithApplePay: getTextFromResource(getText, 'payWithApplePay'),
    payWithKlarna: getTextFromResource(getText, 'payWithKlarna', ['{0}']),
    payWithAfterpay: getTextFromResource(getText, 'payWithAfterpay', ['{0}']),
    payWithPaze: getTextFromResource(getText, 'payWithPaze'),
    storeCreditApplied: getTextFromResource(getText, 'storeCreditApplied'),
    endingIn: getTextFromResource(getText, 'endingIn'),
    paymentDisabled: getTextFromResource(getText, 'paymentDisabled', ['{0}', '{1}']),
    payPalDisabled: getTextFromResource(getText, 'payPalDisabled'),
    payPalUnavailable: getTextFromResource(getText, 'payPalUnavailable'),
    paymentGiftCardMessage: getTextFromResource(getText, 'paymentGiftCardMessage', ['{0}']),
    payzeAvailabilty: getTextFromResource(getText, 'payzeAvailabilty'),
    pazeErrorMessage: getTextFromResource(getText, 'pazeErrorMessage'),
    pazeErrorTitle: getTextFromResource(getText, 'pazeErrorTitle'),
    pazeErrorOk: getTextFromResource(getText, 'pazeErrorOk'),
    pazePolicy: getTextFromResource(getText, 'pazePolicy'),
    payWithVenmo: getTextFromResource(getText, 'payWithVenmo'),
    defaultPayment: getTextFromResource(getText, 'defaultPayment'),
    venmoDisabled: getTextFromResource(getText, 'venmoDisabled'),
    pazePaymentDisabled: getTextFromResource(getText, 'pazePaymentDisabled')
});

const fields = createSelector(localization, orderItemsSelector, (locales, orderItems) => {
    return {
        locales,
        isKlarnaCheckoutEnabled: orderItems.isKlarnaCheckoutEnabled
    };
});

const withPaymentDisplayProps = wrapHOC(connect(fields, null));

export default withPaymentDisplayProps(PaymentDisplay);
