import { createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import Empty from 'constants/empty';

const orderItemsSelector = createSelector(orderDetailsSelector, orderDitails => orderDitails.items || Empty.Object);

export default orderItemsSelector;
