import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import CheckYourEmailModalBindings from 'analytics/bindingMethods/components/globalModals/checkYourEmailModal/CheckYourEmailModalBindings';
import userActions from 'actions/UserActions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/CheckYourEmailModal/locales', 'CheckYourEmailModal');

const localization = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    confirmButton: getTextFromResource(getText, 'confirmButton'),
    clickVerificationLink1: getTextFromResource(getText, 'clickVerificationLink1'),
    clickVerificationLink2: getTextFromResource(getText, 'clickVerificationLink2'),
    didntGetIt: getTextFromResource(getText, 'didntGetIt'),
    resend: getTextFromResource(getText, 'resend'),
    emailResent: getTextFromResource(getText, 'emailResent'),
    emailResentError: getTextFromResource(getText, 'emailResentError'),
    tokenValidationError: getTextFromResource(getText, 'tokenValidationError'),
    success: getTextFromResource(getText, 'success'),
    error: getTextFromResource(getText, 'error'),
    completeAccountSetup: getTextFromResource(getText, 'completeAccountSetup'),
    didntGetEmail: getTextFromResource(getText, 'didntGetEmail')
});

const fields = createStructuredSelector({
    localization
});

const functions = {
    onDismiss: () => Actions.showCheckYourEmailModal({ isOpen: false }),
    pageLoadAnalytics: CheckYourEmailModalBindings.pageLoad,
    sendVerificationEmail: userActions.sendVerificationEmail
};

const withCheckYourEmailModalProps = wrapHOC(connect(fields, functions));

export {
    withCheckYourEmailModalProps, fields, functions
};
