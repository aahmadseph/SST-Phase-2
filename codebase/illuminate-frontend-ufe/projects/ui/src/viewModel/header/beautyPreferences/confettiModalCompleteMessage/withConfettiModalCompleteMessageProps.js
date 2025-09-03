import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Header/BeautyPreferences/locales', 'BeautyPreferences');

const fields = createStructuredSelector({
    confettiModalMessageComplete: getTextFromResource(getText, 'confettiModalMessageComplete')
});

const withConfettiModalCompleteMessageProps = wrapHOC(connect(fields));

export {
    fields, withConfettiModalCompleteMessageProps
};
