import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { productSelector } from 'selectors/page/product/productSelector';
import { localeSelector } from 'viewModel/selectors/locale/localeSelector';
import ProductActions from 'actions/ProductActions';

const { wrapHOC } = FrameworkUtils;
const { loadHighlightedReviews } = ProductActions;

const fields = createSelector(productSelector, localeSelector, (product, language) => {
    return {
        selectedSentiment: product.selectedSentiment,
        language
    };
});

const functions = {
    loadHighlightedReviews
};

const withRatingsAndReviewsProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withRatingsAndReviewsProps
};
