const ACTION_TYPES = { SET_SAMPLES: 'SET_SAMPLES' };

const initialState = { samples: null };

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_SAMPLES:
            return Object.assign({}, state, action.samples);
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
