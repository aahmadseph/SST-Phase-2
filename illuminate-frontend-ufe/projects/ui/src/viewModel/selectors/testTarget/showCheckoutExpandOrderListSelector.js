import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/checkoutExpandOrderList/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showCheckoutExpandOrderListSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showCheckoutExpandOrderListSelector };
