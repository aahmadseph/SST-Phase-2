const ACTION_TYPES = { RESET_SESSION_EXPIRY: 'RESET_SESSION_EXPIRY' };

const initialState = {};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.RESET_SESSION_EXPIRY:
            return Object.assign({}, state, action.resetSessionExpiry);
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
