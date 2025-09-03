import { createSelector } from 'reselect';
import { hideSelector } from 'selectors/testTarget/offers/freeSamplesOnBasket/hide/hideSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const hideFreeSamplesOnBasketSelector = createSelector(isTestTargetReadySelector, hideSelector, (testReady, hide) => testReady && hide);

export { hideFreeSamplesOnBasketSelector };
