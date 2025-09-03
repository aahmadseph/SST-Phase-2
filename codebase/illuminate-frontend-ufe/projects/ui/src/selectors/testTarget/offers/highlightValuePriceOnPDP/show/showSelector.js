import { createSelector } from 'reselect';
import { highlightValuePriceOnPDPSelector } from 'selectors/testTarget/offers/highlightValuePriceOnPDP/highlightValuePriceOnPDPSelector';

const showSelector = createSelector(highlightValuePriceOnPDPSelector, highlightValuePriceOnPDP => !!highlightValuePriceOnPDP.show);

export { showSelector };
