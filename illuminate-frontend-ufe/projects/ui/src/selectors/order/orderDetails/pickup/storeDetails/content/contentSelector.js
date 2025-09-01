import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import { orderDetailsPickupStoreDetailsSelector } from 'selectors/order/orderDetails/pickup/storeDetails/orderDetailsPickupStoreDetailsSelector';

const contentSelector = createSelector(orderDetailsPickupStoreDetailsSelector, storeDetails => storeDetails.content || Empty.Object);

export { contentSelector };
