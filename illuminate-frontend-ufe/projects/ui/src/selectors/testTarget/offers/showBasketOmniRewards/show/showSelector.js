import { createSelector } from 'reselect';
import { showBasketOmniRewardsSelector } from 'selectors/testTarget/offers/showBasketOmniRewards/showBasketOmniRewardsSelector';

const showSelector = createSelector(showBasketOmniRewardsSelector, showBasketOmniRewards => !!showBasketOmniRewards.show);

export { showSelector };
