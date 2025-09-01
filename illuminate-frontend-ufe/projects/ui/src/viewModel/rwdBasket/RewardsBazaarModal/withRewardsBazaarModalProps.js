import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import basketSelector from 'selectors/basket/basketSelector';
import rewardsSelector from 'selectors/rewards/rewardsSelector';
import BasketUserDataSelector from 'selectors/page/rwdBasket/basketUserDataSelector';
import { setFromBazaar } from 'actions/RewardBazaarActions';
const { basketUserDataSelector } = BasketUserDataSelector;
import { rewardFulfillmentSelector } from 'selectors/rewardFulfillment/rewardFulfillmentSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    rewardsSelector,
    basketUserDataSelector,
    basketSelector,
    rewardFulfillmentSelector,
    (availableRewards, user, basket, rewardFulfillment) => {
        return {
            availableRewards,
            biAccount: {
                biPoints: basket.netBeautyBankPointsAvailable,
                biStatus: user.biStatus,
                birthdayRewardDaysLeft: user.birthdayRewardDaysLeft
            },
            showRewardFulfillmentMethodModal: rewardFulfillment.showRewardFulfillmentMethodModal,
            basket
        };
    }
);

const functions = {
    setFromBazaar
};

const withRewardsBazaarModalProps = wrapHOC(connect(fields, functions));

export {
    withRewardsBazaarModalProps, fields, functions
};
