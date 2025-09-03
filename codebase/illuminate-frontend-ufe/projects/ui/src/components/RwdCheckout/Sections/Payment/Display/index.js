import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import PaymentDisplay from 'components/RwdCheckout/Sections/Payment/Display/PaymentDisplay';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/Display/locales', 'PaymentDisplay');

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
    payWithVenmo: getTextFromResource(getText, 'payWithVenmo', ['{0}']),
    payWithPaze: getTextFromResource(getText, 'payWithPaze'),
    venmoDisabled: getTextFromResource(getText, 'venmoDisabled'),
    storeCreditApplied: getTextFromResource(getText, 'storeCreditApplied'),
    endingIn: getTextFromResource(getText, 'endingIn'),
    paymentDisabled: getTextFromResource(getText, 'paymentDisabled', ['{0}', '{1}']),
    pazePaymentDisabled: getTextFromResource(getText, 'pazePaymentDisabled'),
    payPalDisabled: getTextFromResource(getText, 'payPalDisabled'),
    paymentGiftCardMessage: getTextFromResource(getText, 'paymentGiftCardMessage', ['{0}']),
    payzeAvailabilty: getTextFromResource(getText, 'payzeAvailabilty'),
    pazeErrorMessage: getTextFromResource(getText, 'pazeErrorMessage'),
    pazeErrorTitle: getTextFromResource(getText, 'pazeErrorTitle'),
    pazeErrorOk: getTextFromResource(getText, 'pazeErrorOk'),
    pazePolicy: getTextFromResource(getText, 'pazePolicy')
});

const fields = createSelector(localization, orderItemsSelector, (locales, orderItems) => {
    return {
        locales,
        isKlarnaCheckoutEnabled: orderItems.isKlarnaCheckoutEnabled
    };
});

const withPaymentDisplayProps = wrapHOC(connect(fields, null));

export default withPaymentDisplayProps(PaymentDisplay);
