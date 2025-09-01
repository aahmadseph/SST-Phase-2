import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/dynamicStickyFilter/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showDynamicStickyFilterSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showDynamicStickyFilterSelector };
