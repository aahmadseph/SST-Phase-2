import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { productSelector } from 'selectors/page/product/productSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import productActions from 'actions/ProductActions';
import HighlightedReviews from 'utils/HighlightedReviews';
import { localeSelector } from 'viewModel/selectors/locale/localeSelector';
import UI from 'utils/UI';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { highlightRange } = HighlightedReviews;
const { loadHighlightedReviews } = productActions;
const getText = getLocaleResourceFile('components/ProductPage/RatingsAndReviews/HighlyRatedFor/SentimentModal/locales', 'SentimentModal');

const fields = createSelector(
    productSelector,
    localeSelector,
    createStructuredSelector({
        seeMore: getTextFromResource(getText, 'seeMore'),
        modalTitle: getTextFromResource(getText, 'modalTitle')
    }),
    (product, language, localization) => {
        return {
            product,
            language,
            localization
        };
    }
);

const functions = dispatch => ({
    loadHighlightedReviews: function (...args) {
        if (UI.isIOS()) {
            UI.unlockBackgroundPosition();
        }

        UI.scrollTo({ elementId: 'ratings-reviews-container' });
        const action = loadHighlightedReviews(...args);
        dispatch(action);
    },
    highlightRange
});

const withSentimentalModalProps = wrapHOC(connect(fields, functions));

export {
    functions, withSentimentalModalProps
};
