import { createSelector } from 'reselect';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';
import Empty from 'constants/empty';

const itemsByBasketSelector = createSelector(orderItemsSelector, items => items.itemsByBasket || Empty.Array);

export default itemsByBasketSelector;
