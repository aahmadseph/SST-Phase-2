const ACTION_TYPES = {
    SET_COMPACT_HEADER_FOOTER: 'SET_COMPACT_HEADER_FOOTER'
};

const initialState = {
    isCompact: false
};

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case ACTION_TYPES.SET_COMPACT_HEADER_FOOTER: {
            return {
                ...state,
                isCompact: payload.data
            };
        }

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
