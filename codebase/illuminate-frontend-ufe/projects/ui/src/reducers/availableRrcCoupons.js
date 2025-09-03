const ACTION_TYPES = {
    UPDATE_RRC_COUPONS: 'UPDATE_RRC_COUPONS'
};

const initialState = {
    coupons: []
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_RRC_COUPONS:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
