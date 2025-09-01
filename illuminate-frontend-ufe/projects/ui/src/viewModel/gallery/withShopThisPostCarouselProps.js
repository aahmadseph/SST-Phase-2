import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/ShopThisPostCarousel/locales', 'ShopThisPostCarousel');

const fields = createSelector(
    createStructuredSelector({
        shopThisPost: getTextFromResource(getText, 'shopThisPost')
    }),
    localization => {
        return {
            localization
        };
    }
);

const functions = null;

const withShopThisPostCarouselProps = wrapHOC(connect(fields, functions));

export {
    withShopThisPostCarouselProps, fields, functions
};
