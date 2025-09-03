import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const bopisSelectorCopyOnPdpSelector = createSelector(testTargetOffersSelector, offers => offers.bopisSelectorCopyOnPdp || Empty.Object);

export { bopisSelectorCopyOnPdpSelector };
