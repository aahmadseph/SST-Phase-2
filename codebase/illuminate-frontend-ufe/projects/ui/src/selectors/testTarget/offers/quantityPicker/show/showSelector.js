import { createSelector } from 'reselect';
import { quantityPickerSelector } from 'selectors/testTarget/offers/quantityPicker/quantityPickerSelector';

const showSelector = createSelector(quantityPickerSelector, quantityPicker => !!quantityPicker.show);

export { showSelector };
