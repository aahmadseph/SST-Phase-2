import { BASKET_TYPES } from 'constants/RwdBasket';

function findBasketTypeByCommerceId(commerceId, basket) {
    const pickupItem = basket?.pickupBasket?.items?.find(item => item.commerceId === commerceId);

    if (pickupItem) {
        return BASKET_TYPES.BOPIS_BASKET;
    }

    for (const basketItem of basket?.itemsByBasket) {
        const foundItem = basketItem?.items?.find(item => item.commerceId === commerceId);

        if (foundItem) {
            return basketItem.basketType;
        }
    }

    return null;
}

function findSelectedProductId(recoProducts = []) {
    for (const recoProduct of recoProducts) {
        if (recoProduct?.productPage?.productId) {
            return recoProduct.productPage.productId;
        }
    }

    return null;
}

export default { findBasketTypeByCommerceId, findSelectedProductId };
