import { SET_HOME_PAGE } from 'constants/actionTypes/home';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_HOME_PAGE: {
            return payload;
        }

        default: {
            return state;
        }
    }
};

export default reducer;
