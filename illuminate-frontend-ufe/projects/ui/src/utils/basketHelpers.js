import { BASKET_TYPES } from 'actions/ActionsConstants';
import Empty from 'constants/empty';

const BasketHelpers = {
    /**
     * Returns true if the given sku is in any basket (SDD, STH, Pickup)
     * @param sku
     * @param basketItems (basket object, if not present, we use the current Redux store basket)
     * @returns {boolean}
     */
    getSkuBasketType({ sku, basket }) {
        const itemsByBasket = basket?.itemsByBasket || Empty.Array;
        const pickupBasketItems = basket?.pickupBasket?.items || Empty.Array;

        // Check in SameDay and ShipToHome baskets
        for (const itemsList of itemsByBasket) {
            const mappedBasketType = Object.values(BASKET_TYPES).find(type => type === itemsList.basketType) || itemsList.basketType;

            if (itemsList.items.some(item => item.sku.skuId === sku.skuId)) {
                return mappedBasketType;
            }
        }

        // Check in Pickup basket
        if (pickupBasketItems.some(item => item.sku.skuId === sku.skuId)) {
            return BASKET_TYPES.PICKUP_BASKET;
        }

        return '';
    }
};

export default BasketHelpers;
