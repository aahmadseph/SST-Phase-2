import { createSelector } from 'reselect';
import { orderDetailsPickupSelector } from 'selectors/order/orderDetails/pickup/orderDetailsPickupSelector';
import Empty from 'constants/empty';

const orderDetailsPickupStoreDetailsSelector = createSelector(orderDetailsPickupSelector, pickup => pickup?.storeDetails || Empty.Object);

export { orderDetailsPickupStoreDetailsSelector };
