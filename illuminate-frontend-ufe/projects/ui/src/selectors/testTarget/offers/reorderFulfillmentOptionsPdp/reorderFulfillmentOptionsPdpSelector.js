import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const reorderFulfillmentOptionsPdpSelector = createSelector(testTargetOffersSelector, offers => offers.reorderFulfillmentOptionsPdp || Empty.Object);

export { reorderFulfillmentOptionsPdpSelector };
