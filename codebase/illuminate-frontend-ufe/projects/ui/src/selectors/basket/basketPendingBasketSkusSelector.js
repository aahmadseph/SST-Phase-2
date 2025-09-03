import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';

const basketPendingBasketSkusSelector = createSelector(basketSelector, basket => basket.pendingBasketSkus);

export default basketPendingBasketSkusSelector;
