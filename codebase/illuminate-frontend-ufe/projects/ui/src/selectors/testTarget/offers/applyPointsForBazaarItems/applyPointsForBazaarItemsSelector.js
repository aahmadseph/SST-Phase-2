import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const applyPointsForBazaarItemsSelector = createSelector(testTargetOffersSelector, offers => offers.applyPointsForBazaarItems || Empty.Object);

export { applyPointsForBazaarItemsSelector };
