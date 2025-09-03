const ACTION_TYPES = { UPDATE_TARGETED_PROMOTIOM: 'UPDATE_TARGETED_PROMOTIOM' };

const initialState = {};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_TARGETED_PROMOTIOM:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
