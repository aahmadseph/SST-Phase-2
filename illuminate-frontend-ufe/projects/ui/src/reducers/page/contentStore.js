import { SET_CONTENT_STORE } from 'constants/actionTypes/contentStore';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_CONTENT_STORE: {
            const { data } = payload;

            return {
                ...initialState,
                ...data
            };
        }
        default: {
            return state;
        }
    }
};

export default reducer;
