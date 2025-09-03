import { SET_MY_LISTS, GET_MY_LISTS_INITIAL_DATA } from 'constants/actionTypes/myLists';

const initialState = {
    allLoves: [],
    samples: {},
    isInitialized: false
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_MY_LISTS_INITIAL_DATA:
        case SET_MY_LISTS: {
            return { ...state, ...payload, isInitialized: true };
        }

        default: {
            return state;
        }
    }
};

export default { reducer, initialState };
