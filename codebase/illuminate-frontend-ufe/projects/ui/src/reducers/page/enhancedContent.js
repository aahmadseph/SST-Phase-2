import { SET_ENHANCED_CONTENT } from 'constants/actionTypes/enhancedContent';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ENHANCED_CONTENT: {
            const { data } = payload;

            return data;
        }
        default: {
            return state;
        }
    }
};

export default reducer;
