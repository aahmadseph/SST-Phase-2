/* eslint-disable complexity */
import React from 'react';
import reject from './functions/reject';
import skuUtils from './Sku';
import userUtils from './User';
import store from 'Store';
import localeUtils from './LanguageLocale';
import helperUtils from './Helpers';
import Storage from './localStorage/Storage';
import LOCAL_STORAGE from './localStorage/Constants';
import basketConstants from 'constants/Basket';
import { BASKET_TYPES } from 'actions/ActionsConstants';
import Empty from 'constants/empty';
import skuHelpers from 'utils/skuHelpers';

const { getProp } = helperUtils;

function getItemByType(type) {
    const basket = store.getState().basket;
    const items = (basket.items || []).filter(function (item) {
        if ((item.sku.type || '').toLowerCase() === type) {
            return true;
        }

        // Roge Rewards Cards are special as skuType = standard, so we have to check for
        // other properties
        if (skuUtils.skuTypes.ROUGE_REWARD_CARD === type && skuUtils.isRougeRewardCard(item.sku)) {
            return true;
        }

        return false;
    });

    return items.length && items[0];
}

const getBasketType = (basket, isSddItem) => {
    return isSddItem ? basket.itemsByBasket.find(b => b.basketType === 'SameDay') : basket.itemsByBasket.find(b => b.basketType === 'ShipToHome');
};

