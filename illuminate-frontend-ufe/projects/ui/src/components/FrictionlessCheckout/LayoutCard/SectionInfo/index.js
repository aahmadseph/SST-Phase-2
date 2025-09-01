import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import SectionInfo from 'components/FrictionlessCheckout/LayoutCard/SectionInfo/SectionInfo';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/LayoutCard/SectionInfo/locales', 'SectionInfo');

const localizationSelector = createStructuredSelector({
    change: getTextFromResource(getText, 'change')
});

const fields = createSelector(localizationSelector, localization => {
    return {
        localization
    };
});

const withSectionProps = wrapHOC(connect(fields, null));

export default withSectionProps(SectionInfo);
