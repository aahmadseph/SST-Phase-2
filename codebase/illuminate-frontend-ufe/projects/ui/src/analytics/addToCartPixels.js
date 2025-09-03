/*eslint camelcase: ["error", {properties: "never"}]*/
import anaConsts from 'analytics/constants';

export default {
    pinterestAddToCartEvent: function (data) {
        Sephora.analytics.promises.PinterestBasePixelInitialized.then(() => {
            const pinterestAddToCartEvent = new CustomEvent('pinterestAddToCartEvent', { detail: data });
            window.dispatchEvent(pinterestAddToCartEvent);
        });
    },

    snapChatAddToCartEvent: function (amount, quantity, currency, items) {
        const data = {
            price: amount,
            number_items: quantity,
            currency: currency,
            item_ids: items.join(',')
        };
        const snapchatAddToCartEvent = new CustomEvent('snapChatAddToCartEvent', { detail: data });
        window.dispatchEvent(snapchatAddToCartEvent);
    },

    googleAnalyticsAddToBasketEvent: function (data) {
        window.dispatchEvent(new CustomEvent(anaConsts.EVENT_NAMES.ADD_TO_BASKET, { detail: data }));
    },

    facebookAddToBasketEvent: function (data) {
        window.dispatchEvent(new CustomEvent(anaConsts.EVENT_NAMES.FACEBOOK_ADD_TO_BASKET, { detail: data }));
    },

    googleAnalyticsRemoveFromBasketEvent: function (data) {
        window.dispatchEvent(new CustomEvent(anaConsts.EVENT_NAMES.REMOVE_FROM_BASKET, { detail: data }));
    },

    googleAnalyticsBeginCheckout: function () {
        window.dispatchEvent(new CustomEvent(anaConsts.EVENT_NAMES.GA_BEGIN_CHECKOUT));
    }
};
