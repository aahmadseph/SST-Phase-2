import { createSelector } from 'reselect';
import ShowSelector from 'selectors/testTarget/offers/showEddOnBrowseAndSearch/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const { showSelector } = ShowSelector;

const showEddOnBrowseAndSearchSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showEddOnBrowseAndSearchSelector };
