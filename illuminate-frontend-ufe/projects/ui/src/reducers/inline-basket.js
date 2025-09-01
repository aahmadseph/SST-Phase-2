const ACTION_TYPES = {
    ADDED_PRODUCTS_NOTIFICATION: 'ADDED_PRODUCTS_NOTIFICATION',
    ROPIS_PRODUCT_ADDED: 'ROPIS_PRODUCT_ADDED',
    PRODUCT_ADDED_TO_BASKET: 'PRODUCT_ADDED_TO_BASKET'
};

const initialState = {
    justAddedProducts: 0,
    isOpen: false,
    isRopisSkuAdded: false,
    sku: null
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.ADDED_PRODUCTS_NOTIFICATION:
            return Object.assign({}, state, { justAddedProducts: state.justAddedProducts + action.justAddedProducts });
        case ACTION_TYPES.ROPIS_PRODUCT_ADDED:
            return Object.assign({}, state, { isRopisSkuAdded: action.isRopisSkuAdded });
        case ACTION_TYPES.PRODUCT_ADDED_TO_BASKET:
            return Object.assign({}, state, { sku: action.sku });
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
