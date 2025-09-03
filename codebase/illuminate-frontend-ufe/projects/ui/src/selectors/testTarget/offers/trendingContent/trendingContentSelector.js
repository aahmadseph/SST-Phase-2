import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const trendingContentSelector = createSelector(testTargetOffersSelector, offers => offers.trendingContent || Empty.Object);

export { trendingContentSelector };
