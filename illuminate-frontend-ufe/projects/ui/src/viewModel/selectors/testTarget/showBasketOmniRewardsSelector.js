import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/showBasketOmniRewards/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showBasketOmniRewardsSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showBasketOmniRewardsSelector };
