const ACTION_TYPES = {
    HIDE_SEARCH_RESULTS: 'HIDE_SEARCH_RESULTS',
    SHOW_SEARCH_RESULTS: 'SHOW_SEARCH_RESULTS',
    SHOW_ZERO_STATE_RESULTS: 'SHOW_ZERO_STATE_SEARCH_RESULTS'
};

const initialState = {
    focus: false,
    keyword: null
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_ZERO_STATE_RESULTS:
            return Object.assign({}, state, {
                results: action.results,
                focus: true
            });
        case ACTION_TYPES.HIDE_SEARCH_RESULTS:
            return Object.assign({}, state, { focus: false });
        case ACTION_TYPES.SHOW_SEARCH_RESULTS:
            return Object.assign({}, state, {
                results: action.results,
                keyword: action.keyword,
                focus: true
            });
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
