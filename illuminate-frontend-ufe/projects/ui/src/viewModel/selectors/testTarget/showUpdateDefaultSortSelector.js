import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/updateDefaultSort/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showUpdateDefaultSortSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showUpdateDefaultSortSelector };
