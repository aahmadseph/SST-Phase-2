import * as ACTION_TYPES from 'constants/actionTypes/rewardFulfillment';

const initialState = {
    showRewardFulfillmentMethodModal: false,
    currentReward: {}
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ACTION_TYPES.SHOW_REWARD_FULFILLMENT_MODAL: {
            const nextState = {
                ...state,
                showRewardFulfillmentMethodModal: payload.isOpen,
                currentReward: payload.currentReward
            };

            return nextState;
        }

        default:
            return state;
    }
};

export default reducer;
