import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const slsServiceEnabledSelector = createSelector(testTargetOffersSelector, offers => !!offers.isSLSABTestEnabled);

export { slsServiceEnabledSelector };
