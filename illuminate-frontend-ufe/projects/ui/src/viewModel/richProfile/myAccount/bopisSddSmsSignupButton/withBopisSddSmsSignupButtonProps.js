import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import OrderUtils from 'utils/Order';
import urlUtils from 'utils/Url';
import anaUtils from 'analytics/utils';
import { SMS_NOTIFICATION_STATUS } from 'constants/orderStatus';
import orderDetailsBindings from 'analytics/bindingMethods/pages/orderDetails/orderDetailsBindings';

const { getOrderDetailsUrl, getOrderId, getOrderShippingMethod } = OrderUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { showSMSSignupModal } = Actions;
const { redirectTo } = urlUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/BopisSddSmsSignupButton/locales', 'BopisSddSmsSignupButton');

const localization = createStructuredSelector({
    getSmsUpdates: getTextFromResource(getText, 'getSmsUpdates'),
    alreadyEnrolled: getTextFromResource(getText, 'alreadyEnrolled'),
    orderDetailsAndSmsUpdates: getTextFromResource(getText, 'orderDetailsAndSmsUpdates')
});

const fields = createSelector(
    localization,
    (_, ownProps) => ownProps.isCheckout,
    (_, ownProps) => ownProps.smsNotificationFlag,
    (textResources, isCheckout, smsNotificationFlag) => {
        const { getSmsUpdates, alreadyEnrolled, orderDetailsAndSmsUpdates } = textResources;
        const isEnrolled = smsNotificationFlag === SMS_NOTIFICATION_STATUS.AVAILABLE_BUT_ENROLLED;
        const isDisabled = isCheckout ? false : isEnrolled;
        const buttonText = isCheckout ? orderDetailsAndSmsUpdates : isEnrolled ? alreadyEnrolled : getSmsUpdates;

        const orderId = getOrderId();
        const orderDetailsURL = getOrderDetailsUrl(orderId);
        const redirectToOrderDetails = () => {
            anaUtils.setNextPageData({ linkData: 'see order details & get sms updates click' });
            redirectTo(orderDetailsURL);
        };

        return {
            isDisabled,
            buttonText,
            redirectToOrderDetails
        };
    }
);

const functions = dispatch => ({
    openSmsSignupModal: () => {
        orderDetailsBindings.SMSSignupModal({ orderId: getOrderId(), orderShippingMethod: getOrderShippingMethod() });
        const action = showSMSSignupModal({ isOpen: true });
        dispatch(action);
    }
});

const withBopisSddSmsSignupButtonProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, localization, withBopisSddSmsSignupButtonProps
};
