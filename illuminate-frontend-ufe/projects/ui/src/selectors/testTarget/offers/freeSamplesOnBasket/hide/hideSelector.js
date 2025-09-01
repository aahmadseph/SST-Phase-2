import { createSelector } from 'reselect';
import { freeSamplesOnBasketSelector } from 'selectors/testTarget/offers/freeSamplesOnBasket/freeSamplesOnBasketSelector';

const hideSelector = createSelector(freeSamplesOnBasketSelector, freeSamplesOnBasket => !!freeSamplesOnBasket.hide);

export { hideSelector };
