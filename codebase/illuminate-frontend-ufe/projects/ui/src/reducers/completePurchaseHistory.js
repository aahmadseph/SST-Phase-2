import Actions from 'Actions';
const { TYPES } = Actions;

const initialState = { items: null };

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case TYPES.UPDATE_COMPLETE_PURCHASE_HISTORY_ITEMS:
            return {
                ...state,
                items: payload
            };
        default:
            return state;
    }
};

export default reducer;
