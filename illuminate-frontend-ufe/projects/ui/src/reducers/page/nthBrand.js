import { SET_NTH_BRAND, SET_NTH_BRAND_FULFILLMENT_OPTIONS } from 'constants/actionTypes/nthBrand';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_NTH_BRAND: {
            const { data, requestOptions, displayOptions } = payload;

            return {
                ...initialState,
                ...data,
                requestOptions,
                displayOptions
            };
        }
        case SET_NTH_BRAND_FULFILLMENT_OPTIONS: {
            const nextState = {
                ...state,
                ...payload
            };

            return nextState;
        }
        default: {
            return state;
        }
    }
};

export default reducer;
