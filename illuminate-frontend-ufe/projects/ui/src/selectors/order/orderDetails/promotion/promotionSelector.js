import { createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';

export default createSelector(orderDetailsSelector, orderDetails => orderDetails.promotion);
