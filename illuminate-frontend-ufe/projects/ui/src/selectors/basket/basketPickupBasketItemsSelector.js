import { createSelector } from 'reselect';
import basketPickupBasketSelector from 'selectors/basket/basketPickupBasketSelector';
import Empty from 'constants/empty';

const basketPickupBasketItemsSelector = createSelector(basketPickupBasketSelector, pickupBasket => pickupBasket.items || Empty.Array);

export default basketPickupBasketItemsSelector;
