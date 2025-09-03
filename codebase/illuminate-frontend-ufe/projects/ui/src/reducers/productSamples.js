import ACTION_TYPES from 'constants/actionTypes/productSamples';

const initialState = { product: {} };

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case ACTION_TYPES.SET_PRODUCT_SAMPLE:
            return Object.assign({}, state, { product: payload.product });
        default:
            return state;
    }
};

export default reducer;
