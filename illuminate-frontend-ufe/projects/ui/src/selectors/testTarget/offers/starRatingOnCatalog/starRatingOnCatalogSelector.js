import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const starRatingOnCatalogSelector = createSelector(testTargetOffersSelector, offers => offers.starRatingOnCatalog || Empty.Object);

export { starRatingOnCatalogSelector };
