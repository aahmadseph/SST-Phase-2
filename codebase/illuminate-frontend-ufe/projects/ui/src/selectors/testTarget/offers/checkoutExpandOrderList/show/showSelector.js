import { createSelector } from 'reselect';
import { expandOrderListSelector } from 'selectors/testTarget/offers/checkoutExpandOrderList/checkoutExpandOrderListSelector';

const showSelector = createSelector(expandOrderListSelector, expandOrderList => !!expandOrderList.show);

export { showSelector };
