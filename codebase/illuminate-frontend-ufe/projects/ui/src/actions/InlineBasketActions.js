import inlineBasketTypes from 'reducers/inline-basket';
const { ACTION_TYPES: TYPES } = inlineBasketTypes;

function addedProductsNotification(addedProductsCount) {
    return {
        type: TYPES.ADDED_PRODUCTS_NOTIFICATION,
        justAddedProducts: addedProductsCount
    };
}

function ReserveOnlinePickUpInStoreProductAdded(isRopisSkuAdded) {
    return {
        type: TYPES.ROPIS_PRODUCT_ADDED,
        isRopisSkuAdded: isRopisSkuAdded
    };
}

function productAdded(sku) {
    return {
        type: TYPES.PRODUCT_ADDED_TO_BASKET,
        sku
    };
}

export default {
    TYPES,
    addedProductsNotification: addedProductsNotification,
    ReserveOnlinePickUpInStoreProductAdded: ReserveOnlinePickUpInStoreProductAdded,
    productAdded
};
