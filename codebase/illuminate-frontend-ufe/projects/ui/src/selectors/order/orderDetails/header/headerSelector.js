import { createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';

const headerSelector = createSelector(orderDetailsSelector, orderDetails => orderDetails.header);

export default headerSelector;
