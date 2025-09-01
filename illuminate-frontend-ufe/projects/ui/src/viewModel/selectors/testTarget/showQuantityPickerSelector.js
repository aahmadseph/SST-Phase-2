import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/quantityPicker/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showQuantityPickerSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showQuantityPickerSelector };
