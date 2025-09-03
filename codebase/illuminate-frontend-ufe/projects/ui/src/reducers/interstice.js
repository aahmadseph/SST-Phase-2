import actions from 'actions/Actions';
const { TYPES: ACTION_TYPES } = actions;

const initialState = { isVisible: false };

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_INTERSTICE:
            return Object.assign({}, state, { isVisible: action.isVisible });

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
