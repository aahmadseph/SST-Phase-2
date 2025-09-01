import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
import { showBasketOmniRewardsSelector } from 'viewModel/selectors/testTarget/showBasketOmniRewardsSelector';

const isOmniRewardEnabledSelector = createSelector(basketSelector, showBasketOmniRewardsSelector, (basket, showBasketOmniRewards) => {
    const globalKillswitch = !!Sephora.configurationSettings?.omniRewardConfiguration?.enableOmniReward;
    const omniRewardEnabledInBasket = basket?.omniRewardEnabled || basket?.pickupBasket?.omniRewardEnabled;
    const isOmniRewardEnabled = globalKillswitch && omniRewardEnabledInBasket && showBasketOmniRewards;

    return isOmniRewardEnabled;
});

export { isOmniRewardEnabledSelector };
