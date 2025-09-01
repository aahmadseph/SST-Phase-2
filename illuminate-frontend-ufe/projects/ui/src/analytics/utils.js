/* eslint-disable no-param-reassign */
import React from 'react';
import deepExtend from 'utils/deepExtend';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import urlUtils from 'utils/Url';
import analyticsConsts from 'analytics/constants';
import locationUtils from 'utils/Location';
import anaConsts from 'analytics/constants';
import helperUtils from 'utils/Helpers';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import hashing from 'utils/Hashing';
import safelyReadProperty from 'analytics/utils/safelyReadProperty';
import * as RwdBasketConst from 'constants/RwdBasket';
const {
    BASKET_TYPES: { BOPIS_BASKET, SAMEDAY_BASKET, STANDARD_BASKET },
    DELIVERY_METHOD_TYPES: { BOPIS, SAMEDAY, AUTOREPLENISH, STANDARD }
} = RwdBasketConst;
//import userUtils from 'utils/User';
import Empty from 'constants/empty';
import cookieUtil from 'utils/Cookies';
import dateUtils from 'utils/Date';
import basketHelpers from 'utils/basketHelpers';
import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
import PageTemplateType from 'constants/PageTemplateType';

/**
 * Analytics Utility Functions *
 *
 * This module is a property of Sephora.analytics.
 *
 * Dependencies: DataLayer.js
 */

const { getProp } = helperUtils;

