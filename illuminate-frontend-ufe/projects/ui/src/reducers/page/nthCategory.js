import { SET_NTH_CATEGORY, SET_NTH_CATEGORY_FULFILLMENT_OPTIONS } from 'constants/actionTypes/nthCategory';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_NTH_CATEGORY: {
            const { data, requestOptions, displayOptions } = payload;

            return {
                ...initialState,
                ...data,
                requestOptions,
                displayOptions
            };
        }
        case SET_NTH_CATEGORY_FULFILLMENT_OPTIONS: {
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
