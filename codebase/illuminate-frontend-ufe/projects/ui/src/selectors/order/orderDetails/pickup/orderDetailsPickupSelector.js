import { createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import Empty from 'constants/empty';

const orderDetailsPickupSelector = createSelector(orderDetailsSelector, orderDetails => orderDetails.pickup || Empty.Object);

export { orderDetailsPickupSelector };
