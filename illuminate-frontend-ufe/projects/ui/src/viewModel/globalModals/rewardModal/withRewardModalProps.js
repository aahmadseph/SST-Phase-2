import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';

import basketSelector from 'selectors/basket/basketSelector';
import rewardsSelector from 'selectors/rewards/rewardsSelector';
import VibSegmentSelector from 'selectors/user/beautyInsiderAccount/vibSegmentSelector';
import Actions from 'Actions';
import rewardActions from 'actions/RewardActions';
import basketUtils from 'utils/Basket';

const { vibSegmentSelector } = VibSegmentSelector;
const { showRewardModal } = Actions;
// NOTE [Andrei Paramoshkin] 11/24/21 implicit selector due to too "smart" utils, refactor eventually
const biPointsSelector = createSelector(basketSelector, () => basketUtils.getAvailableBiPoints(true));

const isRewardInBasketSelector = createSelector(basketSelector, basketUtils.isRewardInBasket);

const isCBRPromoAppliedInBasketSelector = createSelector(basketSelector, basketUtils.isCBRPromoAppliedInBasket);

const isRewardsAvailableSelector = createSelector(rewardsSelector, rewards => Boolean(rewards));

export default connect(
    createStructuredSelector({
        rewards: biPointsSelector,
        biPoints: biPointsSelector,
        isRewardInBasket: isRewardInBasketSelector,
        isCBRPromoAppliedInBasket: isCBRPromoAppliedInBasketSelector,
        isRewardsAvailable: isRewardsAvailableSelector,
        vibSegment: vibSegmentSelector
    }),
    {
        fetchProfileRewards: rewardActions.fetchProfileRewards,
        showRewardModal
    }
);
