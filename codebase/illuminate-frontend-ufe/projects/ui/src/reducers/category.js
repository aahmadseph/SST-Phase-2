const ACTION_TYPES = {
    UPDATE_CATEGORIES: 'UPDATE_CATEGORIES',
    UPDATE_CURRENT_CATEGORY: 'UPDATE_CURRENT_CATEGORY'
};

const initialState = {
    categories: null,
    currentCategory: null
};

const reducer = function (state = initialState) {
    return state;
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
