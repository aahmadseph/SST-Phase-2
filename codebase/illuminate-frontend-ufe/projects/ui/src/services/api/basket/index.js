// This module provides API call methods for Sephora Commerce Basket APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Basket+APIs

import getSamples from 'services/api/basket/getSamples';
import getBasketDetails from 'services/api/basket/getBasketDetails';
import addToCart from 'services/api/basket/addToCart';
import applyPromotion from 'services/api/basket/applyPromotion';
import updateBasket from 'services/api/basket/updateBasket';
import addSamplesToBasket from 'services/api/basket/addSamplesToBasket';
import addMsgPromotionToBasket from 'services/api/basket/addMsgPromotionToBasket';
import removePromotion from 'services/api/basket/removePromotion';
import removeSkuFromBasket from 'services/api/basket/removeSkuFromBasket';
import switchBasketItem from 'services/api/basket/switchBasketItem';

export default {
    getSamples,
    getBasketDetails,
    addToCart,
    applyPromotion,
    updateBasket,
    addSamplesToBasket,
    addMsgPromotionToBasket,
    removePromotion,
    removeSkuFromBasket,
    switchBasketItem
};
