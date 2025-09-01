import { createSelector } from 'reselect';
import ShowSelector from 'selectors/testTarget/offers/eddUpperFunnel/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const { showSelector } = ShowSelector;

const showEddOnProductPageSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showEddOnProductPageSelector };
