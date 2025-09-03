import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Actions from 'actions/Actions';
import UserActions from 'actions/UserActions';
import BCCUtils from 'utils/BCC';
import { userSelector } from 'selectors/user/userSelector';
import FrameworkUtils from 'utils/framework';
import StringUtils from 'utils/String';

const { MEDIA_IDS } = BCCUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { showMediaModal, showSMSSignInModal } = Actions;
const { PRIVACY_POLICY_MODAL } = MEDIA_IDS;
const getText = getLocaleResourceFile('components/GlobalModals/SMSSignInModal/locales', 'SMSSignInModal');

const fields = createSelector(
    userSelector,
    createStructuredSelector({
        smsSignInModalTitle: getTextFromResource(getText, 'smsSignInModalTitle'),
        greeting: getTextFromResource(getText, 'greeting', ['{0}']),
        ModalTextHeading: getTextFromResource(getText, 'ModalTextHeading'),
        ModalTextInputHeading: getTextFromResource(getText, 'ModalTextInputHeading'),
        enterMobileNumber: getTextFromResource(getText, 'enterMobileNumber'),
        signUpNow: getTextFromResource(getText, 'signUpNow'),
        TermsAndConditon: getTextFromResource(getText, 'TermsAndConditon'),
        TermsAndConditonCA: getTextFromResource(getText, 'TermsAndConditonCA'),
        textTerms: getTextFromResource(getText, 'textTerms'),
        TermsAndConditon2: getTextFromResource(getText, 'TermsAndConditon2'),
        privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
        TermsAndConditon3: getTextFromResource(getText, 'TermsAndConditon3'),
        notice: getTextFromResource(getText, 'notice'),
        TermsAndConditon4: getTextFromResource(getText, 'TermsAndConditon4'),
        TermsAndConditon5: getTextFromResource(getText, 'TermsAndConditon5')
    }),
    (user, textResources) => {
        const { greeting, ...restTextResources } = textResources;
        const firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
        const greetingText = StringUtils.format(greeting, firstName);
        // const isCanada = !isUS();
        // const smsSignupConfirmationHeading = isCanada ? smsSignupConfirmationHeadingCA : smsSignupConfirmationHeadingUSA;
        // const smsSignupConfirmationText = isCanada ? smsSignupConfirmationTextCA : smsSignupConfirmationTextUSA;

        return {
            user,
            greetingText,
            ...restTextResources
        };
    }
);

const functions = dispatch => ({
    onSMSSignup: (number, pagename, maskedPhoneNumber, failCallback, brand) => {
        const requestOrigin = 'SignedInFooter';
        const action = UserActions.submitSMSOptInForm(number, pagename, maskedPhoneNumber, failCallback, brand, requestOrigin);
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
            title: getText('notice'),
            isOpen: true,
            mediaId: PRIVACY_POLICY_MODAL
        });
        dispatch(action);
    },
    onDismissModal: () => {
        const action = showSMSSignInModal({ isOpen: false });
        dispatch(action);
    }
});

const withSMSSignInModalProps = wrapHOC(connect(fields, functions));

export {
    withSMSSignInModalProps, fields, functions
};
