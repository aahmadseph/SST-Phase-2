import Actions from 'Actions';
const { TYPES } = Actions;

const initialState = { items: null };

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case TYPES.ADD_BEAUTY_RECOMMENDATIONS:
            return {
                ...state,
                items: payload
            };
        default:
            return state;
    }
};

export default reducer;
