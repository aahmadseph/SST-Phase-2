import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { productSelector } from 'selectors/page/product/productSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import productPageSOTBindings from 'analytics/bindingMethods/pages/productPage/productPageSOTBindings';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/ProductPage/RatingsAndReviews/HighlyRatedFor/locales', 'HighlyRatedFor');

const fields = createSelector(
    productSelector,
    createStructuredSelector({
        seeMore: getTextFromResource(getText, 'seeMore'),
        linkLead: getTextFromResource(getText, 'linkLead'),
        modalTitle: getTextFromResource(getText, 'modalTitle')
    }),
    (product, localization) => {
        return {
            product,
            localization
        };
    }
);

const functions = {
    highlyRatedForClick: productPageSOTBindings.highlyRatedForClick
};

const withHighlyRatedForProps = wrapHOC(connect(fields, functions));

export {
    withHighlyRatedForProps, fields, functions
};
