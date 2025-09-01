import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import AccountActions from 'actions/AccountActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { cancelCheckPasswordModal, performPasswordCheck } = AccountActions;
const getText = getLocaleResourceFile('components/GlobalModals/CheckPasswordModal/locales', 'CheckPasswordModal');

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        bodyText: getTextFromResource(getText, 'bodyText'),
        placeholder: getTextFromResource(getText, 'passwordPlaceholder'),
        errorMessage: getTextFromResource(getText, 'errorMessage'),
        showPasswordLinkAriaLabel: getTextFromResource(getText, 'showPasswordLinkAriaLabel'),
        hidePasswordLinkAriaLabel: getTextFromResource(getText, 'hidePasswordLinkAriaLabel'),
        cancelButton: getTextFromResource(getText, 'cancelButton'),
        submitButton: getTextFromResource(getText, 'submitButton')
    })
});

const functions = {
    onCancel: cancelCheckPasswordModal,
    onClose: cancelCheckPasswordModal,
    onSubmit: performPasswordCheck
};

const withCheckPasswordModalProps = wrapHOC(connect(fields, functions));

export {
    withCheckPasswordModalProps, fields, functions
};
