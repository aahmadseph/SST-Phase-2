import { createSelector } from 'reselect';
import { orderSelector } from 'selectors/order/orderSelector';

const activeCheckoutSectionSelector = createSelector(orderSelector, order => order.activeSection);

export default activeCheckoutSectionSelector;