export default (function () {
    const getText = localeUtils.getLocaleResourceFile('analytics/locales', 'utils');

    const methods = {
        /**
         * Some values should only be added if certain conditons are met when the
         * next page loads. This function takes a value, runs the appropriate tests
         * and returns true if that value should be added.
         * @param  {object} - sourceObj The original object to add verified data to
         * @param {object} - dataToCheck An object containing values that will be added
         * if tests are passed.
         * @return {object} The potentially altered sourceObj that was passed in.
         */
        addIfConditionsMet: function (sourceObj, dataToCheck) {
            var profileInfo = window.digitalData.user[0].profile[0].profileInfo;
            var events = dataToCheck.events;

            if (events && Array.isArray(events)) {
                for (let i = 0; i < events.length; i += 1) {
                    const currentEvent = events[i].trim();

                    //Add events object if it didn't already exist
                    sourceObj.events = sourceObj.events || [];

                    //Email opt-in
                    if (currentEvent === 'event6' && profileInfo.biType !== 'non-bi') {
                        /* TODO: I'm waiting on BE Team to expose something like
                         ** Sephora.User.emailOptIn so I can check this
                         ** For now I'm just going to say yes if user is now bi */
                        sourceObj.events.push(currentEvent);
                    }

                    //Bi Opt-in
                    if (currentEvent === 'event11' && profileInfo.biType !== 'non-bi') {
                        sourceObj.events.push(currentEvent);
                    }

                    if (currentEvent === anaConsts.Event.CAPTCHA_PRESENT && profileInfo.signInStatus === 'signed in') {
                        sourceObj.events.push(currentEvent);
                    }
                }
            }

            return sourceObj;
        },

        /**
         * Create a new item using the W3C blue print at the specified location.
         * @param  {string} location - Name of the array at which to add the new item
         * @param  {string} objToMerge - An object with values to merge into the new item
         * @return {*} - A reference to the newly created object
         * Note: This is currently only tested on adding new items to arrays. Consider
         * whether or not to create a new func for other situations.
         */
        addNewItemFromSpec: function (location, objToMerge) {
            var newArrayLength;
            var newItem;
            var newItemDestination = window.digitalData[location];
            var specModel = {
                event: {
                    eventInfo: {
                        eventName: '',
                        eventAction: '',
                        type: '',
                        timeStamp: new Date(),
                        attributes: {
                            eventStrings: [],
                            productStrings: []
                        }
                    }
                }
            };

            newArrayLength = newItemDestination.push(specModel[location]);
            newItem = newItemDestination[newArrayLength - 1];

            if (objToMerge) {
                deepExtend(newItem, objToMerge);
            }

            return newItem;
        },

        arrayItemsToLowerCase: function (arr) {
            const len = arr.length;
            const tempArray = [];

            for (let i = 0; i < len; i++) {
                if (typeof arr[i] === 'string') {
                    tempArray[i] = arr[i].toLowerCase();
                }
            }

            Object.assign(arr, tempArray);
        },

        /**
         * Builds n item long (5 by default), colon separated string, repeating the last item if needed
         * @param  {array} strings The strings to use to build the path
         * @return {string}
         */
        buildNavPath: function (strings, n = 5) {
            var path = [];
            var currentString;

            for (let i = 0; i < n; i += 1) {
                if (strings[i]) {
                    currentString = strings[i];
                }

                path[i] = currentString;
            }

            return path.join(':').toLowerCase();
        },

        /**
         * Takes a name that could come from anywhere and returns the
         * name that the reporting team wants to see for that page, module, etc.
         * @param  {string} name - The name to be converted.
         * @return {string} - The converted name if there was one, or the original argument.
         */
        convertName: function (name) {
            var map;

            map = {
                homepage: analyticsConsts.PAGE_NAMES.HOMEPAGE,
                basketpage: analyticsConsts.PAGE_NAMES.BASKET,
                brandnthcategory: analyticsConsts.PAGE_NAMES.BRANDNTHCATEGORY,
                category: analyticsConsts.PAGE_NAMES.CATEGORYLEVEL,
                categorylevel: analyticsConsts.PAGE_NAMES.CATEGORYLEVEL,
                lists: analyticsConsts.PAGE_NAMES.LISTS_MAIN,
                profile: analyticsConsts.PAGE_NAMES.PROFILE,
                beautyinsider: 'my beauty insider:benefits',
                giftcardshipping: analyticsConsts.PAGE_NAMES.GC_SHIPPING,
                giftcarddelivery: analyticsConsts.PAGE_NAMES.GC_DELIVERY,
                account: analyticsConsts.PAGE_NAMES.ACCOUNT_CREATION,
                checkout: analyticsConsts.PAGE_NAMES.PLACE_ORDER,
                productpage: analyticsConsts.PAGE_NAMES.PRODUCTPAGE
            };

            switch (name) {
                case 'contentstore':
                    name = this.convertNameFromMediaID();

                    break;
                case analyticsConsts.PAGE_NAMES.BASKET:
                    if (Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) === 'prebasket') {
                        name = analyticsConsts.PAGE_NAMES.PREBASKET;
                    } else if (Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) === 'reserve and pick up basket') {
                        name = analyticsConsts.PAGE_NAMES.ROPIS_BASKET;
                    }

                    break;
                default:
            }

            return map[name] || name;
        },

        /**
         * Returns the name for content store pages mapped with media id
         * @returns {string} - Page Name for mediaId
         */
        convertNameFromMediaID: function () {
            const map = { 11000020: 'weekly specials' };

            return map[Sephora.analytics.backendData.mediaId];
        },

        convertAdditionalInfo: info => {
            const map = {
                orders: 'recent-orders',
                addresses: 'saved-addresses',
                paymentmethods: 'payments-gift-cards',
                emailpostal: 'email-postal-preferences'
            };

            return map[info] || info;
        },

        /**
         * @param {bool} clear - Whether or not we should delete the item after reading it.
         * @return {object} - The object stored in the cookie or null.
         */
        getPreviousPageData: function (clear) {
            var data = {};

            /* Protect against data that is not formatted as JSON */
            try {
                data = Storage.local.getItem(LOCAL_STORAGE.ANALYTICS_NEXT_PAGE_DATA);

                //Data must always be an object
                if (typeof data !== 'object' || data === null) {
                    data = {};
                }

                if (data && data.conditionals) {
                    for (let i = 0; i < data.conditionals.length; i += 1) {
                        data = this.addIfConditionsMet(data, data.conditionals[i]);
                    }
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('anaNextPageData was probably not formatted correctly.');
            }

            if (clear) {
                Storage.local.removeItem(LOCAL_STORAGE.ANALYTICS_NEXT_PAGE_DATA);
            }

            return data;
        },

        /**
         * Use the event name to find the most recent of that type
         * @param  {string} eventName The name of the event to look for
         * @param {object} attributes Optional if need to find more specific event by extra data
         * attributes of event as a key for lookup
         * @return {object}           The most recent event object with that event name
         */
        getMostRecentEvent: function (eventName, attributes = {}) {
            function eventAttributesMatch(eventAttributes, matchAttributes) {
                for (const matchAttr in matchAttributes) {
                    if (
                        Object.prototype.hasOwnProperty.call(matchAttributes, matchAttr) &&
                        matchAttributes[matchAttr] !== eventAttributes[matchAttr]
                    ) {
                        return false;
                    }
                }

                return true;
            }

            if (window && window.digitalData && window.digitalData.event) {
                //Start at the end
                var i = window.digitalData.event.length - 1;
                var savedFallback = '';

                while (i !== -1) {
                    var eventInfo = window.digitalData.event[i].eventInfo;

                    if (eventInfo.attributes.specificEventName === eventName && eventAttributesMatch(eventInfo.attributes, attributes)) {
                        return window.digitalData.event[i];
                    } else if (!savedFallback && eventInfo.eventName === eventName && eventAttributesMatch(eventInfo.attributes, attributes)) {
                        savedFallback = window.digitalData.event[i];
                    }

                    i -= 1;
                }

                //If we haven't already returned by now
                return savedFallback;
            } else {
                return {};
            }
        },

        /**
         * Get the desired property from most recent event based on the parameters sent from Signal.
         * This is important as it greatly reduces the amount of code that we need in Signal.
         * @param  {Object} opts An object that may contain a specific event name, or prop name.
         * @return {*} The value of the property that we need. This will usually be a string, but
         *             could be an array or object.
         * Note: opts.pathToProperty will be a string. Ex. 'eventInfo.attributes.actionInfo'
         */
        getMostRecentEventProperty: function (opts = {}) {
            const eventName = this.safelyReadProperty('eventObject.detail.specificEventName', opts) || opts.fallBackEventName;

            return this.safelyReadProperty(opts.pathToProperty, this.getMostRecentEvent(eventName));
        },

        /**
         * Fire an event and send data to the Tag Management System
         * @param  {string} eventName - The name of the event that the TMS is listening for.
         * @param  {*} eventData - Any data that needs to be sent along to the TMS event handler.
         */
        fireEventForTagManager: function (eventName, eventData = {}) {
            try {
                const event = new CustomEvent(eventName, eventData);

                window.dispatchEvent(event);
            } catch (error) {
                Sephora.logger.verbose('[TagManager] Failed to dispatch event:', eventName, error);
            }
        },

        /**
         * Get the value of a query parameter.
         * @param  {string} name - The query parameter name.
         * @param  {string} href - The string to look in.
         * @return {string}      - The value of the found parameter or empty string.
         */
        getQueryParam: function (param, href) {
            try {
                var result = '';

                href = href || location.href;

                if (href.indexOf('%20&%20') > 0) {
                    href = href.replace('%20&%20', 'ampersand');
                }

                param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                result = new RegExp('[\\?&]' + param + '=([^&#]*)').exec(href);

                return result === null ? '' : param === 'om_mmc' ? decodeURIComponent(result[1]) : decodeURIComponent(result[1].replace(/\+/g, ' '));
            } catch (e) {
                // eslint-disable-next-line no-console
                Sephora.logger.verbose('There was a problem with the getQueryParam function.');
            }

            return '';
        },

        /**
         * Remove any undefined items from an object
         * @param  {object / array} originalObj The original object or array
         * @return {object / array} The array with no undefined items
         */
        removeUndefinedItems: function (originalObj) {
            const isArray = Array.isArray(originalObj);

            if (isArray) {
                for (let i = 0, l = originalObj.length; i < l; i++) {
                    if (originalObj[i] === undefined) {
                        originalObj.splice(i, 1);
                    }
                }
            } else if (originalObj) {
                Object.keys(originalObj).forEach(key => {
                    if (originalObj[key] === undefined) {
                        delete originalObj[key];
                    }
                });
            }

            return originalObj;
        },

        safelyReadProperty: safelyReadProperty,

        /**
         * Save data into a cookie that gets read on every page load.
         * Data objects keys of prop[n], eVar[n] or event strings have
         * their values added to Adobe's global s object before the next tag fires.
         * @param  {object} data - The key value pairs that will be saved.
         */
        setNextPageData: function (data) {
            var existingData = this.getPreviousPageData();
            var mergedData;
            var key;

            try {
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }

                mergedData = data;

                if (existingData) {
                    for (key in data) {
                        //Merge existing data with this data
                        if (key === 'events' && Array.isArray(existingData[key])) {
                            existingData[key] = existingData[key].concat(data[key]);
                        } else {
                            existingData[key] = data[key];
                        }
                    }

                    mergedData = existingData;
                }

                data = mergedData;
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('There was a problem with setNextPageData');
            }

            Storage.local.setItem(LOCAL_STORAGE.ANALYTICS_NEXT_PAGE_DATA, data);
        },

        //Build the product string for 1 product.
        buildSingleProductString: function ({
            sku = {}, isQuickLook = false, newProductQty, displayQuantityPickerInATB = false, basket
        }) {
            let events = '';
            let quantity = '';
            let eVars = '';

            const isBopisBasket = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) === BOPIS_BASKET;
            events = this.buildEventsForSku({ sku, isQuickLook });
            eVars = this.buildEvarsForSku({ sku, isBopisBasket, basket });

            if (isBopisBasket && sku.isRemoval) {
                quantity = `${sku.quantity}`;
            } else if ((isBopisBasket || displayQuantityPickerInATB) && newProductQty) {
                quantity = `${newProductQty}`;
            }

            // Return <category>;<sku id>;<quantity>;<price>;<events>;<evars>
            return `;${sku.skuId};${quantity};;${events};${eVars}`;
        },

        buildEventsForSku: function ({ sku, isQuickLook }) {
            let events = '';

            if (sku.type === skuUtils.skuTypes.SAMPLE && !sku.isRemoval && !isQuickLook) {
                events += 'event17=1';
            }

            return events;
        },

        buildEvarsForSku: function ({ sku, isBopisBasket, basket }) {
            const eVar26 = `eVar26=${sku.skuId}`;

            const substituteItemString = sku.substituteSku ? sku.substituteSku.skuId : anaConsts?.Event?.DO_NOT_SUBSTITUTE;
            const isValidBasketForSubItem = isBopisBasket || sku.basketType === SAMEDAY_BASKET;

            const fulfillmentType = this.getFulfillmentType({ sku, isBopisBasket, basket });

            const eVar133 = fulfillmentType ? `|eVar133=${fulfillmentType}` : '';

            const eVarsStringForSubItem = isValidBasketForSubItem ? `|eVar131=${substituteItemString}|eVar132=${sku.skuId}` : '';

            return eVar26 + eVar133 + eVarsStringForSubItem;
        },

        getFulfillmentType: function ({ sku, isBopisBasket, basket }) {
            let { basketType } = sku;
            const { isReplenishment = false } = sku;

            if (isReplenishment) {
                return AUTOREPLENISH.toLowerCase();
            }

            if (basketType === BOPIS_BASKET || isBopisBasket) {
                return BOPIS.toLowerCase();
            }

            if (basketType === SAMEDAY_BASKET) {
                return SAMEDAY.toLowerCase();
            }

            // Not all skus have a basketType
            if (basketType === undefined) {
                basketType = basketHelpers.getSkuBasketType({ sku, basket });
            }

            // Return «standard» for «ShipToHome», or if even after getSkuBasketType, it is still
            // undefined
            if (basketType === STANDARD_BASKET || basketType === undefined) {
                return STANDARD.toLowerCase();
            }

            return basketType.toLowerCase();
        },

        // Build the auto replenishment product string for 1 product
        buildSingleAutoReplenishProductString: function (sku = {}) {
            const events = `eVar26=${sku.skuId}|eVar111=${sku.replenishmentFreqNum}:${sku.replenishmentFreqType}|eVar112=${sku.status}`;

            return `;${sku.skuId};${sku.qty};${sku.price};;${events}`;
        },

        buildAutoReplenishDeliveryFrequencyPoductString: function (sku = {}) {
            const events = `${analyticsConsts.Event.AUTO_REPLENISHMENT_PRODUCT_SETTING}=1;eVar111=${sku.frequency}:${sku.frequencyType}`;

            return `;${sku.skuId};${sku.qty};${sku.price};${events}`;
        },

        buildAutoReplenishmentEventsString: function () {
            return digitalData.page.attributes.eventStrings;
        },

        /**
         * Builds the products string for Add To Basket and Basket page
         * @param  {Array} products - An array of products
         * @returns {String} The built products string
         */
        buildProductStrings: function ({ products = [], basket }) {
            const productStrings = products.map(product => {
                const sku = product.currentSku || product.sku;
                sku.substituteSku = product.substituteSku;
                sku.isReplenishment = product.isReplenishment;

                return sku ? this.buildSingleProductString({ sku, basket }) : '';
            });

            return productStrings.join(',');
        },

        /**
         * Builds the products skus only string
         * @param  {Array} products - An array of products
         * @returns {String} The built products string
         */
        buildProductSkusOnly: function (products = []) {
            const productSkus = products.map(product => {
                const sku = product.currentSku || product.sku;

                return sku.skuId || '';
            });

            return productSkus.join(';');
        },

        /**
         * Take a price and use UFE's service provided exchange rate to convert to USD.
         * @param  {string} price - The original price.
         * @return {string} - The (potentially converted) price.
         */
        convertToUSD: function (price) {
            const countryCode =
                (Sephora.renderQueryParams && Sephora.renderQueryParams.country && Sephora.renderQueryParams.country.toUpperCase()) ||
                localeUtils.COUNTRIES.US;
            const currency = localeUtils.ISO_CURRENCY[countryCode];

            if (currency !== 'USD') {
                // Exchange Rates from Sephora's API.
                const exchangeRateValue = window.exchangeRate ? window.exchangeRate['CAD'] || false : false;

                if (exchangeRateValue) {
                    price = (price / exchangeRateValue).toFixed(2);
                }
            }

            return price;
        },

        /**
         * Removes $ or C$ from a price string
         * @param {string} amount
         * @return {string} The price without a currency symbol and standarized decimal character, that is
         * $455,99 -> 455.99
         */
        removeCurrencySymbol: function (amount = '') {
            const regExForPrice = /(?:(?:[\$])|(?:(?:C))|(?:(?:\s)))/g;
            const regExForStandardDecimal = /,(?=\d{2}$)/;

            return amount ? amount.replace(regExForPrice, '').replace(regExForStandardDecimal, '.') : '0';
        },

        formatBIPoint: function (points) {
            return points.replace(/\D/g, '');
        },

        getDoubleClickCategorySuffix: primaryCategory => {
            const indexMap = {
                [getText('makeup')]: '1',
                [getText('skincare')]: '2',
                [getText('hair')]: '3',
                [getText('fragrance')]: '4',
                [getText('gifts')]: '5',
                sale: '6'
            };

            return indexMap[primaryCategory];
        },

        getDoubleClickCategory(pixelType) {
            let cat = Sephora.isDesktop() ? 'deskt' : 'mobil';
            let primaryCategory;

            switch (pixelType) {
                case 'footer':
                case 'confirm':
                    cat += '0';

                    break;
                case 'basket':
                    cat += '000';

                    break;
                case 'category':
                    primaryCategory = digitalData.page.category.primaryCategory.toLowerCase();
                    cat += '00' + this.getDoubleClickCategorySuffix(primaryCategory);

                    break;
                default:
                    return '';
            }

            return cat;
        },

        /**
         * In an attempt to keep the digitalData object as slim as possible, this method
         * allows us to create and populate properties on digitalData ONLY if the value exists.
         * @param {Obejct} baseObj     The base object that will get the new property.
         * @param {string} newProp     The key of the property that we are going to set.
         * @param {*} value            The value of the property that we will set.
         */
        setIfPresent(baseObj, newProp, value = null) {
            if (value) {
                baseObj[newProp] = value;
            }
        },

        setNextPageDataAndRedirect(e, data = {}) {
            const { destination, trackingData } = data;

            e && typeof e.preventDefault === 'function' && e.preventDefault();
            this.setNextPageData(trackingData);
            locationUtils.setLocation(destination);
        },

        getLastAsyncPageLoadData(eventDetail, includePageType) {
            if (eventDetail) {
                const eventValues = Object.values(eventDetail);

                // return an empty object if the eventDetail has an undefined prop value
                if (eventValues.indexOf(undefined) !== -1) {
                    return {};
                }
            }

            const lastPageLoadEvent = this.getMostRecentEvent(anaConsts.ASYNC_PAGE_LOAD, eventDetail);

            const out = {
                pageName: getProp(lastPageLoadEvent, 'eventInfo.attributes.pageName'),
                previousPage: getProp(lastPageLoadEvent, 'eventInfo.attributes.previousPageName'),
                pageDetail: getProp(lastPageLoadEvent, 'eventInfo.attributes.pageDetail'),
                world: getProp(lastPageLoadEvent, 'eventInfo.attributes.world')
            };

            if (includePageType) {
                out.pageType = getProp(lastPageLoadEvent, 'eventInfo.attributes.pageType');
            }

            return out;
        },

        getPersonalizedEmailCampaignString() {
            const valueFromUrl = urlUtils.getParamsByName('p13n');

            if (valueFromUrl) {
                const decodedEmailPersonalizationFromUrl = decodeURIComponent(valueFromUrl);
                const individualMetrics = decodedEmailPersonalizationFromUrl.split('_');
                const p13n = {
                    context: 'none',
                    variation: 'none',
                    ruleId: 'none',
                    ruleSetId: 'none',
                    isControl: 'none',
                    isAbTest: 'none',
                    isDefault: 'none',
                    messageId: 'none'
                };
                individualMetrics.forEach(metric => {
                    const index = metric.indexOf('-');
                    const key = metric.substring(0, index);
                    const value = metric.substring(index + 1);

                    if (value.length > 0) {
                        p13n[key] = value;
                    }
                });
                const {
                    context, variation, ruleId, ruleSetId, isControl, isAbTest, isDefault, messageId
                } = p13n;
                const eVar123 = `mid=${messageId};c=${context};v=${variation};rid=${ruleId};rsid=${ruleSetId};isc=${isControl};isab=${isAbTest};isd=${isDefault}`;

                return eVar123;
            } else {
                return '';
            }
        },

        getContentfulPersonalization(p13nData) {
            let eVar122 = '';
            const contentList = p13nData?.p13n;

            if (!contentList) {
                return eVar122;
            }

            Object.keys(contentList).forEach(item => {
                const value = contentList[item];

                if (value === null || value === undefined || value?.length === 0) {
                    contentList[item] = 'n/a';
                }
            });

            const {
                context, variation, ruleId, ruleSetId, isControl, isAbTest, isDefault
            } = contentList;
            eVar122 = `c=${context};v=${variation};rid=${ruleId};rsid=${ruleSetId};isc=${isControl};isab=${isAbTest};isd=${isDefault}`;

            return eVar122;
        },

        saveProductClickAttributes: async function ({ carouselProductIndex, listType, productId }) {
            // We cannot do this at the top because on some pages utils is loaded before
            // store is initialized so everything would break
            const userUtils = await import('utils/User');

            const attributes = {
                attributes: {
                    carouselProductIndex,
                    listType,
                    productId,
                    preferredStoreId: userUtils.default.getPreferredStoreId(),
                    previousActionType: anaConsts.EVENT_NAMES.PRODUCT_PAGE.COLLECTION_CLICK
                }
            };

            digitalData.page.previousPageInfo = attributes;
        },

        hashString(stringToHash = '') {
            return new Promise(resolve => {
                hashing.sha256(stringToHash).then(hashedString => {
                    resolve(hashedString);
                });
            });
        },

        setWorldValueFromProduct() {
            // Makes sure that the world parameter carries a value for the category.
            const worldParameterIsNotAvailable =
                !digitalData?.page?.attributes?.world ||
                digitalData?.page?.attributes?.world === 'n/a' ||
                digitalData?.page?.attributes?.world === '';
            const productIsAvailable = Array.isArray(digitalData?.product) && digitalData?.product.length > 0;
            const productWorldIsNotAvailable = productIsAvailable && !digitalData?.product[0]?.attributes?.world;

            if (worldParameterIsNotAvailable && productWorldIsNotAvailable && productIsAvailable) {
                digitalData.page.attributes.world = digitalData?.product[0]?.attributes?.nthLevelCategory;
            }
        },

        buildItemSubstitutionProductString: function (data) {
            const basket = data.basket || {};
            const firstChoiceProductString = data.firstChoiceItem
                ? this.buildItemSubstitutionSingleProductString({
                    item: data.firstChoiceItem,
                    events: 'event270=1',
                    basket
                })
                : '';
            let productStrings = [];

            if (data.productRecs) {
                productStrings = data.productRecs.map(item => {
                    return this.buildItemSubstitutionSingleProductString({
                        item,
                        events: 'event272=1',
                        basket
                    });
                });
            } else if (data.availableOptions) {
                if (data.availableOptions.regularChildSkus) {
                    productStrings = data.availableOptions.regularChildSkus.map(item => {
                        const events = item.skuId === data.availableOptions.currentSku.skuId ? 'event274=1' : 'event275=1';

                        return this.buildItemSubstitutionSingleProductString({ item, events, basket });
                    });
                }
            }

            productStrings.unshift(firstChoiceProductString);

            return productStrings.join(',');
        },

        buildItemSubstitutionSingleProductString: function ({ item, events, basket }) {
            const sku = item.sku || item.currentSku || item;

            if (sku.salePrice) {
                events += '|event273=1';
            }

            if (sku.isOutOfStock) {
                events += '|event283=1';
            }

            const isBopisBasket = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) === 'buy online and pick up basket';

            const fulfillmentType = this.getFulfillmentType({ sku, isBopisBasket, basket });
            const eVar133 = `|eVar133=${fulfillmentType}`;

            const productString = `;${sku.skuId};${item?.qty || 1};${sku.salePrice || sku.listPrice};${events};eVar26=${sku.skuId}${eVar133}`;

            return productString;
        },

        buildItemSubstitutionEventString(data) {
            const events = ['event270'];

            if (data.productRecs?.length) {
                events.push('event272');
                const hasSaleRecs = data.productRecs.some(rec => {
                    return !!rec.currentSku?.salePrice;
                });

                if (hasSaleRecs) {
                    events.push('event273');
                }
            } else if (data.availableOptions) {
                events.push('event274');

                if (data.availableOptions.regularChildSkus?.length) {
                    events.push('event275');
                }

                if (data.availableOptions.onSaleChildSkus?.length) {
                    events.push('event273');
                }

                const hasOOSRecs = data.availableOptions.regularChildSkus?.some(rec => {
                    return !!rec.isOutOfStock;
                });

                const hasOOSSaleRecs = data.availableOptions.onSaleChildSkus?.some(rec => {
                    return !!rec.isOutOfStock;
                });

                if (hasOOSRecs || hasOOSSaleRecs) {
                    events.push('event283');
                }
            }

            return events;
        },

        savePageInfoName(pageName) {
            const fallBack = window?.digitalData?.page?.attributes?.sephoraPageInfo?.pageName;

            window.pageInfo = {
                pageName: pageName || fallBack,
                URL: window?.location?.href || '',
                path: window?.location?.pathname || ''
            };
        },

        getPageInfo() {
            // Ensure window.pageInfo exists and has a valid pageName
            window.pageInfo = window.pageInfo || {
                pageName: window?.digitalData?.page?.attributes?.sephoraPageInfo?.pageName || ''
            };

            return window.pageInfo;
        },

        getPaymentCardType(cardType) {
            const payCardTypes = {
                [SEPHORA_CARD_TYPES.PRIVATE_LABEL]: 'sephora card',
                [SEPHORA_CARD_TYPES.CO_BRANDED]: 'sephora visa'
            };

            return payCardTypes[cardType] || cardType;
        },

        componentShouldFireCMSAnalytics() {
            const pageType = digitalData?.page?.category?.pageType || Empty.String;
            const urlPathname = window?.location?.pathname || Empty.String;

            const urlPathnameWithoutCaPrefix = urlPathname.replace(urlUtils.isSEOForCanadaRegExp, '');

            let shouldFileAnalyticsFlag = false;

            if (['basket', 'home page'].includes(pageType)) {
                shouldFileAnalyticsFlag = true;
            } else if (pageType === 'contentstore') {
                if (urlPathnameWithoutCaPrefix === '/beauty/beauty-offers') {
                    shouldFileAnalyticsFlag = true;
                }
            } else if (pageType === 'user profile') {
                if (urlPathnameWithoutCaPrefix === '/rewards') {
                    shouldFileAnalyticsFlag = true;
                }
            }

            return shouldFileAnalyticsFlag;
        },

        shouldTriggerPageLoadEventForCurrentPage() {
            const currentPage = Sephora.analytics.backendData.pageType;
            const shouldTriggerPageLoadEvent = !anaConsts.NO_PAGE_LOAD_PAGE_TYPES.includes(currentPage);

            return shouldTriggerPageLoadEvent;
        },

        getCustomPageSourceName: function (currentPage = Sephora.analytics.backendData.pageType) {
            const PAGE_MAP = {
                [PageTemplateType.ShopMyStore]: anaConsts.PAGE_NAMES.SHOP_YOUR_STORE,
                [PageTemplateType.ShopSameDay]: anaConsts.PAGE_NAMES.SHOP_SAME_DAY
            };

            return PAGE_MAP[currentPage];
        },

        getAffiliateGatewayParams() {
            // Pulls parameters from localStorage.
            const affiliateGatewayParams = Storage.local.getItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_PARAMETERS_STORAGE);

            let linkshareSiteId = Empty.String;
            let linkshareTime = Empty.String;
            let sourceOfData = anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SOURCE_NA;

            // When Local Storage is not available fall back to cookies values.
            if (affiliateGatewayParams) {
                linkshareTime = dateUtils.restoreISO8601Format(affiliateGatewayParams?.linkshareTimeStamp || Empty.String);
                linkshareSiteId = affiliateGatewayParams?.siteId || Empty.String;
                sourceOfData =
                    linkshareTime !== '' && linkshareSiteId !== ''
                        ? anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SOURCE_STORAGE
                        : anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SOURCE_NA;
            } else {
                const cookieTimeStamp = cookieUtil.read(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_LINKSHARETIME_COOKIE) || Empty.String;
                linkshareTime = cookieTimeStamp !== '' ? dateUtils.restoreISO8601Format(cookieTimeStamp).split('|')[0] : Empty.String;
                linkshareSiteId = cookieUtil.read(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SITEID_COOKIE) || Empty.String;
                sourceOfData =
                    linkshareTime !== '' && linkshareSiteId !== ''
                        ? anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SOURCE_COOKIE
                        : anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SOURCE_NA;
            }

            return {
                linkshareSiteId,
                linkshareTime,
                sourceOfData
            };
        },

        storeAffiliateGatewayParams(params) {
            // Rakuten recommends 730 days
            const DEFAULT_STORAGE_LIFETIME = anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_COOKIE_LIFETIME * Storage.DAYS;
            const { orderId } = params;
            const { linkshareSiteId, linkshareTime, sourceOfData } = this.getAffiliateGatewayParams();
            Storage.local.setItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SITEID_STORAGE, linkshareSiteId, DEFAULT_STORAGE_LIFETIME);
            Storage.local.setItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_LINKSHARETIME_STORAGE, linkshareTime, DEFAULT_STORAGE_LIFETIME);
            Storage.local.setItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_RAKUTEN_ATTRSOURCE_STORAGE, sourceOfData, DEFAULT_STORAGE_LIFETIME);
            Storage.local.setItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_RAKUTEN_ORDERBYSOT_STORAGE, true, DEFAULT_STORAGE_LIFETIME);
            Storage.local.setItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_RAKUTEN_ORDERNUMBER_STORAGE, orderId, DEFAULT_STORAGE_LIFETIME);
        },

        resetAffiliateGatewayParams() {
            // Clears all Affiliate Gateway Parameters previously stored in localStorage.
            Storage.local.removeItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_PARAMETERS_STORAGE);
            Storage.local.removeItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SITEID_STORAGE);
            Storage.local.removeItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_LINKSHARETIME_STORAGE);
            Storage.local.removeItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_RAKUTEN_ATTRSOURCE_STORAGE);
            Storage.local.removeItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_RAKUTEN_ORDERBYSOT_STORAGE);
            Storage.local.removeItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_RAKUTEN_ORDERNUMBER_STORAGE);
        },

        checkLogoutEventIsAlreadyTracked() {
            if (digitalData?.page?.attributes?.eventStrings && Array.isArray(digitalData?.page?.attributes?.eventStrings)) {
                return digitalData.page.attributes.eventStrings.findIndex(event => event.startsWith('event56=')) !== -1;
            }

            return false;
        },

        trackLogoutEvent() {
            // Gets the profile status.
            const userData = digitalData?.user || [];
            const userProfile = userData.length > 0 ? userData[0]?.profile || [] : [];
            const userProfileInfo = userProfile.length > 0 ? userProfile[0]?.profileInfo || {} : {};
            const profileStatus = userProfileInfo?.profileStatus || '0'; // Default is set to 0.

            // Logout Tracking with Profile Status
            const event56 = `event56=${profileStatus}`;

            if (digitalData?.page?.attributes?.eventStrings && Array.isArray(digitalData?.page?.attributes?.eventStrings)) {
                digitalData.page.attributes.eventStrings.push(event56);
            } else {
                digitalData.page.attributes.eventStrings = [event56];
            }

            this.setNextPageData({ eventStrings: digitalData.page.attributes.eventStrings });

            window.dispatchEvent(new CustomEvent(anaConsts.LOGOUT_EVENT, {}));
        }
    }; //End Methods

    return methods;
}()); //End utilities export
