import {
    SET_DYNAMIC_COMPONENTS_DATA
} from 'constants/actionTypes/dynamicComponent';

const initialState = {};

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case SET_DYNAMIC_COMPONENTS_DATA:
            return Object.assign({}, state, payload);

        default:
            return state;
    }
};

export default reducer;
