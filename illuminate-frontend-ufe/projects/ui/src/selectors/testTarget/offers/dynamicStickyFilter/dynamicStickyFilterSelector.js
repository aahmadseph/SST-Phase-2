import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const dynamicStickyFilterSelector = createSelector(testTargetOffersSelector, offers => offers.dynamicStickyFilter || Empty.Object);

export { dynamicStickyFilterSelector };
