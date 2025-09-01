import { createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';

const shippingGroupsSelector = createSelector(orderDetailsSelector, orderDitails => orderDitails.shippingGroups);

export default shippingGroupsSelector;
