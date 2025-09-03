import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/buyItAgainLogic/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showBuyItAgainLogicSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showBuyItAgainLogicSelector };
