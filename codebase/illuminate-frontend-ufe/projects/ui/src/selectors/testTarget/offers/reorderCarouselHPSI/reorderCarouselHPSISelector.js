import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const reorderCarouselHPSISelector = createSelector(testTargetOffersSelector, offers => offers.reorderCarouselHPSI || Empty.Object);

export { reorderCarouselHPSISelector };
