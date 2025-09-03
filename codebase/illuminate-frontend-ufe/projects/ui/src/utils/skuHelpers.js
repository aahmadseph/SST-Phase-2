import userUtils from './User';
import basketUtils from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import basketConstants from 'constants/Basket';
import { BASKET_TYPES } from 'actions/ActionsConstants';
import skuUtils from 'utils/Sku';
import Empty from 'constants/empty';

const { BasketType } = basketConstants;
const priceRegExp = /\d*\.\d{0,2}/;

const skuHelpers = {
    isInBasket: function (skuId, basketInj) {
        const basketType = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE);

        if (basketType?.length || basketInj) {
            const currentBasket = basketType === BasketType.BOPIS ? store.getState().basket.pickupBasket : store.getState().basket;
            // Start using a basket from the argument as a primary source of data
            const basket = basketInj || currentBasket;

            if (basket && basket.items) {
                return basket.items.filter(item => item.sku.skuId === skuId).length > 0;
            } else {
                return false;
            }
        } else {
            const mergedItems = [...store.getState().basket?.items, ...store.getState().basket?.pickupBasket.items];

            return mergedItems.filter(item => item?.sku?.skuId === skuId).length > 0;
        }
    },

    // Gets a list of rewards in SameDay, ShipToHome, and Pickup baskets into one single array with their basketType
    // Birthday gifts are also counted as rewards
    getRewardsByBasketList: function () {
        const result = [];
        const state = store.getState().basket;
        const itemsByBasket = state?.itemsByBasket || [];
        const pickupBasketItems = state?.pickupBasket?.items || [];
        let hasPickup = false;

        // Process itemsByBasket (SameDay & ShipToHome are always here)
        itemsByBasket.forEach(basket => {
            const mappedBasketType = Object.values(BASKET_TYPES).find(type => type === basket.basketType) || basket.basketType;

            // itemsByBasket sometimes contains PickupBasket items, but sometimes doesn't
            if (mappedBasketType === BASKET_TYPES.PICKUP_BASKET) {
                hasPickup = true;
            }

            basket.items.forEach(item => {
                if (skuUtils.isBiReward(item.sku) || skuUtils.isBirthdayGift(item.sku)) {
                    result.push({
                        skuId: item.sku.skuId,
                        basketType: mappedBasketType
                    });
                }
            });
        });

        // Process PickupBasket only if it’s missing from itemsByBasket to avoid duplicates
        if (!hasPickup && pickupBasketItems.length > 0) {
            pickupBasketItems.forEach(item => {
                if (skuUtils.isBiReward(item.sku) || skuUtils.isBirthdayGift(item.sku)) {
                    result.push({
                        skuId: item.sku.skuId,
                        basketType: BASKET_TYPES.PICKUP_BASKET
                    });
                }
            });
        }

        return result;
    },

    getBasketType: function ({ sku }) {
        const state = store.getState().basket;
        const itemsByBasket = state?.itemsByBasket || Empty.Array;
        const pickupBasketItems = state?.pickupBasket?.items || Empty.Array;

        // Check in SameDay and ShipToHome baskets
        for (const basket of itemsByBasket) {
            const mappedBasketType = Object.values(BASKET_TYPES).find(type => type === basket.basketType) || basket.basketType;

            if (basket.items.some(item => item.sku.skuId === sku.skuId)) {
                return mappedBasketType;
            }
        }

        // Check in Pickup basket
        if (pickupBasketItems.some(item => item.sku.skuId === sku.skuId)) {
            return BASKET_TYPES.PICKUP_BASKET;
        }

        return '';
    },

    // Calculate the count of rewards in each basket type
    // Expects a list of rewards in the following format:
    // [
    //     {
    //         "skuId": "2241537",
    //         "basketType": "SameDay"
    //     },
    //     {
    //         "skuId": "2388429",
    //         "basketType": "ShipToHome"
    //     },
    //     {
    //         "skuId": "2155299",
    //         "basketType": "Pickup"
    //     }
    // ]
    calculateRewardsCount: function ({ rewards }) {
        const counts = rewards?.reduce(
            (rewardsByType, reward) => {
                switch (reward.basketType) {
                    case BASKET_TYPES.STANDARD_BASKET:
                        rewardsByType.shipToHomeRewards.push(reward);

                        break;
                    case BASKET_TYPES.PICKUP_BASKET:
                        rewardsByType.bopisRewards.push(reward);

                        break;
                    default:
                        rewardsByType.sameDayRewards.push(reward);

                        break;
                }

                return rewardsByType;
            },
            { shipToHomeRewards: [], bopisRewards: [], sameDayRewards: [] }
        );

        return counts;
    },

    isInAutoReplenishmentBasket: function (skuId, basketInj) {
        // Start using a basket from the argument as a primary source of data
        const basket = basketInj || store.getState().basket;

        if (basket && basket.items) {
            return basket.items.filter(item => item.sku.skuId === skuId && item.isReplenishment).length > 0;
        } else {
            return false;
        }
    },

    isInMsgPromoSkuList: function (skuId) {
        const msgPromoSkuList = store.getState().promo.msgPromosSkuList;

        return msgPromoSkuList && msgPromoSkuList.filter(elem => elem.skuId === skuId).length > 0;
    },

    isSkuLoved: function (skuId) {
        const lovesArray = store.getState().loves.shoppingListIds || [];

        return lovesArray.some(elem => elem === skuId);
    },

    getProductLovesCount: function ({ regularChildSkus, lovesCount = 0, skuId }) {
        let userLoves = 0;

        if (this.isSkuLoved(skuId)) {
            userLoves++;
        }

        if (regularChildSkus && regularChildSkus.length) {
            for (let x = 0; x < regularChildSkus.length; x++) {
                if (this.isSkuLoved(regularChildSkus[x].skuId) && skuId !== regularChildSkus[x].skuId) {
                    userLoves++;
                }
            }
        }

        return this.formatLoveCount(lovesCount + userLoves);
    },

    /**
     * Please note: always returns string,
     * it's wrong to expect the number since it can returns value like '10K'
     * So result shouldn't be comparable with other numbers
     * @param loveCount
     * @returns {string}
     */
    formatLoveCount: function (loveCount) {
        /**
         * Round Float number to first decimal place,
         * but ignore the decimal point in case or trailing zero (2.0 > 2, 11.0 > 11 etc)
         * @param num
         * @return {string}
         */
        const roundToFirstButIgnoreZeroes = num => {
            return parseFloat(num.toFixed(1)).toString();
        };

        if (loveCount > 999999) {
            return roundToFirstButIgnoreZeroes(loveCount / 1000000) + 'M';
        } else if (loveCount > 999) {
            return roundToFirstButIgnoreZeroes(loveCount / 1000) + 'K';
        } else {
            return loveCount + '';
        }
    },

    getSkuFromProduct(product, skuId) {
        if (!skuId) {
            return null;
        }

        const { regularChildSkus = [], onSaleChildSkus = [] } = product || require('Store').default.getState().page.product || {};
        const skuComparer = sku => `${sku.skuId}` === `${skuId}`;
        const sku = regularChildSkus.find(skuComparer) || onSaleChildSkus.find(skuComparer) || null;

        return sku;
    },

    isProductDisabled: function (sku) {
        if (sku.isOutOfStock) {
            return true;
        }

        if (this.isBiReward(sku)) {
            // The absense of the isEligible attribute means it is elegible
            return !(sku.isEligible === undefined ? true : sku.isEligible);
        }

        return this.isBiExclusive(sku) && !this.isBiQualify(sku);
    },

    getColorIQMatchSku: async function (regularChildSkus = [], colorIQSkuId) {
        const skinTones = userUtils.getUserSkinTones();

        let matchSku = false;

        if (regularChildSkus && skinTones.length && colorIQSkuId) {
            regularChildSkus.some(sku => {
                return sku.skuId === colorIQSkuId ? ((matchSku = sku), true) : false;
            });
        }

        return matchSku;
    },

    parsePrice: function (price) {
        const parsedPrice = (price || '').match(priceRegExp);

        return parsedPrice ? parseFloat(parsedPrice[0]) : NaN;
    },

    formatInstallmentValue: function (value) {
        let price = value;

        const parsedPrice = this.parsePrice(basketUtils.removeCurrency(price));

        if (!parsedPrice) {
            return [];
        }

        let klarnaPrice = (parsedPrice / 4).toFixed(2);

        if (price.includes(',')) {
            if (localeUtils.isFrench()) {
                klarnaPrice = klarnaPrice.replace('.', ',');
            } else {
                price = price.replace(',', '');
            }
        }

        // Carefully replace previous price value with new one
        // To preserve the formatting of currency
        return [price.replace(/(\d+(?:[,.]\d*)?)/g, klarnaPrice), price];
    },

    getInstallmentValue: function ({ listPrice, salePrice }) {
        const price = salePrice || listPrice;

        return this.formatInstallmentValue(price);
    },

    isBiExclusive: function (sku = {}) {
        return !!sku.biExclusiveLevel && sku.biExclusiveLevel !== 'none';
    },

    isBiReward: function (sku) {
        return sku && !!sku.biType && sku.biType.toLowerCase() !== 'none';
    },

    isBiQualify: function (sku) {
        if (this.isBiExclusive(sku)) {
            return !userUtils.isAnonymous() && userUtils.isBI() && userUtils.isBiLevelQualifiedFor(sku);
        }

        return false;
    },

    /**
     * Determines if a SKU is out of stock based on basket type
     * When isChooseOptionsModal is true, uses basket-specific out-of-stock conditions
     */
    isSkuOutOfStockByBasketType: function (sku, basketType, isChooseOptionsModal = false) {
        if (!isChooseOptionsModal) {
            return sku?.isOutOfStock;
        }

        switch (basketType) {
            case BasketType.SameDay:
                return sku?.isOutOfStockSdd ?? true;
            case BasketType.BOPIS:
                return sku?.isOutOfStockPick ?? true;
            case BasketType.Standard:
            default:
                return sku?.isOutOfStock;
        }
    }
};

export default skuHelpers;
