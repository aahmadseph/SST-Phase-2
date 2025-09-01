import { createSelector } from 'reselect';
import { orderSelector } from 'selectors/order/orderSelector';

const orderShippingMethodsSelector = createSelector(orderSelector, order => order.orderShippingMethods);

export default orderShippingMethodsSelector;
