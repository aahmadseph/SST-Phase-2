import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/ContentLayout/LayoutARSkincare/locales', 'LayoutARSkincare');

const fields = createStructuredSelector({
    qrComponentTitle: getTextFromResource(getText, 'qrComponentTitle'),
    qrComponentText: getTextFromResource(getText, 'qrComponentText')
});

const functions = {};

const withLayoutARSkincareProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withLayoutARSkincareProps
};