const Basket = {
    ADD_TO_BASKET_TYPES: {
        SPECIAL: 'special',
        SECONDARY: 'secondary',
        PRIMARY: 'primary',
        LINK: 'link'
    },

    PAGE_URL: '/basket',

    separateItems: function (newBasket) {
        const separatedItems = {
            rewards: [],
            promos: [],
            samples: [],
            products: [],
            replenishmentDiscountAmount: ''
        };

        newBasket.items &&
            newBasket.items.forEach(function (element) {
                if (element.sku && skuUtils.isSample(element.sku)) {
                    separatedItems.samples.push(element);
                } else if (element.sku && skuUtils.isBiReward(element.sku)) {
                    separatedItems.rewards.push(element);
                } else {
                    separatedItems.products.push(element);
                }
            });
        separatedItems.replenishmentDiscountAmount = newBasket.replenishmentDiscountAmount || '';

        return Object.assign({}, newBasket, separatedItems);
    },

    getBasketTypeItemCount: function (itemsByType) {
        /* eslint-disable-next-line no-param-reassign */
        return itemsByType.reduce((acc, item) => (acc += item.qty), 0);
    },

    isSameDayBasketType: function ({ basketType }) {
        return basketType === BASKET_TYPES.SAMEDAY_BASKET;
    },

    isStandardBasketType: function ({ basketType }) {
        return basketType === BASKET_TYPES.STANDARD_BASKET;
    },

    removeUpdatedItemFromItems: function ({ items, newItem }) {
        return reject(items, prevItem => prevItem.sku.skuId === newItem.sku.skuId);
    },

    arraysDifference: function (arrayOne = [], arrayTwo = []) {
        return arrayOne.filter(({ sku: sku1 }) => !arrayTwo.some(({ sku: sku2 }) => sku1.skuId === sku2.skuId));
    },

    getBasketType: function (basket = {}, type) {
        return basket.itemsByBasket?.find(b => b.basketType === BASKET_TYPES[type]);
    },

    getNextBasketTypeAuto: function () {
        /**
         * When user tries to navigate to basket page, and we
         * are not able to determine which basket we need to
         * render next under /basket page (pre-basket or DC basket),
         * we are going to rely on this simple sentence:
         *   "Render DC Basket unless basket data contains pickup items".
         */
        let basketType = BASKET_TYPES.DC_BASKET;

        if (this.hasPickupItems()) {
            basketType = BASKET_TYPES.PREBASKET;
        }

        return basketType;
    },

    calculateUpdatedBasket: function (newBasket, lastItem, isLastItemSameDay = false) {
        /**
         * Ideally, we should delete this function in the future.
         * CE team added the query parameter `includeAllBasketItems` to the /items endpoint
         * but we cannot use that here.  We need to be able to check the `item` array as
         * it contains the most recently added item (as opposed to includeAllBasketItems=true where
         * the items array contains all DC_BASKET items). Ideally, the /items endpoint response would always
         * return the full basket in the `items` and `itemsByBasket` arrays and also contain a separate
         *  field indicating what the last added item was.
         *
         * For now, this function will merge basket.items and basket.itemsByBasket from the store
         * with the most recent POST response from /items.
         * It will also add a `lastAddedItem` property.
         */
        if (!newBasket) {
            throw new Error(`newBasket is ${newBasket}`);
        }

        const newItem = newBasket.items[0];
        const newItemByBasket = newBasket.itemsByBasket.length > 1 ? getBasketType(newBasket, isLastItemSameDay) : newBasket.itemsByBasket[0];

        // POST /items response should always contain the most recent item
        if (!newItem || !newItemByBasket) {
            throw new Error('calculateUpdatedBasket called without passing new item');
        }

        const { basket } = store.getState();

        // If previous basket is empty
        // then we can trivially add the new item
        if (basket.items.length === 0) {
            return {
                ...newBasket,
                items: [newItem],
                itemsByBasket: [newItemByBasket],
                lastAddedItem: newItemByBasket
            };
        }

        // move updated item to front of items list
        const filteredItems = this.removeUpdatedItemFromItems({
            items: basket.items,
            newItem
        });
        const items = [newItem, ...filteredItems];

        // move updated typed item into matching itemsByBasket list
        const itemsByBasket = [];
        const sameDayDeliveryBasket = this.getBasketType(basket, 'SAMEDAY_BASKET');
        const standardDeliveryBasket = this.getBasketType(basket, 'STANDARD_BASKET');

        const actualLastItem = lastItem || newItemByBasket.items[0];

        // The same sku cannot exist in both basket types
        // So we must be sure to check each type in order to completely remove it
        const filteredSameDayItems = sameDayDeliveryBasket?.items.length
            ? this.removeUpdatedItemFromItems({
                items: sameDayDeliveryBasket.items,
                newItem: actualLastItem
            })
            : [];
        const filteredStandardItems = standardDeliveryBasket?.items.length
            ? this.removeUpdatedItemFromItems({
                items: standardDeliveryBasket.items,
                newItem: actualLastItem
            })
            : [];

        if (sameDayDeliveryBasket && filteredSameDayItems.length > 0) {
            if (this.isStandardBasketType(newItemByBasket)) {
                if (!isLastItemSameDay && sameDayDeliveryBasket.items.find(item => item.sku.skuId === actualLastItem.sku.skuId)) {
                    sameDayDeliveryBasket.items = filteredSameDayItems;
                }
            }

            if (this.isSameDayBasketType(newItemByBasket)) {
                sameDayDeliveryBasket.items = [actualLastItem, ...filteredSameDayItems];
                sameDayDeliveryBasket.itemsCount = this.getBasketTypeItemCount(sameDayDeliveryBasket.items);
            }

            itemsByBasket.push(sameDayDeliveryBasket);
        } else if (this.isSameDayBasketType(newItemByBasket)) {
            itemsByBasket.push(newItemByBasket);
        }

        if (standardDeliveryBasket && filteredStandardItems.length > 0) {
            if (this.isSameDayBasketType(newItemByBasket)) {
                // If the last item is same day, we need to ensure it is not added to standard basket
                if (isLastItemSameDay && standardDeliveryBasket.items.find(item => item.sku.skuId === actualLastItem.sku.skuId)) {
                    standardDeliveryBasket.items = filteredStandardItems;
                }
            }

            if (this.isStandardBasketType(newItemByBasket)) {
                standardDeliveryBasket.items = [actualLastItem, ...filteredStandardItems];
                standardDeliveryBasket.itemsCount = this.getBasketTypeItemCount(standardDeliveryBasket.items);
            }

            itemsByBasket.push(standardDeliveryBasket);
        } else if (this.isStandardBasketType(newItemByBasket)) {
            itemsByBasket.push(newItemByBasket);
        }

        return {
            ...newBasket,
            items,
            itemsByBasket,
            lastAddedItem: newItemByBasket
        };
    },

    calculateUpdatedBasketProductBundling: function (newBasket) {
        if (!newBasket) {
            throw new Error(`newBasket is ${newBasket}`);
        }

        const newItems = newBasket.items;
        const newItemsByBasket = newBasket.itemsByBasket[0];

        if (!newItems || !newItemsByBasket) {
            throw new Error('calculateUpdatedBasket called without passing new item');
        }

        const { basket } = store.getState();

        if (basket.items.length === 0) {
            return {
                ...newBasket,
                items: newItems,
                itemsByBasket: [newItemsByBasket],
                lastAddedItem: newItemsByBasket
            };
        }

        const filteredItems = this.arraysDifference(basket.items, newBasket.items);
        const items = [...newItems, ...filteredItems];

        // move updated typed item into matching itemsByBasket list
        const itemsByBasket = [];
        const sameDayDeliveryBasket = this.getBasketType(basket, 'SAMEDAY_BASKET');
        const standardDeliveryBasket = this.getBasketType(basket, 'STANDARD_BASKET');

        // // The same sku cannot exist in both basket types
        // So we must be sure to check each type in order to completely remove it
        const filteredSameDayItems = sameDayDeliveryBasket?.items.length
            ? this.arraysDifference(sameDayDeliveryBasket.items, newItemsByBasket.items)
            : [];
        const filteredStandardItems = standardDeliveryBasket?.items.length
            ? this.arraysDifference(standardDeliveryBasket.items, newItemsByBasket.items)
            : [];

        if (sameDayDeliveryBasket && filteredSameDayItems.length > 0) {
            if (this.isSameDayBasketType(newItemsByBasket)) {
                sameDayDeliveryBasket.items = [...newItemsByBasket.items, ...filteredSameDayItems];
                sameDayDeliveryBasket.itemsCount = this.getBasketTypeItemCount(sameDayDeliveryBasket.items);
            }

            itemsByBasket.push(sameDayDeliveryBasket);
        } else if (this.isSameDayBasketType(newItemsByBasket)) {
            itemsByBasket.push(newItemsByBasket);
        }

        if (standardDeliveryBasket && filteredStandardItems.length > 0) {
            if (this.isStandardBasketType(newItemsByBasket)) {
                standardDeliveryBasket.items = [...newItemsByBasket.items, ...filteredStandardItems];
                standardDeliveryBasket.itemsCount = this.getBasketTypeItemCount(standardDeliveryBasket.items);
            }

            itemsByBasket.push(standardDeliveryBasket);
        } else if (this.isStandardBasketType(newItemsByBasket)) {
            itemsByBasket.push(newItemsByBasket);
        }

        return {
            ...newBasket,
            items,
            itemsByBasket: [...itemsByBasket],
            lastAddedItem: newItemsByBasket
        };
    },

    catchItemLevelErrors: function (result, newBasket) {
        const basket = newBasket ? newBasket : store.getState().basket;
        const updatedBasket = Object.assign({}, basket);
        updatedBasket.items = updatedBasket.items && updatedBasket.items.slice();
        let basketErrors = {};
        const isAutoReplenishError = this.isAutoReplenishError(result.errorCode);

        if (result && result.errors && !isAutoReplenishError) {
            basketErrors = Object.assign(basketErrors, updatedBasket.errors, result.errors);
        }

        const items = [];

        if (Array.isArray(updatedBasket.items)) {
            updatedBasket.items.forEach(item => {
                if (basketErrors && basketErrors[item.sku.skuId]) {
                    items.push(
                        Object.assign({}, item, {
                            itemLevelMessages: [
                                {
                                    messages: [basketErrors[item.sku.skuId]],
                                    tag: Math.random() //Makes errors to be marked dirty and shown in basket
                                }
                            ]
                        })
                    );
                }
            });
        }

        return items.length ? items : undefined;
    },

    catchItemLevelMessages: function (basket) {
        if (!Array.isArray(basket.items)) {
            return null;
        }

        const messages = [];
        basket.items.forEach(item => {
            if (Array.isArray(item.itemLevelMessages)) {
                messages.push(item.itemLevelMessages.map(itemLevelMessage => itemLevelMessage.messages.join('')).join(''));
            }
        });

        return messages.length ? messages : undefined;
    },

    getOrderId: function () {
        const basket = store.getState().basket;

        return basket.orderId;
    },

    getAnonymousUserId: function () {
        const currentUser = store.getState().user;

        return Sephora.Util.getBasketCache(currentUser)?.profileId;
    },

    /**
     * Note that basket.subtotal factors in promos.  The merchandise total before promos is
     * in basket.rawSubtotal
     * @param withCurrency
     * @returns {*}
     */
    getSubtotal: function (withCurrency, isPickupOrder) {
        const basketData = store.getState().basket;
        const basket = isPickupOrder ? basketData.pickupBasket : basketData;

        if (withCurrency) {
            return basket.subtotal;
        } else {
            return Number(this.removeCurrency(basket?.subtotal));
        }
    },

    removeCurrency: function (amount = '') {
        // Check if amount is not a string
        if (!amount || !amount?.length) {
            return '0';
        }

        // First, remove currency and spaces
        let formattedAmount = amount.replace(/[^\d.,-]/g, '');
        // Then, replace decimal comma on dot, if presented
        formattedAmount = formattedAmount.replace(/,(\d+)$/, '.$1');
        // And remove other commas, if presented
        formattedAmount = formattedAmount.replace(/,/g, '');
        // Convert to number
        formattedAmount = Number(formattedAmount).toFixed(2);

        return '' + (isNaN(formattedAmount) ? 0 : formattedAmount);
    },

    getItemBasketType: function (skuId, isBopis) {
        const itemsByBasket = !isBopis
            ? digitalData.cart?.itemsByBasket
            : digitalData.cart?.itemsByBasket.filter(item => item.basketType === 'Pickup');

        const basketType = itemsByBasket?.find(function (basket) {
            return basket?.items?.find(function (basketItem) {
                return basketItem.sku.skuId === skuId;
            });
        });

        return basketType ? basketType.basketType : '';
    },

    getCurrency: function (money) {
        return !money ? null : money.replace(/[\d.,-]/g, '');
    },

    getBasketCurrency: function () {
        const basket = store.getState().basket;

        return basket.currency;
    },

    isEmpty: function (newBasket) {
        const basket = newBasket ? newBasket : store.getState().basket;

        return !basket.items || basket.items.length === 0;
    },

    shouldDisplayBiFreeShippingText: function () {
        const basket = store.getState().basket;

        return (
            basket?.basketLevelMessages?.some(
                msg =>
                    msg.messageContext === basketConstants.AMOUNT_TO_FREE_SHIPPING ||
                    msg.messageContext === basketConstants.FREE_SHIPPING_ROUGE ||
                    msg.messageContext === basketConstants.FREE_SHIPPING_ROUGE_CA ||
                    msg.messageContext === basketConstants.FREE_SHIPPING_ROUGE_HAZMAT
            ) ||
            (!userUtils.isAnonymous() && basket?.basketLevelMessages?.some(msg => msg.messageContext === basketConstants.FREE_SHIPPING_THRESHOLD))
        );
    },

    hasWelcomeKit: function () {
        const basket = store.getState().basket;

        if (basket && basket.items) {
            return basket.items.filter(item => skuUtils.isWelcomeKit(item.sku)).length > 0;
        } else {
            return false;
        }
    },

    hasBirthdayGift: function () {
        const basket = store.getState().basket;

        if (basket && basket.items) {
            return basket.items.filter(item => skuUtils.isBirthdayGift(item.sku)).length > 0;
        } else {
            return false;
        }
    },

    getBirthdayGift: function () {
        const basket = store.getState().basket;

        if (basket && basket.items) {
            const birthdayGiftItem = basket.items.find(item => skuUtils.isBirthdayGift(item.sku));

            return birthdayGiftItem || null;
        } else {
            return null;
        }
    },

    itemListHasRougeRewardCard: function (items) {
        if (items) {
            return items.some(item => skuUtils.isRougeRewardCard(item.sku));
        } else {
            return false;
        }
    },
    //check the basket conatins any birthday sku
    basketContainBirthdayItem: function (items) {
        if (items) {
            return items.some(item => skuUtils.isBirthdayGift(item.sku));
        } else {
            return false;
        }
    },

    isHazardous: function () {
        const basket = store.getState().basket;

        return basket && Array.isArray(basket.items) && !!basket.items.filter(item => item.sku.isHazmat || item.sku.isProp65).length;
    },

    containsRestrictedItem: function () {
        const basket = this.getCurrentBasketData();

        return !!basket?.items.filter(item => item.sku.isPaypalRestricted).length;
    },

    isItemRestrictedForShipping: function (item) {
        const messages = item.itemLevelMessages || [];

        return !!messages.some(message => message.messageContext === 'item.stateRestricted');
    },

    isPaypalRestricted: function () {
        const basket = this.getCurrentBasketData();

        return !basket.items?.length || (this.containsRestrictedItem() && basket.showPaypalRestrictedMessage);
    },

    getAvailableBiPoints: function (getSigned = false) {
        const basket = this.getCurrentBasketData();
        const netBeautyBankPointsAvailable = basket.netBeautyBankPointsAvailable;

        if (getSigned) {
            return netBeautyBankPointsAvailable;
        }

        return netBeautyBankPointsAvailable && netBeautyBankPointsAvailable > 0 ? netBeautyBankPointsAvailable : 0;
    },

    getPotentialBiPoints: function () {
        const basket = store.getState().basket;
        const potentialBeautyBankPoints = basket.potentialBeautyBankPoints;

        return potentialBeautyBankPoints && potentialBeautyBankPoints > 0 ? potentialBeautyBankPoints : 0;
    },

    getRedeemedBiPoints: function () {
        const { redeemedBiPoints = 0 } = store.getState().basket;

        return redeemedBiPoints;
    },

    getRougeRewardCardFromBasket: function () {
        return getItemByType(skuUtils.skuTypes.ROUGE_REWARD_CARD);
    },

    getTotalCount: function (basket) {
        const itemCount = basket?.itemCount || 0;
        const pickupBasketItemCount = basket?.pickupBasket?.itemCount || 0;

        return itemCount + pickupBasketItemCount;
    },

    getTotalBasketCount: function () {
        const { basket } = store.getState();

        return this.getTotalCount(basket);
    },

    /**
     *
     * @param isCountStandaloneRewardAsProduct - if set to true then if the basket contains a reward
     * >= 750 points, then the method will return false
     * @returns {boolean}
     */
    isOnlySamplesRewardsInBasket: function (isCountStandaloneRewardAsProduct = false, isPickupOrder = false) {
        const basketData = store.getState().basket || {
            items: [],
            pickupBasket: { items: [] }
        };
        const basket = isPickupOrder ? basketData?.pickupBasket : basketData;

        if (basket && basket.items) {
            const samplesRewardsInBasket = basket.items.filter(
                item =>
                    (skuUtils.isBiReward(item.sku) &&
                        (!isCountStandaloneRewardAsProduct || skuUtils.getBiPoints(item.sku)) < basketConstants.STANDALONE_REWARD_MIN_VAL) ||
                    skuUtils.isSample(item.sku)
            );

            return samplesRewardsInBasket.length === basket.items.length;
        } else {
            return false;
        }
    },

    isUSorCanadaShipping: function () {
        const shippingCountry = userUtils.getShippingCountry();
        const countryCode = getProp(shippingCountry, 'countryCode', false);

        return countryCode === localeUtils.COUNTRIES.US || countryCode === localeUtils.COUNTRIES.CA;
    },

    getSkuIdsItemsLocalStorage: function () {
        const basketLocalData = Storage.local.getItem(LOCAL_STORAGE.BASKET);
        const items = getProp(basketLocalData, 'items', []);

        return items.map(item => item.sku.skuId);
    },

    getBrandsItemsLocalStorage: function () {
        const basketLocalData = Storage.local.getItem(LOCAL_STORAGE.BASKET);

        return getProp(basketLocalData, 'items', []);
    },

    isRewardInBasket: function (basket) {
        const currentBasket = basket || store.getState().basket;

        return Array.isArray(currentBasket.rewards) && currentBasket.rewards.length > 0;
    },

    isCBRPromoAppliedInBasket: function (basket) {
        const currentBasket = basket || store.getState().basket;

        return currentBasket.appliedCBRValue > 0;
    },

    getCBRPromoAppliedValueInBasket: function (basket) {
        const currentBasket = basket || store.getState().basket;

        return currentBasket.appliedCBRValue || 0;
    },

    isDCBasket: function () {
        const basketType = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) || '';

        return basketType === BASKET_TYPES.DC_BASKET || basketType === '';
    },

    isPickup: function () {
        const basketType = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) || '';

        return basketType === BASKET_TYPES.BOPIS_BASKET || basketType === BASKET_TYPES.ROPIS_BASKET;
    },

    hasPickupItems: function () {
        const basket = store.getState().basket;

        return basket?.pickupBasket?.itemCount > 0;
    },

    getBopisBasketItems: function () {
        const basket = store.getState().basket;

        return basket?.pickupBasket?.items || [];
    },

    getBasketItems: function () {
        const basket = store.getState().basket;

        return basket?.items || [];
    },

    getSameDayItems: function (updatedBasket) {
        const basket = updatedBasket || store.getState().basket;

        return basket?.itemsByBasket?.find(e => e.basketType === BASKET_TYPES.SAMEDAY_BASKET);
    },

    hasSameDayItems: function (basket) {
        const sameDayItems = this.getSameDayItems(basket);

        return sameDayItems?.itemsCount > 0;
    },

    getCurrentBasketData: function (data) {
        let basketData;

        if (!data || !data?.basket || !Object.keys(data?.basket || {}).length) {
            basketData = store.getState()?.basket;
        } else {
            basketData = data?.basket;
        }

        const currentBasketData = this.isPickup() ? basketData?.pickupBasket : basketData;

        return currentBasketData;
    },

    getLocalPickupItems: function () {
        const basketLocalData = Storage.local.getItem(LOCAL_STORAGE.BASKET);

        return getProp(basketLocalData, 'pickupbasketItemCount', 0);
    },

    shippingAddressOverride: function () {
        /*
            Braintree docs:
            https://developers.braintreepayments.com/guides/paypal/checkout-with-paypal/javascript/v2#invoking-the-checkout-with-paypal-flow
        */
        const basketData = store.getState()?.basket;
        const basket = basketData?.pickupBasket;
        const storeDetails = basket?.storeDetails;
        const address = storeDetails?.address;

        return {
            recipientName: `S2S ${storeDetails?.displayName}`,
            line1: address?.address1,
            line2: address?.address2,
            city: address?.city,
            countryCode: address?.country,
            postalCode: address?.postalCode,
            state: address?.state
        };
    },

    cachePickupStore: function (storeDetails, isCustomerSelected = false) {
        const expiry = Storage.MINUTES * 15;
        const storeData = {
            storeId: storeDetails?.storeId,
            displayName: storeDetails?.displayName,
            isRopisable: storeDetails?.isRopisable,
            isBopisable: storeDetails?.isBopisable,
            isCustomerSelected
        };
        Storage.local.setItem(LOCAL_STORAGE.PICKUP_STORE, storeData, expiry);
    },

    getCachedPickupStore: function () {
        return Storage.local.getItem(LOCAL_STORAGE.PICKUP_STORE);
    },

    removePickupStore: function () {
        Storage.local.removeItem(LOCAL_STORAGE.PICKUP_STORE);
    },

    removeDuplicateSkus(items) {
        let uniqueSkus = [];
        let alreadyCountedSkuIds = [];

        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                if (alreadyCountedSkuIds.indexOf(item?.sku?.skuId) === -1) {
                    alreadyCountedSkuIds = [...alreadyCountedSkuIds, item.sku.skuId];
                    uniqueSkus = [...uniqueSkus, item];
                }
            });
        }

        return uniqueSkus;
    },

    getOnlySellableSkus(items) {
        let skus = [];
        let filteredItems = [];

        if (Array.isArray(items) && items.length > 0) {
            const itemsWithoutDuplicates = this.removeDuplicateSkus(items);
            filteredItems = itemsWithoutDuplicates.filter(
                item =>
                    !skuUtils.isBiReward(item.sku) &&
                    !skuUtils.isSample(item.sku) &&
                    !skuUtils.isGwp(item.sku) &&
                    !skuHelpers.isProductDisabled(item.sku)
            );
            skus = filteredItems.map(item => item.sku);
        }

        return skus;
    },

    isBasketSwitchAvailable: function () {
        const basket = this.getCurrentBasketData();

        return basket?.basketSwitchAvailable || false;
    },

    hasBopisItemsCountGreaterThanOne: function () {
        return store.getState().basket?.pickupBasket?.items.some(({ qty }) => qty > 1) || false;
    },

    isZeroCheckout: function () {
        return this.getSubtotal() === 0;
    },

    isAutoReplenishError: function (errorCode) {
        return errorCode === basketConstants.ERROR_CODES.ERROR_CODE_1093;
    },

    isOutOfStockError: function (errorKey) {
        return errorKey === basketConstants.ERROR_KEYS.OUT_OF_STOCK;
    },
    isLimitExceededError: function (errorKey) {
        return errorKey === basketConstants.ERROR_KEYS.LIMIT_EXCEEDED;
    },
    getBasketSamples: function () {
        const basket = store.getState().basket;

        return basket?.samples || Empty.Array;
    },
    getBOPISItemsCount(basket) {
        return basket.pickupBasket?.itemCount || 0;
    },
    getStandardItemsCount(basket) {
        return basket.itemCount || 0;
    }
};

export default Basket;
