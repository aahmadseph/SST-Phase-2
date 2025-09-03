import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/ShopThisPostCard/locales', 'ShopThisPostCard');

const fields = createSelector(
    createStructuredSelector({
        seeDetails: getTextFromResource(getText, 'seeDetails')
    }),
    localization => {
        return {
            localization
        };
    }
);

const functions = null;

const withShopThisPostCardProps = wrapHOC(connect(fields, functions));

export {
    withShopThisPostCardProps, fields, functions
};
