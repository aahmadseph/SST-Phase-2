import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import AccountActions from 'actions/AccountActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { checkAccountClosure } = AccountActions;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/AccountOwnership/locales', 'AccountOwnership');

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        accountOwnership: getTextFromResource(getText, 'accountOwnership'),
        accountIsOpen: getTextFromResource(getText, 'accountIsOpen'),
        closeAccount: getTextFromResource(getText, 'closeAccount')
    })
});

const functions = {
    checkAccountClosure
};

const withAccountOwnershipProps = wrapHOC(connect(fields, functions));

export {
    withAccountOwnershipProps, fields, functions
};
