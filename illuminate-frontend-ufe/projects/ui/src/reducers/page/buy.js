import { SET_BUY_PAGE } from 'constants/actionTypes/buy';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_BUY_PAGE: {
            return payload;
        }

        default: {
            return state;
        }
    }
};

export default reducer;
