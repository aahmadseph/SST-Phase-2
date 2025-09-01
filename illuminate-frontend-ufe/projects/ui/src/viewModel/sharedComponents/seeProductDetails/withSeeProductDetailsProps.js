import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/SeeProductDetails/locales', 'SeeProductDetails');

const fields = createSelector(
    createStructuredSelector({
        seeDetails: getTextFromResource(getText, 'seeDetails')
    })
);

const withSeeProductDetailsProps = wrapHOC(connect(fields));

export {
    fields, withSeeProductDetailsProps
};
