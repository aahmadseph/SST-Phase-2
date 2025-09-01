import { SET_SPONSOR_PRODUCTS, RESET_SPONSOR_PRODUCTS, SET_SPONSOR_PRODUCTS_FAILURE } from 'constants/actionTypes/sponsorProducts';

const initialState = {
    products: [],
    loaded: false,
    error: false
};

const reducer = function (state = initialState, action = {}) {
    switch (action.type) {
        case RESET_SPONSOR_PRODUCTS:
            return initialState;

        case SET_SPONSOR_PRODUCTS:
            return {
                ...state,
                products: action.payload,
                loaded: true
            };

        case SET_SPONSOR_PRODUCTS_FAILURE:
            return {
                ...state,
                loaded: true,
                error: true
            };

        default:
            return state;
    }
};

export default reducer;
