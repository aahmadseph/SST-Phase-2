import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import AccountActions from 'actions/AccountActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { cancelCloseAccountModal, closeAccount } = AccountActions;
const getText = getLocaleResourceFile('components/GlobalModals/CloseAccountModal/locales', 'CloseAccountModal');

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        checkboxText: getTextFromResource(getText, 'checkboxText'),
        cancelButton: getTextFromResource(getText, 'cancelButton'),
        listTitleText: getTextFromResource(getText, 'listTitleText'),
        item1: getTextFromResource(getText, 'item1'),
        item2: getTextFromResource(getText, 'item2'),
        item3: getTextFromResource(getText, 'item3'),
        item4: getTextFromResource(getText, 'item4'),
        item5: getTextFromResource(getText, 'item5'),
        item6: getTextFromResource(getText, 'item6'),
        item7: getTextFromResource(getText, 'item7'),
        item8: getTextFromResource(getText, 'item8'),
        postListText: getTextFromResource(getText, 'postListText')
    })
});

const functions = {
    onCancel: cancelCloseAccountModal,
    onClose: cancelCloseAccountModal,
    onSubmit: closeAccount
};

const withCloseAccountModalProps = wrapHOC(connect(fields, functions));

export {
    withCloseAccountModalProps, fields, functions
};
