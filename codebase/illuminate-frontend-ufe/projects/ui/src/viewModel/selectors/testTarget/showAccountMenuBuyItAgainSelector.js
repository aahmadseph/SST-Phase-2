import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/accountMenuBuyItAgain/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showAccountMenuBuyItAgainSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showAccountMenuBuyItAgainSelector };
