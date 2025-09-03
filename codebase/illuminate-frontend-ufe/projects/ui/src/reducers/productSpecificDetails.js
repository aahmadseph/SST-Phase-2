const ACTION_TYPES = {
    RESET_PRODUCT: 'RESET_PRODUCT',
    UPDATE_PRODUCT_SPECIFIC_DETAILS: 'UPDATE_PRODUCT_SPECIFIC_DETAILS'
};

const initialState = {
    item: {},
    pickupAvailability: {},
    sameDayAvailability: {}
};

const reducer = function (state = initialState, action = {}) {
    switch (action.type) {
        case ACTION_TYPES.RESET_PRODUCT:
            return Object.assign({}, initialState);
        case ACTION_TYPES.UPDATE_PRODUCT_SPECIFIC_DETAILS: {
            const [pickupAvailability, sameDayAvailability] = action.data;
            const nextState = {
                item: action.item,
                ...(pickupAvailability && { pickupAvailability }),
                ...(sameDayAvailability && { sameDayAvailability })
            };

            return Object.assign({}, state, nextState);
        }
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
