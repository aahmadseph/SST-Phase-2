import { createSelector } from 'reselect';
import shippingGroupsSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsSelector';

const shippingGroupsEntriesSelector = createSelector(shippingGroupsSelector, shippingGroups => shippingGroups.shippingGroupsEntries);

export default shippingGroupsEntriesSelector;
