import { SET_SEARCH, ADD_MORE_PRODUCTS } from 'constants/actionTypes/search';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    const newState = ({ data, requestOptions, displayOptions }) => ({
        ...data,
        currentPage: requestOptions.currentPage,
        displayOptions
    });

    switch (type) {
        case SET_SEARCH: {
            return newState(payload);
        }

        case ADD_MORE_PRODUCTS: {
            return {
                ...newState(payload),
                products: [...state.products, ...payload.data.products]
            };
        }

        default: {
            return state;
        }
    }
};

export default reducer;
