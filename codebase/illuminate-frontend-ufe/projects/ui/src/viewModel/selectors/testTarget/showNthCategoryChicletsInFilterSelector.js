import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/nthCategoryChicletsInFilter/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showNthCategoryChicletsInFilterSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showNthCategoryChicletsInFilterSelector };
