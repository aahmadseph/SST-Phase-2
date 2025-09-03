import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const reorderCarouselHPSOSelector = createSelector(testTargetOffersSelector, offers => offers.reorderCarouselHPSO || Empty.Object);

export { reorderCarouselHPSOSelector };
