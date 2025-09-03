import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { productSelector } from 'selectors/page/product/productSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import productActions from 'actions/ProductActions';
import { localeSelector } from 'viewModel/selectors/locale/localeSelector';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { loadHighlightedReviews, removeHighlightedReviews, setSelectedSentiment } = productActions;
const getText = getLocaleResourceFile('components/ProductPage/RatingsAndReviews/ProsAndCons/locales', 'ProsAndCons');

const localization = createStructuredSelector({
    pros: getTextFromResource(getText, 'pros'),
    cons: getTextFromResource(getText, 'cons')
});

const fields = createSelector(productSelector, localization, localeSelector, (product, textResources, language) => {
    return {
        product,
        localization: textResources,
        language
    };
});

const functions = dispatch => ({
    loadHighlightedReviews: function (...args) {
        const action = loadHighlightedReviews(...args);
        dispatch(action);
    },
    deselectSentiment: function () {
        dispatch(setSelectedSentiment(''));
        const action = removeHighlightedReviews();
        dispatch(action);
    }
});

const withProsAndConsProps = wrapHOC(connect(fields, functions));

export {
    fields, localization, withProsAndConsProps
};
