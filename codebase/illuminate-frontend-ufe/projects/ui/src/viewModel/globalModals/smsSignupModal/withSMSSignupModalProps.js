import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';
import BCCUtils from 'utils/BCC';
import { SMS_NOTIFICATION_STATUS } from 'constants/orderStatus';
import { userSelector } from 'selectors/user/userSelector';
import FrameworkUtils from 'utils/framework';
import checkoutApi from 'services/api/checkout';
import OrderUtils from 'utils/Order';
import StringUtils from 'utils/String';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import orderDetailsBindings from 'analytics/bindingMethods/pages/orderDetails/orderDetailsBindings';

const { getOrderId, getOrderShippingMethod } = OrderUtils;
const { MEDIA_IDS } = BCCUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile, isUS } = LanguageLocaleUtils;
const { showMediaModal, showSMSSignupModal } = Actions;
const { TEXT_TERMS_MODAL, PRIVACY_POLICY_MODAL } = MEDIA_IDS;
const getText = getLocaleResourceFile('components/GlobalModals/SMSSignupModal/locales', 'SMSSignupModal');

const fields = createSelector(
    userSelector,
    createStructuredSelector({
        smsSignupModalTitle: getTextFromResource(getText, 'smsSignupModalTitle'),
        greeting: getTextFromResource(getText, 'greeting', ['{0}']),
        beautiful: getTextFromResource(getText, 'beautiful'),
        smsSignupModalTextHeading: getTextFromResource(getText, 'smsSignupModalTextHeading'),
        smsSignupModalTextInputHeading: getTextFromResource(getText, 'smsSignupModalTextInputHeading'),
        enterMobileNumber: getTextFromResource(getText, 'enterMobileNumber'),
        smsSignUpModalTerms1: getTextFromResource(getText, 'smsSignUpModalTerms1'),
        smsSignUpModalTerms2: getTextFromResource(getText, 'smsSignUpModalTerms2'),
        textTerms: getTextFromResource(getText, 'textTerms'),
        privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
        noticeOfFinacialIncentive: getTextFromResource(getText, 'noticeOfFinacialIncentive'),
        signupTextNotifText: getTextFromResource(getText, 'signupTextNotifText'),
        signUpNow: getTextFromResource(getText, 'signUpNow'),
        invalidNumberErrorMessage: getTextFromResource(getText, 'invalidNumberErrorMessage'),
        textTermsErrorMessage: getTextFromResource(getText, 'textTermsErrorMessage'),
        genericErrorMessage: getTextFromResource(getText, 'genericErrorMessage'),
        gotIt: getTextFromResource(getText, 'gotIt'),
        smsSignupConfirmationHeadingCA: getTextFromResource(getText, 'smsSignupConfirmationHeadingCA'),
        smsSignupConfirmationHeadingUSA: getTextFromResource(getText, 'smsSignupConfirmationHeadingUSA'),
        smsSignupConfirmationTextCA: getTextFromResource(getText, 'smsSignupConfirmationTextCA', ['{0}']),
        smsSignupConfirmationTextUSA: getTextFromResource(getText, 'smsSignupConfirmationTextUSA', ['{0}'])
    }),
    (user, textResources) => {
        const {
            greeting,
            beautiful,
            smsSignupConfirmationHeadingCA,
            smsSignupConfirmationHeadingUSA,
            smsSignupConfirmationTextCA,
            smsSignupConfirmationTextUSA,
            ...restTextResources
        } = textResources;
        const firstName = user && user.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase() : beautiful;
        const greetingText = StringUtils.format(greeting, firstName);
        const isCanada = !isUS();
        const smsSignupConfirmationHeading = isCanada ? smsSignupConfirmationHeadingCA : smsSignupConfirmationHeadingUSA;
        const smsSignupConfirmationText = isCanada ? smsSignupConfirmationTextCA : smsSignupConfirmationTextUSA;

        return {
            user,
            greetingText,
            isCanada,
            smsSignupConfirmationHeading,
            smsSignupConfirmationText,
            ...restTextResources
        };
    }
);

const functions = dispatch => ({
    onSMSSignup: (phoneNumber, successCallback, errorCallback) => {
        checkoutApi
            .setSmsSignup({ phoneNumber, orderId: OrderUtils.getOrderId() })
            .then(res => {
                dispatch(OrderActions.updateOrderHeader({ smsNotificationFlag: SMS_NOTIFICATION_STATUS.AVAILABLE_BUT_ENROLLED }));
                successCallback && successCallback(res);
            })
            .catch(err => {
                errorCallback && errorCallback(err);
            });
    },
    onDismissModal: () => {
        const action = showSMSSignupModal({ isOpen: false });
        dispatch(action);
    },
    showTextOfTerms: () => {
        const action = showMediaModal({
            title: getText('textTerms'),
            isOpen: true,
            mediaId: TEXT_TERMS_MODAL
        });
        dispatch(action);
    },
    showPrivacyPolicy: () => {
        const action = showMediaModal({
            title: getText('privacyPolicy'),
            isOpen: true,
            mediaId: PRIVACY_POLICY_MODAL
        });
        dispatch(action);
    },
    showNoticeOfFinancialIncentive: () => {
        const action = showMediaModal({
            title: getText('noticeOfFinacialIncentive'),
            isOpen: true,
            mediaId: PRIVACY_POLICY_MODAL
        });
        dispatch(action);
    },
    SMSSignupConfirmation: () => {
        orderDetailsBindings.SMSSignupConfirmation({ orderId: getOrderId(), orderShippingMethod: getOrderShippingMethod() });
    },
    SMSButtonClick: () => {
        orderDetailsBindings.SMSButtonClick();
    },
    fireAnalytics: (isConfirmationScreen = false) => {
        const pageName = isConfirmationScreen ? anaConsts.SMS_SIGNUP.CONFIRMATION_PAGE_NAME : anaConsts.SMS_SIGNUP.PAGE_NAME;
        const subscriptionType = OrderUtils.isSdd() ? 'sdd' : 'bopis';
        const eVar27 = `${subscriptionType}:${OrderUtils.getOrderId()}`;
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName,
                keywordPurchased: eVar27
            }
        });
    },
    fireErrorAnalytics: errorMessages => {
        import('analytics/bindings/pages/all/linkTrackingError').then(module => {
            const linkTrackingError = module.default;
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: linkTrackingError,
                    fieldErrors: ['sms modal'],
                    errorMessages,
                    ...anaUtils.getLastAsyncPageLoadData()
                }
            });
        });
    }
});

const withSMSSignupModalProps = wrapHOC(connect(fields, functions));

export {
    withSMSSignupModalProps, fields, functions
};
