import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const simplifyPickupSelector = createSelector(testTargetOffersSelector, offers => offers.simplifyPickup || Empty.Object);

export { simplifyPickupSelector };
