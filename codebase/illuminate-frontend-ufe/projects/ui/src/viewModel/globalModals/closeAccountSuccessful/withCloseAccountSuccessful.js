import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/CloseAccountSuccessful/locales', 'CloseAccountSuccessful');

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        accountClosed: getTextFromResource(getText, 'accountClosed'),
        loggedOut: getTextFromResource(getText, 'loggedOut'),
        message: getTextFromResource(getText, 'message'),
        or: getTextFromResource(getText, 'or'),
        chatWithUs: getTextFromResource(getText, 'chatWithUs')
    })
});

const withCloseAccountSuccessfulProps = wrapHOC(connect(fields, null));

export {
    withCloseAccountSuccessfulProps, fields
};
