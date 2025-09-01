import { createSelector } from 'reselect';
import ShowSelector from 'selectors/testTarget/offers/bopisSelectorCopyOnPdp/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const { showSelector } = ShowSelector;

const showBopisSelectorCopyOnPdpSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showBopisSelectorCopyOnPdpSelector };
