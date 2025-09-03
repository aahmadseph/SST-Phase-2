import {
    SHOW_ERROR, TOGGLE_SHIPPING, TOGGLE_SELECTED, OBSERVE_MODAL, SET_READY
} from 'constants/actionTypes/klarna';

const initialState = {
    isReady: false,
    isSelected: false,
    useMyShippingAddress: false,
    error: null,
    isActive: false
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_SELECTED:
            return Object.assign({}, state, {
                isSelected: action.isSelected,
                isReady: false
            });
        case SHOW_ERROR:
            return Object.assign({}, state, {
                error: action.error,
                isSelected: false,
                isReady: false
            });
        case SET_READY:
            return Object.assign({}, state, {
                isReady: action.isReady
            });
        case TOGGLE_SHIPPING:
            return Object.assign({}, state, { useMyShippingAddress: action.useMyShippingAddress });
        case OBSERVE_MODAL:
            return Object.assign({}, state, { isActive: action.isActive });
        default:
            return state;
    }
};

export default reducer;
