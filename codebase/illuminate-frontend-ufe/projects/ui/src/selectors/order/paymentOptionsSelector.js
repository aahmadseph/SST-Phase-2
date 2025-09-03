import { createSelector } from 'reselect';
import { orderSelector } from 'selectors/order/orderSelector';

const paymentOptionsSelector = createSelector(orderSelector, order => order.paymentOptions || false);

export default paymentOptionsSelector;
