import Actions from 'Actions';
const { TYPES } = Actions;

const initialState = { rvData: null };

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case TYPES.ADD_RV_DATA:
            return {
                ...state,
                rvData: payload
            };
        default:
            return state;
    }
};

export default reducer;
