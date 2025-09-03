/* eslint-disable complexity */
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/ContentLayout/LayoutCs/locales', 'LayoutCs');

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        allTopics: getTextFromResource(getText, 'allTopics')
    })
});

const functions = null;

const withLayoutCsProps = wrapHOC(connect(fields, functions));

export {
    withLayoutCsProps, fields, functions
};
