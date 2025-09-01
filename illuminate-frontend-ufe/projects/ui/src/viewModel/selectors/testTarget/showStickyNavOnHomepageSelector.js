import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/stickyNavOnHomepage/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showStickyNavOnHomepageSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showStickyNavOnHomepageSelector };
