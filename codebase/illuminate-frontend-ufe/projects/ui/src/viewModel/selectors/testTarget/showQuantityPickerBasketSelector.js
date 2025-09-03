import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/quantityPickerBasket/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showQuantityPickerBasketSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showQuantityPickerBasketSelector };
