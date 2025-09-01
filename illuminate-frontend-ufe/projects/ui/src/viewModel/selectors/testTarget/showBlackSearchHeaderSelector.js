import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/blackSearchHeader/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showBlackSearchHeaderSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showBlackSearchHeaderSelector };
