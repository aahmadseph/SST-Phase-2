import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const freeSamplesOnBasketSelector = createSelector(testTargetOffersSelector, offers => offers.freeSamplesOnBasket || Empty.Object);

export { freeSamplesOnBasketSelector };
