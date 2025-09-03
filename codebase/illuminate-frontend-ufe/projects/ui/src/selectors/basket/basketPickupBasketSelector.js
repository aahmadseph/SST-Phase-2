import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';

const basketPickupBasketSelector = createSelector(basketSelector, basket => basket.pickupBasket);

export default basketPickupBasketSelector;
