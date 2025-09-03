import { UPDATE_PROFILE_STATUS, UPDATE_HAS_IDENTITY } from 'constants/actionTypes/auth';

const initialState = {
    profileStatus: 0,
    hasIdentity: null
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_PROFILE_STATUS:
            return {
                ...state,
                profileStatus: action.payload
            };
        case UPDATE_HAS_IDENTITY:
            return {
                ...state,
                hasIdentity: action.payload
            };
        default:
            return state;
    }
};

export default reducer;
