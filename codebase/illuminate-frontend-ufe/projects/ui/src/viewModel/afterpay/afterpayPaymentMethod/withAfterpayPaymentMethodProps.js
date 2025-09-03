import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import AfterpayActions from 'actions/AfterpayActions';
import UserActions from 'actions/UserActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { toggleSelectAsDefaultPayment } = UserActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { loadWidget, updateWidget } = AfterpayActions;
const getText = getLocaleResourceFile('components/Afterpay/AfterpayPaymentMethod/locales', 'AfterpayPaymentMethod');

const fields = createSelector(
    userSelector,
    orderDetailsSelector,
    isAnonymousSelector,
    createStructuredSelector({
        widgetErrorUS: getTextFromResource(getText, 'widgetError', ['Cash App Afterpay']),
        widgetErrorCA: getTextFromResource(getText, 'widgetError', ['Afterpay']),
        legalNoticeUS: getTextFromResource(getText, 'legalNotice', [
            'Cash App Afterpay',
            'https://www.afterpay.com/en-US/terms-of-service',
            'https://www.afterpay.com/en-US/privacy-policy'
        ]),
        legalNoticeCA: getTextFromResource(getText, 'legalNotice', [
            'Afterpay',
            'https://www.afterpay.com/fr-CA/terms-of-service',
            'https://www.afterpay.com/fr-CA/privacy-policy'
        ])
    }),
    (user, orderDetails, isAnonymous, textResources) => {
        const amount = orderDetails?.priceInfo?.creditCardAmount || orderDetails?.priceInfo?.paypalAmount;
        const checked = user.selectedAsDefaultPaymentName === 'afterpay';

        return {
            amount,
            checked,
            isAnonymous,
            ...textResources
        };
    }
);

const functions = {
    loadWidget,
    updateWidget,
    toggleSelectAsDefaultPayment
};

const withAfterpayPaymentMethodProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withAfterpayPaymentMethodProps
};
