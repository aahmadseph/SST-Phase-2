import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
import Empty from 'constants/empty';

const pickupBasketSelector = createSelector(basketSelector, basket => basket.pickupBasket || Empty.Object);

export { pickupBasketSelector };
