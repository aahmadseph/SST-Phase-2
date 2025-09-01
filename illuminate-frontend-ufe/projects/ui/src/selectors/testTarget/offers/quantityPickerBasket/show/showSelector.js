import { createSelector } from 'reselect';
import { quantityPickerBasketSelector } from 'selectors/testTarget/offers/quantityPickerBasket/quantityPickerBasketSelector';

const showSelector = createSelector(quantityPickerBasketSelector, quantityPickerBasket => !!quantityPickerBasket.show);

export { showSelector };
