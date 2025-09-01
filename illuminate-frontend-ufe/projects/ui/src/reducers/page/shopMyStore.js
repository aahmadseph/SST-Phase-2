import { SET_SHOP_MY_STORE, SET_SHOP_MY_STORE_SALE_ITEMS } from 'constants/actionTypes/happening';

const initialState = {
    isInitialized: false,
    sale: {}
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_SHOP_MY_STORE: {
            return { ...state, isInitialized: true, ...payload };
        }

        case SET_SHOP_MY_STORE_SALE_ITEMS: {
            const nextState = {
                ...state,
                sale: {
                    ...payload
                }
            };

            return nextState;
        }

        default: {
            return state;
        }
    }
};

export default { reducer, initialState };
