import { createSelector } from 'reselect';
import { orderSelector } from 'selectors/order/orderSelector';

const isApplePayFlowSelector = createSelector(orderSelector, order => order.isApplePayFlow || false);

export default isApplePayFlowSelector;
