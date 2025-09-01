import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Happening/GenericError/locales', 'GenericError');

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        header: getTextFromResource(getText, 'header'),
        p1: getTextFromResource(getText, 'p1'),
        p2: getTextFromResource(getText, 'p2'),
        cta: getTextFromResource(getText, 'cta')
    })
});

const withGenericErrorProps = connect(fields);

export {
    withGenericErrorProps, fields
};
