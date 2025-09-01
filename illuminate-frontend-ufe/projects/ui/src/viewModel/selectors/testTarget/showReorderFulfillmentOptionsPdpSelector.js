import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/reorderFulfillmentOptionsPdp/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showReorderFulfillmentOptionsPdpSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showReorderFulfillmentOptionsPdpSelector };
