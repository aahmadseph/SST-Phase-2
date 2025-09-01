import productActionTypes from 'constants/actionTypes/product';
import ExtraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';
import UserSpecificProductUtils from 'utils/UserSpecificProduct';

const {
    UPDATE_CURRENT_PRODUCT,
    SET_PRODUCT,
    UPDATE_CURRENT_PRODUCT_USER_SPECIFIC,
    UPDATE_RESERVE_ONLINE_PICK_UP_IN_STORE_DETAILS,
    UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT,
    TOGGLE_CUSTOM_SETS,
    RESTORE_PRODUCT_WITH_NO_EXTRA_DETAILS,
    UPDATE_SAME_DAY_DELIVERY_DETAILS,
    UPDATE_HIGHLIGHTED_REVIEWS,
    REMOVE_HIGHLIGHTED_REVIEWS,
    SET_SELECTED_SENTIMENT,
    SET_PRODUCT_PAGE_FULFILLMENT_OPTIONS,
    SET_PRODUCT_VIEWS
} = productActionTypes;

const initialState = {
    currentSku: null,
    currentSkuQuantity: 1,
    currentProductUserSpecificDetails: {},
    isUserSpecificReady: false
};

const reducer = function (state = initialState, action) {
    // eslint-disable-next-line object-curly-newline
    const { type, payload } = action;

    switch (type) {
        case SET_PRODUCT: {
            const { product } = payload;
            product.brand = product.brand || {};
            Sephora.productPage = { defaultSkuId: product.currentSku.skuId };

            return {
                ...initialState,
                ...product
            };
        }
        case UPDATE_CURRENT_PRODUCT: {
            const currentProductWithUserSpecificDetails = UserSpecificProductUtils.addUserSpecificDetailsToProduct(
                action.currentProduct,
                state.currentProductUserSpecificDetails
            );

            return Object.assign({}, state, currentProductWithUserSpecificDetails);
        }
        case UPDATE_CURRENT_PRODUCT_USER_SPECIFIC: {
            const { currentProductUserSpecificDetails } = payload;
            const userSpecificDetails = UserSpecificProductUtils.addUserSpecificDetailsToProduct(state, currentProductUserSpecificDetails);

            return {
                ...userSpecificDetails,
                currentProductUserSpecificDetails
            };
        }
        case UPDATE_RESERVE_ONLINE_PICK_UP_IN_STORE_DETAILS: {
            const productWithRopisDetails = ExtraProductDetailsUtils.addReserveOnlinePickUpInStoreDetailsToProduct(
                Object.assign({}, state),
                action.reserveOnlinePickUpInStoreProductDetails
            );

            const properties = {
                ...productWithRopisDetails,
                ropisProduct: Object.assign({}, productWithRopisDetails)
            };

            if (!state.pickupMessage) {
                properties.noExtraPropertiesProduct = Object.assign({}, state);
            }

            return Object.assign({}, state, properties);
        }
        case RESTORE_PRODUCT_WITH_NO_EXTRA_DETAILS: {
            // TODO ROPIS: noExtraPropertiesProduct saves as currentSku the one the user has selected (obviously),
            // but after UPDATE_RESERVE_ONLINE_PICK_UP_IN_STORE_DETAILS is called (and thus noExtraPropertiesProduct
            // is created), the user can click through swatches and select another sku; so noExtraPropertiesProduct
            // and currentProduct's currentSkus will not be the same.
            // We need to search through the different types of children skus and replace the current sku
            // with the actual current sku and viceversa
            const productWithoutRopisDetails = ExtraProductDetailsUtils.removeReserveOnlinePickUpInStoreDetailsToProduct(
                Object.assign({}, state),
                state.noExtraPropertiesProduct
            );

            return Object.assign({}, state, productWithoutRopisDetails);
        }
        case UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT: {
            const { currentSku } = payload;
            const newState = {
                ...state,
                currentSku
            };

            return newState;
        }

        case UPDATE_SAME_DAY_DELIVERY_DETAILS: {
            const productWithSameDayDeliveryDetails = ExtraProductDetailsUtils.addReserveOnlinePickUpInStoreDetailsToProduct(
                Object.assign({}, state),
                action.sameDayDeliveryProductDetails
            );

            const properties = {
                ...productWithSameDayDeliveryDetails,
                sameDayDeliveryProduct: Object.assign({}, productWithSameDayDeliveryDetails)
            };

            properties.noExtraPropertiesProduct = Object.assign({}, state);

            return Object.assign({}, state, properties);
        }

        case TOGGLE_CUSTOM_SETS: {
            return Object.assign({}, state, { isOpenCustomSets: action.isOpen });
        }

        case UPDATE_HIGHLIGHTED_REVIEWS: {
            return Object.assign({}, state, { highlightedReviews: action.highlightedReviews });
        }

        case REMOVE_HIGHLIGHTED_REVIEWS: {
            return Object.assign({}, state, { highlightedReviews: null, selectedSentiment: null });
        }

        case SET_SELECTED_SENTIMENT: {
            return { ...state, selectedSentiment: action.selectedSentiment };
        }

        case SET_PRODUCT_PAGE_FULFILLMENT_OPTIONS: {
            const nextState = {
                ...state,
                fulfillmentOptions: payload.fulfillmentOptions
            };

            if (nextState.noExtraPropertiesProduct) {
                nextState.noExtraPropertiesProduct.fulfillmentOptions = payload.fulfillmentOptions;
            }

            return nextState;
        }

        case SET_PRODUCT_VIEWS: {
            return {
                ...state,
                productViews: payload
            };
        }

        default: {
            return state;
        }
    }
};

reducer.ACTION_TYPES = productActionTypes;

export default reducer;
