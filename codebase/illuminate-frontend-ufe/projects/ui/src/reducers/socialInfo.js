const ACTION_TYPES = {
    SET_USER_SOCIAL_INFO: 'SET_USER_SOCIAL_INFO',
    SET_LITHIUM_SUCCESS_STATUS: 'SET_LITHIUM_SUCCESS_STATUS'
};

const initialState = { isLithiumSuccessful: null };

const reducer = function (state = initialState, action) {
    switch (action.type) {
        //TODO: add other social necessary data to socialInfo object
        case ACTION_TYPES.SET_USER_SOCIAL_INFO:
            return Object.assign({}, state, action.socialInfo);

        case ACTION_TYPES.SET_LITHIUM_SUCCESS_STATUS:
            return Object.assign({}, state, { isLithiumSuccessful: action.isLithiumSuccessful });

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
