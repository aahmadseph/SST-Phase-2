import {
    SHOW_ERROR, RESET_ERROR, TOGGLE_SELECTED, SET_READY
} from 'constants/actionTypes/afterpay';

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
                isSelected: action.isSelected,
                isReady: state.isSelected !== action.isSelected ? false : state.isReady
            });
        case SHOW_ERROR:
            return Object.assign({}, state, {
                error: action.error,
                isSelected: false,
                isReady: false
            });
        case RESET_ERROR:
            return Object.assign({}, state, {
                error: null
            });
        case SET_READY:
            return Object.assign({}, state, {
                isReady: action.isReady
            });
        default:
            return state;
    }
};

export default reducer;
