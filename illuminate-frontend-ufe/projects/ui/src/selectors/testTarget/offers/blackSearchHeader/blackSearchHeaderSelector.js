import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const blackSearchHeaderSelector = createSelector(testTargetOffersSelector, offers => offers.blackSearchHeader || Empty.Object);

export { blackSearchHeaderSelector };
