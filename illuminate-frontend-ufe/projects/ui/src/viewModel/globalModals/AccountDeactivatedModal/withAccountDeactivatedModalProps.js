import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import CloseAccountActions from 'actions/CloseAccountActions';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { closeDeactivatedAccountModal } = CloseAccountActions;
const getText = getLocaleResourceFile('components/GlobalModals/AccountDeactivatedModal/locales', 'AccountDeactivatedModal');

const fields = createSelector(
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        confirmText: getTextFromResource(getText, 'confirmText')
    }),
    localization => ({
        localization
    })
);

const functions = { closeDeactivatedAccountModal };

const withAccountDeactivatedModalProps = wrapHOC(connect(fields, functions));

export {
    withAccountDeactivatedModalProps, fields, functions
};
