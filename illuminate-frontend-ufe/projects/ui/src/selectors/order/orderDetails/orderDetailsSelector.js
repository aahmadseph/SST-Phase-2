import { createSelector } from 'reselect';
import { orderSelector } from 'selectors/order/orderSelector';
import Empty from 'constants/empty';

const orderDetailsSelector = createSelector(orderSelector, order => order.orderDetails || Empty.Object);

export { orderDetailsSelector };
