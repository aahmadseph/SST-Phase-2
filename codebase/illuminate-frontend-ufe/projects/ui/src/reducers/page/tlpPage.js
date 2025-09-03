import { SET_TLP_PAGE } from 'constants/actionTypes/tlp';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_TLP_PAGE: {
            return payload;
        }

        default: {
            return state;
        }
    }
};

export default reducer;
