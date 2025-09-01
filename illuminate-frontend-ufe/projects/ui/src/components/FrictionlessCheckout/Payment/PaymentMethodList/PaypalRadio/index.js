import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PaypalRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/PaypalRadio/PaypalRadio';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/Section/locales', 'PaymentSection');

const textResources = createStructuredSelector({
    editPaypal: getTextFromResource(getText, 'editPaypal')
});

const connectedPlaceOrderButton = connect(
    createSelector(textResources, texts => {
        return texts;
    })
);

const withPlaceOrderButtonProps = wrapHOC(connectedPlaceOrderButton);

export default withPlaceOrderButtonProps(PaypalRadio);
