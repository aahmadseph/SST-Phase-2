import PaymentRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/PaymentRadio/PaymentRadio';
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/Display/locales', 'PaymentDisplay');

const localization = createStructuredSelector({
    paymentGiftCardMessage: getTextFromResource(getText, 'paymentGiftCardMessage', ['{0}'])
});

const fields = createSelector(localization, locales => {
    return {
        locales
    };
});

const withPaymentDisplayProps = wrapHOC(connect(fields, null));

export default withPaymentDisplayProps(PaymentRadio);
