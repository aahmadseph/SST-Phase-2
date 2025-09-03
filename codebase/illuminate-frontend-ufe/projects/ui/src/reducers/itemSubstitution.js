import * as ACTION_TYPES from 'constants/actionTypes/itemSubstitution';

const initialState = {
    selectedProductId: null,
    isLoadingProductRecs: false,
    recoProducts: [],
    errorMessage: null,
    addItemErrorMessage: null,
    removeItemErrorMessage: null
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ACTION_TYPES.SHOW_PRODUCT_RECS_LOADING: {
            const nextState = {
                ...state,
                isLoadingProductRecs: payload
            };

            return nextState;
        }

        case ACTION_TYPES.GET_PRODUCT_RECS: {
            const nextState = {
                ...state,
                firstChoiceItem: payload.firstChoiceItem,
                recoProducts: payload.recoProducts,
                selectedProductId: payload.selectedProductId
            };

            return nextState;
        }

        case ACTION_TYPES.SELECT_PRODUCT_REC: {
            const nextState = {
                ...state,
                addItemErrorMessage: null,
                selectedProductId: payload
            };

            return nextState;
        }

        case ACTION_TYPES.SET_PRODUCT_DETAILS: {
            const nextState = {
                ...state,
                recoProducts: [...state.recoProducts]
            };

            const recoIdx = nextState.recoProducts.findIndex(product => product.productId === payload.productRecId);

            if (recoIdx >= 0) {
                nextState.recoProducts[recoIdx].productPage = payload.productPage;
                nextState.recoProducts[recoIdx].currentSku = payload.productPage.currentSku;
            }

            return nextState;
        }

        case ACTION_TYPES.RESET_ITEM_SUBSTITUTION_MODAL: {
            const nextState = {
                ...initialState
            };

            return nextState;
        }

        case ACTION_TYPES.UPDATE_CURRENT_SKU: {
            const recoIdx = state.recoProducts.findIndex(product => product.productId === state.selectedProductId);

            if (recoIdx >= 0) {
                // Clone the recoProducts array and update the specific product
                const updatedRecoProducts = state.recoProducts.map((product, index) => {
                    if (index === recoIdx) {
                        return {
                            ...product,
                            productPage: {
                                ...product.productPage,
                                currentSku: payload.sku
                            },
                            currentSku: payload.sku
                        };
                    }

                    return product;
                });

                // Return the updated state
                return {
                    ...state,
                    recoProducts: updatedRecoProducts
                };
            }

            return state;
        }

        case ACTION_TYPES.SHOW_ERROR: {
            const nextState = {
                ...state,
                errorMessage: payload.errorMessage
            };

            return nextState;
        }

        case ACTION_TYPES.SHOW_ADD_ITEM_ERROR: {
            const nextState = {
                ...state,
                addItemErrorMessage: payload.errorMessage
            };

            return nextState;
        }

        case ACTION_TYPES.SHOW_REMOVE_ITEM_ERROR: {
            const nextState = {
                ...state,
                removeItemErrorMessage: payload.errorMessage
            };

            return nextState;
        }

        default:
            return state;
    }
};

export default reducer;
