import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import skuUtils from 'utils/Sku';
import orderUtils from 'utils/Order';
import userUtils from 'utils/User';
import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
import Empty from 'constants/empty';
import rwdBasketUtils from 'utils/RwdBasket';
import * as RwdBasketConst from 'constants/RwdBasket';
const {
    DELIVERY_METHOD_TYPES: { BOPIS, STANDARD, AUTOREPLENISH },
    BASKET_TYPES
} = RwdBasketConst;
import orderBindingUtils from 'analytics/bindingMethods/pages/orderBindingUtils/orderBindingUtils';

const { hasHalAddress } = orderUtils;

export default (function () {
    //Order Confirmation Page Binding Methods
    return {
        getPromoCode: (promotions = {}) => {
            const promoCodes = [];

            for (const promo of promotions.appliedPromotions || []) {
                if (promo.couponCode) {
                    promoCodes.push(promo.couponCode);
                } else if (promo.promotionId) {
                    promoCodes.push(promo.promotionId);
                }
            }

            return promoCodes.join(',');
        },

        getPromosData: (promotions = {}) => {
            const promoCodes = [],
                promoDisplayName = [],
                promotionIds = [],
                promotionTypes = [],
                sephoraPromotionTypes = [];

            if (Array.isArray(promotions.appliedPromotions)) {
                promotions.appliedPromotions.forEach(promo => {
                    promo['couponCode'] ? promoCodes.push(promo['couponCode']) : promoCodes.push(null);

                    promo['displayName'] ? promoDisplayName.push(promo['displayName']) : promoDisplayName.push(null);

                    promo['promotionId'] ? promotionIds.push(promo['promotionId']) : promotionIds.push(null);

                    promo['promotionType'] ? promotionTypes.push(promo['promotionType']) : promotionTypes.push(null);

                    promo['sephoraPromotionType'] ? sephoraPromotionTypes.push(promo['sephoraPromotionType']) : sephoraPromotionTypes.push(null);
                });
            }

            return {
                promoCodes,
                promoDisplayName,
                promotionIds,
                promotionTypes,
                sephoraPromotionTypes
            };
        },

        /**
         ** Builds and returns the events string
         * @param  {Array} orderItems List of products purchased
         * @param  {String} orderLocale Order locale, US or CA
         * @param  {Object} promotion Promotion applied details
         * @returns {Array} The current load page events
         */
        // eslint-disable-next-line complexity
        getEventStrings: function (orderItems, orderLocale, promoCode, isRopis = false, isBopis) {
            //purchase will always be present
            let events = ['purchase'];

            if (isRopis) {
                events.push('event246');
            } else if (isBopis) {
                events = events.concat(['event13', 'event49', 'event64']);
            } else {
                // Shipping event5; Discount event13; GiftCard event49;
                events = events.concat(['event5', 'event13', 'event49']);

                if (hasHalAddress()) {
                    events = events.concat([anaConsts.Event.EVENT_247]);
                }
            }

            let rewardPresent = false;
            let samplesPresent = false;
            let onlyRewardSkusPresent = true;
            let substituteItemPresent = false;

            if (this.isCanadaOrder(orderLocale)) {
                events.push(anaConsts.Event.CANADA_REVENUE);
                events.push(anaConsts.Event.CANADA_DISCOUNT);
            }

            orderItems.forEach(item => {
                if (skuUtils.isGiftCard(item.sku)) {
                    if (this.isUnique(events, anaConsts.Event.GIFT_CARD_REVENUE)) {
                        events.push(anaConsts.Event.GIFT_CARD_REVENUE);
                    }
                }

                //Hard Merch
                if (skuUtils.isHardGood(item.sku, true)) {
                    if (this.isUnique(events, anaConsts.Event.HARD_GOOD_PRESENT)) {
                        events.push(anaConsts.Event.HARD_GOOD_PRESENT);
                    }
                }

                if (skuUtils.isBiReward(item.sku)) {
                    rewardPresent = true;
                } else {
                    onlyRewardSkusPresent = false;
                }

                if (skuUtils.isSample(item.sku)) {
                    samplesPresent = true;
                }

                if (skuUtils.isAutoReplenish(item)) {
                    events.push(anaConsts.Event.AUTO_REPLENISHMENT_PRODUCT_SETTING);
                }

                if (item.substituteSku) {
                    substituteItemPresent = true;
                }
            });

            // Reward Redeemed
            if (rewardPresent) {
                events.push(anaConsts.Event.REWARD_PRESENT);
            }

            // Substitute item selected
            if (substituteItemPresent) {
                events.push('event278');
            }

            // Zero Checkout - Reward Only
            if (orderUtils.isZeroCheckout() && onlyRewardSkusPresent) {
                events.push(anaConsts.Event.ONLY_REWARD);
            }

            // Promotions
            if (promoCode) {
                events.push(anaConsts.Event.PROMOTION_APPLIED);
            }

            // Sample Present
            if (samplesPresent) {
                events.push(anaConsts.Event.SAMPLES_PRESENT);
                events.push(anaConsts.Event.SAMPLES_REDEEMED);
            }

            if (digitalData.page.category.pageType === anaConsts.PAGE_TYPES.CHECKOUT && digitalData.page.attributes.isGuestOrder) {
                events.push(anaConsts.Event.SC_GUEST_ORDER);

                if (digitalData.page.attributes.isGuestEmailRegistered) {
                    events.push(anaConsts.Event.SC_GUEST_ORDER_REGISTERED_USER);
                }
            }

            const biAccountInfo = userUtils.getBiAccountInfo();

            if (biAccountInfo) {
                const { vibSegment, vibSpendingToNextSegment, realTimeVIBStatus } = biAccountInfo;
                const totalCost = orderUtils.getMerchandiseSubtotalAsNumber();
                const { BI, VIB, ROUGE } = userUtils.types;

                if (vibSegment === BI && totalCost >= vibSpendingToNextSegment && realTimeVIBStatus?.toUpperCase() !== ROUGE) {
                    events.push(anaConsts.Event.VIB_TIER_MIGRATION);
                } else if (
                    (vibSegment === VIB && totalCost >= vibSpendingToNextSegment) ||
                    (vibSegment === BI && realTimeVIBStatus?.toUpperCase() === ROUGE)
                ) {
                    events.push(anaConsts.Event.ROUGE_TIER_MIGRATION);
                }
            }

            return events;
        },

        /**
         * Builds the s.products string with many helpers
         * @param  {Object} orderDetails Details of the current order
         * @return  {String} s.products
         */
        buildProductString: function (orderDetails, items, orderLocale, isRopis = false, isBopis) {
            let productString;
            const shippingMethod = anaUtils.safelyReadProperty('shippingGroups.shippingGroupsEntries.0.shippingGroup.shippingMethod', orderDetails);
            const shippingCost = shippingMethod.shippingFee === 'FREE' ? 0 : shippingMethod.shippingFee;

            //Product Strings
            productString = this.getProductStrings(items, orderLocale, orderDetails.items, isBopis);

            if (!isRopis) {
                //Add Shipping event5
                productString = isBopis ? productString : productString.concat(`,;Shipping;;;event5=${anaUtils.removeCurrencySymbol(shippingCost)};`);

                //Add Discount event13
                productString = productString.concat(this.getDiscountString(orderDetails));

                //Page :: Add gift card event49
                productString = productString.concat(this.getGiftCardString(orderDetails.priceInfo.giftCardAmount));
            }

            return productString;
        },

        getEventsForProductString: function (item, orderLocale) {
            const eventStrings = [];

            //Canada Revenue
            if (this.isCanadaOrder(orderLocale)) {
                // event101=0 for all BI rewards
                const itemPrice = skuUtils.isBiReward(item.sku) ? '0' : item.salePriceSubtotal || item.listPriceSubtotal;
                eventStrings.push(anaConsts.Event.CANADA_REVENUE + '=' + anaUtils.removeCurrencySymbol(itemPrice));
            }

            //Hard Merch
            if (skuUtils.isHardGood(item.sku, true)) {
                eventStrings.push(anaConsts.Event.HARD_GOOD_PRESENT + '=' + item.qty);
            }

            if (item.isReplenishment) {
                eventStrings.push(`${anaConsts.Event.AUTO_REPLENISHMENT_PRODUCT_SETTING}=1`);
            }

            //Classic/Plastic Gift Card
            if (skuUtils.isGiftCard(item.sku)) {
                eventStrings.push(anaConsts.Event.GIFT_CARD_REVENUE + '=' + anaUtils.removeCurrencySymbol(item.listPriceSubtotal));
            }

            // Reward Redeemed
            if (skuUtils.isBiReward(item.sku)) {
                const biPoints = anaUtils.removeCurrencySymbol(item.listPriceSubtotal);
                eventStrings.push(anaConsts.Event.REWARD_PRESENT + '=' + anaUtils.formatBIPoint(biPoints));
            }

            // Samples
            if (skuUtils.isSample(item.sku)) {
                eventStrings.push(anaConsts.Event.SAMPLES_PRESENT + '=1');
            }

            // Item substitution
            if (item.substituteSku) {
                eventStrings.push('event278=1');
            }

            return eventStrings;
        },

        /**
         * Builds and returns the products purchased
         * @param  {Array} orderItems List of products
         * @param  {String} orderLocale Order locale, US or CA
         * @return  {String} The analytics data for the products purchased
         * Format: ;[SKU];[QTY];[PRICE];[EVENTS];[EVARS]
         */
        getProductStrings: function (orderItems, orderLocale, orderItemsByBasket, isBopis) {
            const products = orderItems?.map(
                item =>
                    ';' +
                    item.sku.skuId +
                    ';' +
                    item.qty +
                    ';' +
                    orderBindingUtils.getPriceForProductString(item) +
                    ';' +
                    this.getEventsForProductString(item, orderLocale).join('|') +
                    (';eVar26=' + item.sku.skuId) +
                    this.buildeVar111(item) +
                    this.buildItemSubeVars(item, orderItemsByBasket, isBopis)
            );

            return products?.join(',');
        },

        buildeVar111: function (item) {
            let eVar111 = '';

            if (item.isReplenishment) {
                const [frequencyType, frequencyNum] = item.replenishmentFrequency?.split(':');
                eVar111 = `|eVar111=${frequencyNum}:${frequencyType?.toLowerCase()}`;
            }

            return eVar111;
        },

        buildItemSubeVars: function (item, basket, isBopis) {
            let eVarString = '';
            const basketType = isBopis
                ? BOPIS
                : rwdBasketUtils.findBasketTypeBySkuId(item.sku.skuId, basket.itemsByBasket, basket.pickupBasket?.items);
            const deliveryType = item.isReplenishment ? AUTOREPLENISH : basketType === BASKET_TYPES.STANDARD_BASKET ? STANDARD : basketType;
            const isItemEligibleForSubstitute = item.itemEligibleForSubstitute === undefined ? true : item.itemEligibleForSubstitute;

            if (basketType) {
                const eVar133 = `|eVar133=${deliveryType.toLowerCase()}`;

                // Only add eVar131 and eVar132 if the item is eligible for substitution
                if (isItemEligibleForSubstitute) {
                    const eVar131 = `|eVar131=${item.substituteSku?.skuId || anaConsts?.default?.Event?.DO_NOT_SUBSTITUTE || ''}`;
                    const eVar132 = `|eVar132=${item.sku.skuId}`;
                    eVarString = eVar131 + eVar132 + eVar133;
                } else {
                    eVarString = eVar133;
                }
            }

            return eVarString;
        },

        /**
         * Returns true if it is a Canada order
         * @param  {String} locale of the order, US or CA
         * @return  {Boolean}
         */
        isCanadaOrder: function (orderLocale) {
            return orderLocale === 'CA';
        },

        /**
         * Prevent redundant items in an array.
         */
        isUnique: (thisArray = [], value) => {
            if (thisArray.indexOf(value) === -1) {
                return true;
            }

            return false;
        },

        /**
         * Returns Discount total and event13
         * @param  {Object} orderDetails
         * @return  {String}
         */
        getDiscountString: function ({ isInitialized, priceInfo, header }) {
            let discountTotal = '0';

            if (isInitialized && priceInfo.promotionDiscount) {
                discountTotal = anaUtils.removeCurrencySymbol(priceInfo.promotionDiscount);
            }

            const fieldHeader = ',;Discount;;;';
            const event13 = `event13=${discountTotal}`;
            const eventDelimiter = '|';
            const fieldDelimiter = ';';

            let canadianDiscountTotalString = '';

            if (isInitialized && this.isCanadaOrder(header.orderLocale)) {
                const event144 = `event144=${discountTotal}`;
                canadianDiscountTotalString = `${eventDelimiter}${event144}`;
            }

            return `${fieldHeader}${event13}${canadianDiscountTotalString}${fieldDelimiter}`;
        },

        /**
         * Returns Gift card s.product string
         * @param  {String} giftCardAmount
         * @return  {String}
         */
        getGiftCardString: function (giftCardAmount) {
            let giftCardTotal = '0';

            if (giftCardAmount) {
                giftCardTotal = anaUtils.removeCurrencySymbol(giftCardAmount);
            }

            return `,;gift card;;;event49=${giftCardTotal};`;
        },

        /**
         * Returns the s.eVar15 payment method string
         * @param  {Object} orderDetails
         * @return  {String}
         */
        buildPaymentMethodString: function (orderDetails) {
            const paymentMethodString = (orderDetails?.paymentGroups?.paymentGroupsEntries || Empty.Array)
                .map(x =>
                    x.paymentGroupType.indexOf('CreditCardPaymentGroup') !== -1
                        ? x.paymentGroup.isApplePay
                            ? 'applepay'
                            : this.getPaymentCardType(x.paymentGroup.cardType)
                        : orderUtils.getPaymentNameByType(x.paymentGroupType)
                )
                .join(',')
                .toLowerCase();

            return paymentMethodString;
        },

        getPaymentCardType: function (cardType) {
            const payCardTypes = {
                [SEPHORA_CARD_TYPES.PRIVATE_LABEL]: 'sephora card',
                [SEPHORA_CARD_TYPES.CO_BRANDED]: 'sephora visa'
            };

            return payCardTypes[cardType] || cardType;
        },

        getTotalInCents: function (total) {
            return skuUtils.parsePrice(total) * 100;
        },

        /**
         * Returns the purchase subtotal taking in count Gift Cards, Promos and Discounts
         * @param  {Object} orderPriceDetails
         * @return  {String}
         */
        subtotalPurchased: function (orderPriceDetails) {
            let subtotal;
            let giftCardRedeemed;
            let giftCardPurchased;

            if (orderPriceDetails) {
                subtotal = parseFloat(anaUtils.removeCurrencySymbol(orderPriceDetails.merchandiseSubtotal));
                giftCardRedeemed = parseFloat(anaUtils.removeCurrencySymbol(orderPriceDetails.giftCardAmount));

                if (subtotal < giftCardRedeemed) {
                    subtotal = 0;
                } else {
                    if (giftCardRedeemed && !isNaN(giftCardRedeemed)) {
                        subtotal -= giftCardRedeemed;
                    }

                    giftCardPurchased = parseFloat(anaUtils.removeCurrencySymbol(orderPriceDetails.gcEgcSubtotal));

                    if (giftCardPurchased && !isNaN(giftCardPurchased)) {
                        subtotal += giftCardPurchased;
                    }
                }
            }

            //removes more than 2 decimals (10.43843 = 10.44),
            //but doesn't add them if it's a whole number
            const parsedSubtotal = +(Math.round(subtotal + 'e+2') + 'e-2');

            return parsedSubtotal.toString();
        }
    };
}());
