import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const eddUpperFunnelSelector = createSelector(testTargetOffersSelector, offers => offers.eddUpperFunnel || Empty.Object);

export { eddUpperFunnelSelector };
