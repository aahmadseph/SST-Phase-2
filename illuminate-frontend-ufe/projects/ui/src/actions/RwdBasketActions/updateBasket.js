import LOCAL_STORAGE from 'utils/localStorage/Constants';
import rwdBasket from 'reducers/rwdBasket';
import Storage from 'utils/localStorage/Storage';

const { ACTION_TYPES } = rwdBasket;

const BASKET_EXPIRY = Storage.MINUTES * 15;

function updateBasket({ newBasket, shouldCalculateRootBasketType }) {
    if (newBasket == null || Object.keys(newBasket).length === 0) {
        return () => {
            return null;
        };
    }

    const isHardLoad = !newBasket.isInitialized;

    if (isHardLoad) {
        newBasket.isInitialized = true;

        if (newBasket.pickupBasket) {
            newBasket.pickupBasket.isInitialized = true;
        }
    }

    /* We cache basket data each time the basket is updated with fresh API data so we do not have
     to call the user/full API on each page load. However, we set an expire time of 15 minutes. */
    Storage.local.setItem(LOCAL_STORAGE.BASKET, newBasket, BASKET_EXPIRY);

    if (digitalData.cart) {
        digitalData.cart.itemsByBasket = newBasket.itemsByBasket;
        digitalData.cart.item = newBasket.items;
    }

    return {
        type: ACTION_TYPES.UPDATE_BASKET,
        basket: newBasket,
        shouldCalculateRootBasketType
    };
}

export { updateBasket };
