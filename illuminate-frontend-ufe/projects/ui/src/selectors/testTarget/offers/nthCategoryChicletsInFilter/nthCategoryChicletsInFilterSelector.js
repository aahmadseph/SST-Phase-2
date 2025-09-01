import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const nthCategoryChicletsInFilterSelector = createSelector(testTargetOffersSelector, offers => offers.nthCategoryChicletsInFilter || Empty.Object);

export { nthCategoryChicletsInFilterSelector };
