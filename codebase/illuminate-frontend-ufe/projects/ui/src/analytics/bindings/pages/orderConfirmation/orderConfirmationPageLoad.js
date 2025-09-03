/* eslint max-len: [2, 200] */
/**
 * These are the bindings that will take place on the order confirmation page when the
 * page load event occurs.
 */
import store from 'Store';
import anaUtils from 'analytics/utils';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import orderUtils from 'utils/Order';
import dateUtils from 'utils/Date';
import bindingMethods from 'analytics/bindingMethods/pages/orderConfirmation/orderConfPageBindings';
import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';

export default (function () {
    const orderConfpageLoadEvent = function () {
        const orderDetails = store.getState().order.orderDetails;
        const promoCode = bindingMethods.getPromoCode(orderDetails.promotion);
        const promises = Sephora.analytics.promises;

        const orderLocale = orderDetails.header.profileLocale;
        const items = orderDetails.items.items;
        const isRopisOrder = orderDetails.header?.isRopisOrder;
        const isBopisOrder = orderDetails.header?.isBopisOrder;

        const shippingGroupsEntries = anaUtils.safelyReadProperty('shippingGroups.shippingGroupsEntries', orderDetails) || [];

        const shippingMethodTypes = shippingGroupsEntries.map(shipGroup => {
            return shipGroup?.shippingGroup?.shippingMethod?.shippingMethodType;
        });

        const sameDayShippingGroup = orderUtils.getSameDayShippingGroup(orderDetails);

        if (sameDayShippingGroup) {
            const today = new Date();
            const currentShortenedDay = dateUtils.getDayOfWeek(today, false, true).substr(0, 3);
            const isDeliveryWindowToday = sameDayShippingGroup.deliveryWindow
                ? currentShortenedDay === sameDayShippingGroup.deliveryWindow.substr(0, 3)
                : false;
            const day = isDeliveryWindowToday ? 'today' : 'tomorrow';
            const isScheduledSameDayDelivery =
                sameDayShippingGroup?.shippingMethod.shippingMethodType === orderUtils.SHIPPING_METHOD_TYPES.SCHEDULED_SAME_DAY;
            const timeSlot = isScheduledSameDayDelivery ? sameDayShippingGroup.sameDayDeliveryLabel : 'default';
            digitalData.transaction.attributes.sameDayShipping = `${day}:${timeSlot}`;
            // CRPD-621 add custom info to track data only for SDD
            digitalData.transaction.total.sdd.transactionSubtotalInUSD = anaUtils.convertToUSD(
                bindingMethods.subtotalPurchased(sameDayShippingGroup.priceInfo)
            );

            digitalData.transaction.total.sdd.transactionSubtotal = bindingMethods.subtotalPurchased(sameDayShippingGroup.priceInfo);

            digitalData.transaction.attributes.sdd.skuIds = generalBindings.getArrayOfPropValuesFromItems(sameDayShippingGroup.items, 'skuId');

            digitalData.transaction.attributes.sdd.itemQty = generalBindings.getArrayOfPropValuesFromItems(sameDayShippingGroup.items, 'qty', true);
        }

        const shippingZip = anaUtils.safelyReadProperty('shippingGroups.shippingGroupsEntries.0.shippingGroup.address.postalCode', orderDetails);

        digitalData.transaction.attributes.isoCurrency = localeUtils.ISO_CURRENCY[userUtils.getShippingCountry().countryCode];

        digitalData.transaction.item = items;
        digitalData.transaction.itemShort = generalBindings.getArrayOfShortFilteredItems(items);

        digitalData.transaction.attributes.productIds = generalBindings.getArrayOfPropValuesFromItems(items, 'productId');

        digitalData.transaction.attributes.skuIds = generalBindings.getArrayOfPropValuesFromItems(items, 'skuId');

        digitalData.transaction.attributes.itemQty = generalBindings.getArrayOfPropValuesFromItems(items, 'qty', true);

        digitalData.transaction.attributes.itemPrice = generalBindings.getArrayOfPropValuesFromItems(items, 'listPriceSubtotal', true);

        digitalData.transaction.attributes.itemName = generalBindings.getArrayOfPropValuesFromItems(items, 'productName');

        digitalData.transaction.attributes.brandNames = generalBindings.getArrayOfPropValuesFromItems(items, 'brandName');

        digitalData.transaction.attributes.skuTypes = generalBindings.getArrayOfPropValuesFromItems(items, 'type');

        digitalData.transaction.attributes.skuVariationTypes = generalBindings.getArrayOfPropValuesFromItems(items, 'variationType', false, true);

        digitalData.transaction.attributes.skuVariationValue = generalBindings.getArrayOfPropValuesFromItems(items, 'variationValue', false, true);

        digitalData.transaction.attributes.rating = generalBindings.getArrayOfRatings(items);

        digitalData.transaction.attributes.categories = generalBindings.getCatName(items, 'cat');

        digitalData.transaction.attributes.subCategories = generalBindings.getCatName(items, 'subCat');

        digitalData.transaction.attributes.defaultPayment = digitalData.page.attributes.previousPageData?.defaultPayment;

        //Page :: Build s.products
        digitalData.page.attributes.productStrings = bindingMethods.buildProductString(orderDetails, items, orderLocale, isRopisOrder, isBopisOrder);

        //Page :: Event Strings
        const currentEvents = digitalData.page.attributes.eventStrings;
        digitalData.page.attributes.eventStrings = currentEvents.concat(
            bindingMethods.getEventStrings(items, orderLocale, promoCode, isRopisOrder, isBopisOrder)
        );

        //Page :: Order Id
        digitalData.transaction.transactionID = orderDetails.header.orderId;

        //Page :: Order Total
        digitalData.transaction.total.transactionTotal = anaUtils.removeCurrencySymbol(orderDetails.priceInfo.orderTotal);

        //Pixel :: LinkShare :: Discount
        digitalData.transaction.total.promotionDiscount = anaUtils.removeCurrencySymbol(orderDetails.priceInfo.promotionDiscount);

        //Page :: Order Shipping Method Type
        digitalData.transaction.total.shippingMethod = shippingMethodTypes.join(',');

        //Page :: Build Order Payment Method string
        digitalData.transaction.attributes.paymentMethod = bindingMethods.buildPaymentMethodString(orderDetails);

        //Page :: Shipping Zip
        digitalData.transaction.total.shippingZip = shippingZip;

        // Page:: Promo Code
        digitalData.transaction.attributes.promoCode = promoCode;

        const {
            promoCodes, promoDisplayName, promotionIds, promotionTypes, sephoraPromotionTypes
        } = bindingMethods.getPromosData(
            orderDetails.promotion
        );
        digitalData.transaction.attributes.promoCodes = promoCodes;
        digitalData.transaction.attributes.promoDisplayName = promoDisplayName;
        digitalData.transaction.attributes.promotionIds = promotionIds;
        digitalData.transaction.attributes.promotionTypes = promotionTypes;
        digitalData.transaction.attributes.sephoraPromotionTypes = sephoraPromotionTypes;

        // Page :: Order Used Apple Pay
        digitalData.transaction.attributes.usedApplePay = orderDetails.paymentGroups.paymentGroupsEntries.some(
            entry => entry.paymentGroup.isApplePay
        );

        digitalData.transaction.total.transactionSubtotal = bindingMethods.subtotalPurchased(orderDetails.priceInfo);

        digitalData.transaction.total.transactionSubtotalInUSD = anaUtils.convertToUSD(bindingMethods.subtotalPurchased(orderDetails.priceInfo));

        digitalData.transaction.total.tax = anaUtils.removeCurrencySymbol(orderDetails.priceInfo.tax);

        digitalData.transaction.total.shipping =
            orderDetails.priceInfo.totalShipping === 'FREE' ? '0' : anaUtils.removeCurrencySymbol(orderDetails.priceInfo.totalShipping);

        // Get Harmony Id from local storage if it exists, so we can track Epsilon Pixel
        const harmonyConversionId = Storage.local.getItem(LOCAL_STORAGE.HARMONY_CONVERSION_ID);

        if (harmonyConversionId) {
            digitalData.page.attributes.campaigns.harmonyConversionEventId = harmonyConversionId;
        }

        //ToDo: Update part of the 'value' property after this ticket is done:
        //https://jira.sephora.com/browse/ILLUPH-108619
        //StyleHaul Ultimately fires its own Facebook pixel. ID#636588386679114
        //They now fire the pixel with 'trackSingle' per our request
        promises.styleHaulReady.then(() => {
            window.analytics &&
                // prettier-ignore
                window.analytics.track('Purchase', {
                    value: bindingMethods.getTotalInCents(anaUtils.convertToUSD(orderDetails.priceInfo.orderTotal)),
                    currency: 'USD',
                    'product_ids': digitalData.transaction.attributes.productIds,
                    'num_items': digitalData.transaction.item.length
                });
        });

        adobe &&
            adobe.target &&
            adobe.target.trackEvent({
                mbox: isRopisOrder ? 'orderConfirmROPIS' : isBopisOrder ? 'orderConfirmBOPIS' : 'orderConfirmPage',
                params: {
                    orderId: orderDetails.header.orderId,
                    orderTotal: anaUtils.removeCurrencySymbol(orderDetails.priceInfo.orderTotal),
                    productPurchasedId: digitalData.transaction.attributes.skuIds.join(',')
                }
            });
    };

    return orderConfpageLoadEvent;
}());
