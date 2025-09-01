import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/highlightValuePriceOnPDP/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showHighlightValuePriceOnPDPSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showHighlightValuePriceOnPDPSelector };
