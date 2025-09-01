import {
    TOGGLE_SELECTED, SET_READY, SHOW_INLINE_ERROR, RESET_PAZE_ERROR
} from 'constants/actionTypes/paze';

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
        case SHOW_INLINE_ERROR:
            return Object.assign({}, state, {
                error: action.error,
                isSelected: false,
                isReady: false
            });
        case SET_READY:
            return Object.assign({}, state, {
                isReady: action.isReady
            });

        case RESET_PAZE_ERROR:
            return Object.assign({}, state, {
                error: null
            });
        default:
            return state;
    }
};

export default reducer;
