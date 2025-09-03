const ACTION_TYPES = { UPDATE_PERSONALIZED_PROMOTIONS: 'UPDATE_PERSONALIZED_PROMOTIONS' };

const initialState = { items: [] };

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_PERSONALIZED_PROMOTIONS:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
