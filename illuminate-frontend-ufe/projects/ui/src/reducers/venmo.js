import {
    TOGGLE_SELECTED, SET_READY, SHOW_INLINE_ERROR, RESET_VENMO_ERROR
} from 'constants/actionTypes/venmo';

const initialState = {
    isReady: false,
    isSelected: false,
    error: null,
    isActive: false
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_SELECTED:
            return Object.assign({}, state, {
                isSelected: action.isSelected
            });
        case SHOW_INLINE_ERROR:
            return Object.assign({}, state, {
                error: action.error,
                isSelected: false
            });
        case SET_READY:
            return Object.assign({}, state, {
                isReady: action.isReady
            });

        case RESET_VENMO_ERROR:
            return Object.assign({}, state, {
                error: null
            });
        default:
            return state;
    }
};

export default reducer;
