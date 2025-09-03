import PageCard from 'components/Content/PageCard/PageCard';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Content/PageCard/locales', 'PageCard');

const textResources = createStructuredSelector({
    buyingGuide: getTextFromResource(getText, 'buyingGuide')
});

const fields = createSelector(textResources, locales => {
    return {
        locales
    };
});

const withPageCardProps = wrapHOC(connect(fields, null));

export default withPageCardProps(PageCard);
