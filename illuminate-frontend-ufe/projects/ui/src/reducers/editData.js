const ACTION_TYPES = {
    UPDATE_EDIT_ORDER_DATA: 'UPDATE_EDIT_ORDER_DATA',
    CLEAR_EDIT_DATA: 'CLEAR_EDIT_DATA'
};

const initialState = {};

/**
 * If removing property from basket state, don't remove property entirely.
 * If you do, state will not reflect change due to object.assign.
 * Instead set property value to null to simulate removal, this will update state.
 */
const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_EDIT_ORDER_DATA: {
            const { data = {}, name } = action;

            return Object.assign({}, state, { [name]: data });
        }
        case ACTION_TYPES.CLEAR_EDIT_DATA: {
            return Object.assign({}, state, { [action.name]: {} });
        }
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
