import { createSelector } from 'reselect';
import { orderSelector } from 'selectors/order/orderSelector';

const bankRewardsValidPaymentsMessageSelector = createSelector(orderSelector, order => order.bankRewardsValidPaymentsMessage || false);

export default bankRewardsValidPaymentsMessageSelector;
