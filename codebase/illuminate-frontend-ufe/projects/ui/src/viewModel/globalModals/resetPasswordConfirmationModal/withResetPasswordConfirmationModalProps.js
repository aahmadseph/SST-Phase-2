import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import UserActions from 'actions/UserActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ForgotPasswordBindings from 'analytics/bindingMethods/components/globalModals/forgotPasswordModal/ForgotPasswordBindings';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/ResetPasswordConfirmationModal/locales', 'ResetPasswordConfirmationModal');

const localization = createStructuredSelector({
    emailSent: getTextFromResource(getText, 'emailSent'),
    confirmButton: getTextFromResource(getText, 'confirmButton'),
    confirmationMessage: getTextFromResource(getText, 'confirmationMessage'),
    confirmationMessage2: getTextFromResource(getText, 'confirmationMessage2'),
    didntGetEmail: getTextFromResource(getText, 'didntGetEmail'),
    resend: getTextFromResource(getText, 'resend'),
    error: getTextFromResource(getText, 'error'),
    errorMessage: getTextFromResource(getText, 'errorMessage')
});

const fields = createStructuredSelector({
    localization
});

const functions = {
    onDismiss: () => Actions.showResetPasswordConfirmationModal({ isOpen: false }),
    forgotPassword: UserActions.forgotPassword,
    emailResentTracking: ForgotPasswordBindings.emailResent
};

const withResetPasswordConfirmationModalProps = wrapHOC(connect(fields, functions));

export {
    withResetPasswordConfirmationModalProps, fields, functions
};
