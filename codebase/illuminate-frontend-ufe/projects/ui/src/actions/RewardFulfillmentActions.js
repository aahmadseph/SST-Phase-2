import * as ACTION_TYPES from 'constants/actionTypes/rewardFulfillment';

function showRewardFulfillmentMethodModal(isOpen, currentReward = {}) {
    return {
        type: ACTION_TYPES.SHOW_REWARD_FULFILLMENT_MODAL,
        payload: { isOpen, currentReward }
    };
}

export default {
    showRewardFulfillmentMethodModal
};
