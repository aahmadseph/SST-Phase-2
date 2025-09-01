import { createSelector } from 'reselect';
import headerSelector from 'selectors/order/orderDetails/header/headerSelector';

const orderLocaleSelector = createSelector(headerSelector, header => header.orderLocale);

export default orderLocaleSelector;
