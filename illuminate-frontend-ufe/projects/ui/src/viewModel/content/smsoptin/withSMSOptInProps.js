import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import Actions from 'actions/Actions';
import userActions from 'actions/UserActions';
import framework from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = framework;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Brand/BrandLaunch/locales', 'BrandLaunch');
const getErrorsText = getLocaleResourceFile('utils/locales', 'Errors');

const fields = createStructuredSelector({
    user: userSelector,
    isAnonymous: isAnonymousSelector,
    stepOne: getTextFromResource(getText, 'stepOne'),
    buttonSignIn: getTextFromResource(getText, 'buttonSignIn'),
    buttonSendAlerts: getTextFromResource(getText, 'buttonSendAlerts'),
    noAccount: getTextFromResource(getText, 'noAccount'),
    createAccount: getTextFromResource(getText, 'createAccount'),
    emailAddressLabel: getTextFromResource(getText, 'emailAddressLabel'),
    notYouMessage: getTextFromResource(getText, 'notYouMessage'),
    passwordLabel: getTextFromResource(getText, 'passwordLabel'),
    hidePasswordLinkAriaLabel: getTextFromResource(getText, 'hidePasswordLinkAriaLabel'),
    showPasswordLinkAriaLabel: getTextFromResource(getText, 'showPasswordLinkAriaLabel'),
    enterPasswordErrorMessage: getTextFromResource(getText, 'enterPasswordErrorMessage'),
    enterMobileErrorMessage: getTextFromResource(getText, 'enterMobileErrorMessage'),
    forgotPassword: getTextFromResource(getText, 'forgotPassword'),
    stepTwo: getTextFromResource(getText, 'stepTwo'),
    mobileLabel: getTextFromResource(getText, 'mobileLabel'),
    submissionError: getTextFromResource(getErrorsText, 'submissionError'),
    lead: getTextFromResource(getText, 'lead'),
    phoneNumberRejected: getTextFromResource(getErrorsText, 'phoneNumberRejected')
});

const functions = {
    showSignInModal: Actions.showSignInModal,
    showRegisterModal: Actions.showRegisterModal,
    showForgotPasswordModal: Actions.showForgotPasswordModal,
    submitSMSForm: userActions.submitSMSOptInForm,
    submitSignInForm: userActions.signIn
};

const withSMSOptInProps = wrapHOC(connect(fields, functions));

export {
    withSMSOptInProps, fields, functions
};
