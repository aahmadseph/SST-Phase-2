import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const showBasketOmniRewardsSelector = createSelector(testTargetOffersSelector, offers => offers.showBasketOmniRewards || Empty.Object);

export { showBasketOmniRewardsSelector };
