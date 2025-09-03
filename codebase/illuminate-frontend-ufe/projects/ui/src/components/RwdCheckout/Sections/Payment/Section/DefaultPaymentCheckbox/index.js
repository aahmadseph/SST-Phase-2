import DefaultPaymentCheckbox from 'components/RwdCheckout/Sections/Payment/Section/DefaultPaymentCheckbox/DefaultPaymentCheckbox';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import paymentsActions from 'actions/PaymentsActions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/Section/locales', 'PaymentSection');

const fields = createSelector(
    userSelector,
    orderSelector,
    (_state, ownProps) => ownProps.paymentName,
    createStructuredSelector({
        setAsDefaultPaymentLabel: getTextFromResource(getText, 'setAsDefaultPayment'),
        setAsDefaultPaymentNoticeLabel: getTextFromResource(getText, 'setAsDefaultPaymentNotice')
    }),
    (user, order, paymentName, textResources) => {
        const savedAsDefaultInProfile = order?.paymentOptions?.defaultPayment === paymentName;
        const checked = savedAsDefaultInProfile || user.selectedAsDefaultPaymentName === paymentName;

        return {
            paymentName,
            checked,
            disabled: savedAsDefaultInProfile,
            ...textResources
        };
    }
);

const functions = {
    addDefaultPaymentToProfile: paymentsActions.addDefaultPaymentToProfile,
    removeDefaultPaymentFromProfile: paymentsActions.removeDefaultPaymentFromProfile
};

const withDefaultPaymentCheckboxProps = wrapHOC(connect(fields, functions));

export default withDefaultPaymentCheckboxProps(DefaultPaymentCheckbox);
