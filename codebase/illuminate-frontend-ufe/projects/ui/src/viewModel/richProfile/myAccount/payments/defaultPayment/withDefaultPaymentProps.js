import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/Payments/DefaultPayment/locales', 'DefaultPayment');

const fields = createSelector(
    (_state, ownProps) => ownProps.defaultPaymentName,
    createStructuredSelector({
        deletePaymentOptionText: getTextFromResource(getText, 'deletePaymentOption'),
        defaultPaymentText: getTextFromResource(getText, 'defaultPayment'),
        cancelText: getTextFromResource(getText, 'cancel'),
        editText: getTextFromResource(getText, 'edit'),
        paymentNameAccount: getTextFromResource(getText, 'paymentNameAccount', ['{0}'])
    }),
    (defaultPaymentName, textResources) => {
        return { defaultPaymentName, ...textResources };
    }
);
const withDefaultPaymentProps = wrapHOC(connect(fields));

export {
    fields, withDefaultPaymentProps
};
