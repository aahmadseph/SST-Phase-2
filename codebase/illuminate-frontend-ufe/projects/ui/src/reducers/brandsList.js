import { SET_USER_FAVORITE_BRANDS } from 'constants/actionTypes/brandsList';

const initialState = {
    userFavoriteBrandIDs: []
};

const setUserFavoriteBrandIDs = (state, action) => {
    return {
        ...state,
        userFavoriteBrandIDs: action.payload.userFavoriteBrandIDs
    };
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_USER_FAVORITE_BRANDS:
            return setUserFavoriteBrandIDs(state, action);
        default:
            return state;
    }
};

const ACTION_TYPES = { SET_USER_FAVORITE_BRANDS };

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
