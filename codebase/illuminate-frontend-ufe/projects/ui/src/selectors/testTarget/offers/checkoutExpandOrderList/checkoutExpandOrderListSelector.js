import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const expandOrderListSelector = createSelector(testTargetOffersSelector, offers => offers.checkoutExpandOrderList || Empty.Object);

export { expandOrderListSelector };
