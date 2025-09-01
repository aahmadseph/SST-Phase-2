const ACTION_TYPES = {
    UPDATE_CC_BANNER: 'UPDATE_CC_BANNER'
};

const initialState = { ccTargeters: {}, ccBanner: {} };

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_CC_BANNER:
            return Object.assign({}, state, { ccBanner: action.ccBanner });
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
