import { createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import Empty from 'constants/empty';

const priceInfoSelector = createSelector(orderDetailsSelector, orderDitails => orderDitails.priceInfo || Empty.Object);

export default priceInfoSelector;
