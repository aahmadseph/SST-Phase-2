import { UPDATE_ROUGE_EXCLUSIVE_REWARDS } from 'constants/actionTypes/rougeRewards';

const initialState = {
    rougeExclusiveRewards: []
};

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case UPDATE_ROUGE_EXCLUSIVE_REWARDS:
            return Object.assign({}, state, {
                rougeExclusiveRewards: [...payload]
            });
        default:
            return state;
    }
};

export default reducer;
