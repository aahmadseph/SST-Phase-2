import actions from 'actions/Actions';
const { TYPES: ACTION_TYPES } = actions;
const initialState = { isActive: false };
const reducer = function (state = initialState) {
    return state;
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
