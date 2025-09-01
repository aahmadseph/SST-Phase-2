const ACTION_TYPES = {
    SET_ALL_COOKIES: 'SET_ALL_COOKIES',
    SET_COOKIE: 'SET_COOKIE',
    DELETE_COOKIE: 'DELETE_COOKIE'
};

const initialState = {};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_ALL_COOKIES:
            /*jshint ignore:start*/
            return {
                ...state,
                ...action.cookies
            };
            /*jshint ignore:end*/

        case ACTION_TYPES.SET_COOKIE:
            return Object.assign({}, state, { [action.name]: action.value });

        case ACTION_TYPES.DELETE_COOKIE:
            return Object.keys(state)
                .filter(key => key !== action.cookie)
                .reduce((result, current) => {
                    result[current] = state[current];

                    return result;
                }, {});

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
