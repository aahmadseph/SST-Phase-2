import { createSelector } from 'reselect';
import { isOmniRewardEnabledSelector } from 'viewModel/selectors/basket/isOmniRewardEnabled/isOmniRewardEnabledSelector';
/*
    This is a dummy selector, but groundwork of https://jira.sephora.com/browse/OMCON-1857.
    This is going to be enhanced in future stories.
*/

const rewardFulfillmentConfigurationSelector = createSelector(isOmniRewardEnabledSelector, isOmniRewardEnabled => {
    return {
        shouldShowRewardFulfillmentMethodModal: isOmniRewardEnabled
    };
});

export { rewardFulfillmentConfigurationSelector };
