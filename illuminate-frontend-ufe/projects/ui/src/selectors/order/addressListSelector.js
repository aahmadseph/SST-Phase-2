import { createSelector } from 'reselect';
import { orderSelector } from 'selectors/order/orderSelector';
import Empty from 'constants/empty';

const addressListSelector = createSelector(orderSelector, order => order.addressList || Empty.Array);

export default addressListSelector;
