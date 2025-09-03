import { SET_CONTENT } from 'constants/actionTypes/content';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_CONTENT: {
            const { data } = payload;

            return data;
        }
        default: {
            return state;
        }
    }
};

export default reducer;
