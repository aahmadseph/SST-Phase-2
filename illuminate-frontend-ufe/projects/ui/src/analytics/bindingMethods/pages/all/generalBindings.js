import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import addressUtils from 'utils/Address';
import urlUtils from 'utils/Url';
import store from 'store/Store';
import userUtils from 'utils/User';
import biUtils from 'utils/BiProfile';
import processEvent from 'analytics/processEvent';
import Location from 'utils/Location';
import skuUtils from 'utils/Sku';
import basketUtils from 'utils/Basket';
import beautyPrefsUtils from 'utils/BeautyPreferences';
import cookieUtils from 'utils/Cookies';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';
import helperUtils from 'utils/Helpers';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import AddToBasketActions from 'actions/AddToBasketActions';
import { APPROVAL_STATUS } from 'constants/CreditCard';
import orderUtils from 'utils/Order';
import splitEDDUtils from 'utils/SplitEDD';
import itemSubstitutionUtils from 'utils/ItemSubstitution';
const { findBasketTypeByCommerceId } = itemSubstitutionUtils;
import testTarget from 'utils/TestTarget';
import PageTemplateType from 'constants/PageTemplateType';

const { getPageName } = testTarget;

const { hasHalAddress, hasAutoReplenishItems } = orderUtils;
const { getProp } = helperUtils;

export default (function () {
    //All Pages Binding Methods
    return {
        getATGID: function (user, order = {}) {
            return user.profileId || order.profileId || '';
        },

        getProfileStatus: function (auth) {
            return auth.profileStatus || 0;
        },

        getWebAnalyticsCipher: function (user) {
            return user.webAnalyticsCipher || '';
        },

        getWebAnalyticsHash: function (user) {
            return user.webAnalyticsHash || '';
        },

        getBiStatus: function (user) {
            var beautyInsiderAccount = user.beautyInsiderAccount || {};

            return (beautyInsiderAccount.vibSegment || 'non-bi').toLowerCase();
        },

        getFBbiStatus: function (user, auth) {
            var biStatus;

            if (this.getSignInStatus(auth) === 'unrecognized') {
                biStatus = 'not logged in';
            } else {
                var beautyInsiderAccount = user.beautyInsiderAccount || {};
                biStatus = (beautyInsiderAccount.vibSegment || 'none').toLowerCase();
            }

            return biStatus;
        },

        getBiPoints: function (user) {
            if (Location.isBasketPage() || Location.isRewardsPage() || Location.isProductPage()) {
                return basketUtils.getAvailableBiPoints() || 0;
            } else {
                var beautyInsiderAccount = user.beautyInsiderAccount || {};

                return beautyInsiderAccount.promotionPoints || 0;
            }
        },

        getChannel: function () {
            if (Sephora.channel?.toUpperCase() === 'RWD') {
                return cookieUtils.read(cookieUtils.KEYS.DEVICE_TYPE) === 'desktop' ? 'full site' : 'mobile';
            }

            return Sephora.isDesktop() ? 'full site' : 'mobile';
        },

        /**
         * Get the nickname of the user whose page you are viewing if it is not your page.
         * @param  {string} href The href of the current page.
         * @return {string}      The nickname.
         */
        getPageProfileId: (href, user) => {
            if (digitalData.page.category.pageType === anaConsts.PAGE_TYPES.COMMUNITY_PROFILE) {
                const hrefArray = href.split('/');
                const len = hrefArray.length;
                const nickName = hrefArray[len - 1].split('?')[0];

                if (hrefArray.indexOf('users') !== -1) {
                    if (user.nickName !== nickName) {
                        return nickName;
                    }
                }
            }

            return '';
        },

        getInternalCampaign: function (previousPageData = {}) {
            var paramNames = ['icid', 'icid2', 'int_cid'];

            if (
                (!Location.isNthCategoryPage() || !Location.isBrandNthCategoryPage()) &&
                previousPageData.internalCampaign &&
                previousPageData.pageType !== 'seop'
            ) {
                return previousPageData.internalCampaign;
            }

            for (const name of paramNames) {
                const campaign = utils.getQueryParam(name);

                if (campaign) {
                    return replaceSpecialCharacters(campaign);
                }
            }

            return '';
        },

        /**
         * Determine page name. The result will be stored in digitalData.page.pageInfo.pageName
         * and will be used as one piece of SephoraPageName, which is what actually gets reported.
         * @param  {string} pageType This page's path.
         * @return {string}          The name of this page.
         */
        getPageName: function (path = [], options = {}) {
            let name = '';

            switch (digitalData.page.category.pageType) {
                case anaConsts.PAGE_TYPES.USER_PROFILE:
                    name = path[path.length - 1];

                    if (path.indexOf('myaccount') !== -1) {
                        name = anaConsts.PAGE_NAMES.MY_ACCOUNT;
                    }

                    if ((options.rawPagePath || '').indexOf('RichProfile/BeautyInsider') !== -1) {
                        name = `${anaConsts.PAGE_NAMES.MY_BEAUTY_INSIDER}-`;

                        if (userUtils.isUserAtleastRecognized()) {
                            if (userUtils.isBI()) {
                                name += anaConsts.PAGE_NAMES.SIGNED_IN;
                            } else {
                                name += anaConsts.PAGE_NAMES.BENEFITS;
                            }
                        } else {
                            name += anaConsts.PAGE_NAMES.ANONYMOUS;
                        }
                    }

                    break;
                case anaConsts.PAGE_TYPES.COMMUNITY_PROFILE:
                    name = path[path.length - 1];

                    break;
                default:
                    name = path[0];
            }

            return utils.convertName(name);
        },

        getAdditionalPageInfo: (path = []) => {
            let info = '';

            if (path.indexOf('myaccount') !== -1) {
                info = path[path.length - 1];

                // Clear 'info' if there was no additional info besides 'myaccount'
                // Clear if it is any Replacement Order page
                if (info === 'myaccount' || info === 'replacementorder' || info === 'replacementorderstatus') {
                    info = '';
                }
            }

            if (path.indexOf('samedayunlimited') !== -1) {
                info = anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED;
            }

            return utils.convertAdditionalInfo(info);
        },

        getPlatform: function () {
            const isMobile = Sephora.isMobile();

            if (isMobile) {
                return 'mobile';
            } else if (Sephora.isTouch && !isMobile) {
                return 'tablet web';
            } else {
                return 'desktop web';
            }
        },

        /**
         * Report on how the client got to this page.
         * ToDo: The point of this string and how it is determined needs further
         * clarification from analytics PdMs.
         * @return {string} A description of how the client found got to this page.

        productFindingMethod: function(){
            var type = digitalData.page.category.pageType,
                pagesTypes = ['basket', 'checkout', 'order confirmation', 'product'];

            for(let currentType of pagesTypes){
                if(currentType === type){
                    if(digitalData.page.pageInfo.referringURL && document.referrer){
                        return "";
                    }
                    else {
                        return "Direct Entry" + (digitalData.page.attributes.ursChannelId ? " by " +
                        digitalData.page.attributes.ursChannelId : "");
                    }
                }
            }
            return "D=pageName";
        },
        */

        //Determine which adobe report suite to send analytics data to
        getReportSuiteId: function () {
            const env = utils.safelyReadProperty('global.process.env.UFE_ENV');

            return env === 'PROD' && Location.isProd() ? 'sephoracom' : 'sephorarenew';
        },

        /**
         * Build the page name.
         * Format is:
         * [PageType]:[PageDetail]:[ProductWorld]:*[ExtraString (if needed)]
         * @return {string} The assembled parts
         */
        getSephoraPageName: function () {
            let pageName = digitalData?.page?.pageInfo?.pageName || getPageName() || '';

            // Check if the pageName is not set with the expected format.
            // One example of this use is the special layouts on content pages.
            if (pageName.indexOf(':') === -1) {
                pageName = [
                    digitalData.page.category.pageType,
                    pageName,
                    digitalData.page.attributes.world || 'n/a',
                    '*' + (digitalData.page.attributes.additionalPageInfo || '')
                ];
                pageName = pageName.join(':').toLowerCase();
            }

            return replaceSpecialCharacters(pageName);
        },

        getPageNameMySephora: function (previousPageData) {
            const { BEAUTY_PREFERENCES, MY_SEPHORA, MY_LISTS } = anaConsts.PAGE_NAMES;
            const { USER_PROFILE } = anaConsts.PAGE_TYPES;

            if (Sephora.analytics.backendData.pageType === PageTemplateType.MyLists) {
                return `${USER_PROFILE}:${MY_LISTS}:n/a:*`;
            }

            if (previousPageData.isMySephoraPage) {
                return `${MY_SEPHORA}:${BEAUTY_PREFERENCES}:n/a:*`;
            }

            return this.getSephoraPageName();
        },

        /**
         * Determine sign in status
         * @param  {object} auth The current user object
         * @return {string}      The string reporting wants for each scenario
         */
        getSignInStatus: function (auth) {
            switch (auth.profileStatus) {
                case 4:
                    return 'signed in';
                case 2:
                case 3:
                    return 'recognized';

                default:
                    return 'unrecognized';
            }
        },

        /**
         * Check if the domain passed in is on our list of refererrs
         * @param  {string} referrerDomain Example: google.com
         * @return {bool}                  Whether or not the param was found on our list
         */
        referrerIsOnOurList: function (referrerDomain) {
            return anaConsts.REFERRER_DOMAINS.some(domains => {
                const domainsArr = domains.split(',');

                if (domainsArr.length > 1) {
                    let allStringsWereFound = false;

                    //Only return true if every check is true
                    for (const domain of domainsArr) {
                        if (referrerDomain.indexOf(domain) !== -1) {
                            allStringsWereFound = true;
                        } else {
                            return false;
                        }
                    }

                    return allStringsWereFound;
                } else {
                    return referrerDomain.indexOf(domainsArr[0]) !== -1;
                }
            });
        },

        /**
         * Gets just the domain of a referrer
         * @param  {string} referrer Example: google.com/?search=blah
         * @return {string}          Example: google.com
         */
        getReferrerDomain: function (referrer) {
            var referrerDomain = referrer.split('?')[0];

            return referrerDomain.split('/')[0];
        },

        /**
         * Determine the URS Tracking code
         * @param  {string} url The url or search portion of a url
         * @return {string}     URS Tracking code
         */
        getUrsTrackingCode: function (url, referrer) {
            const sephoraRegExp = /.*\.sephora\..*/;
            let referrerDomain;

            const cleanedUpUrl = decodeURIComponent(url || '');
            const param = (urlUtils.getParamsByName('om_mmc', cleanedUpUrl) || [])[0];

            if (param) {
                return param;
            } else {
                referrerDomain = this.getReferrerDomain(referrer);

                if (referrerDomain && this.referrerIsOnOurList(referrerDomain)) {
                    return referrerDomain + '[seo]';
                } else if (referrer.search(sephoraRegExp) === -1) {
                    return referrerDomain ? referrerDomain + '[ref]' : '';
                }
            }

            return '';
        },

        /**
         * Determine the marketing channel
         * @param  {string} url The url or search portion of a url
         * @return {string}
         */
        getMarketingChannel: function (url, referrer) {
            const sephoraRegExp = /.*\.sephora\..*/;
            var referrerDomain;

            var param = (urlUtils.getParamsByName('om_mmc', url) || [])[0];

            if (param) {
                return param.split('-')[0];
            } else {
                referrerDomain = this.getReferrerDomain(referrer);

                if (referrerDomain && this.referrerIsOnOurList(referrerDomain)) {
                    return 'Natural Search or SEO';
                } else if (referrer.search(sephoraRegExp) === -1) {
                    return referrerDomain ? 'Referrals' : '';
                }
            }

            return '';
        },

        //This is a convenience method for updating multiple user props using current user data.
        setUserPropsWithCurrentData: function () {
            //Always get this here, so it's fresh
            const currentUser = store.getState().user;
            const authData = store.getState().auth;
            const order = store.getState().order;
            const orderProfile = getProp(order, 'orderDetails.header.profile');
            //Hard coding as requested in CRMTS-68 since play status is already discontinued
            const playStatusString = 'play status:n/a';

            var segment = digitalData.user?.[0]?.segment;
            var profileInfo = digitalData.user?.[0]?.profile?.[0]?.profileInfo;

            if (segment) {
                segment.biStatus = this.getBiStatus(currentUser);
                segment.fbBiStatus = this.getFBbiStatus(currentUser, authData);
                segment.signInStatus = this.getSignInStatus(authData);
                segment.biPoints = this.getBiPoints(currentUser);
                segment.biAccountId = biUtils.getBiAccountId(currentUser) || '';
                //s.prop53
                segment.playStatus = playStatusString + ',' + this.getUserCCApprovalStatus() + ',' + this.getSDUStatus();
            }

            if (profileInfo) {
                profileInfo.profileID = this.getATGID(currentUser, orderProfile);
                profileInfo.profileStatus = this.getProfileStatus(authData);
                profileInfo.email = currentUser.login;
                profileInfo.webAnalyticsCipher = this.getWebAnalyticsCipher(currentUser);
                profileInfo.webAnalyticsHash = this.getWebAnalyticsHash(currentUser);
            }

            if (digitalData.user?.[0]) {
                this.fireUserRelatedEvents(digitalData.user[0]);
            }
        },

        isDCBasket: function () {
            const basketType = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE);

            return basketType === AddToBasketActions.BASKET_TYPES.DC_BASKET;
        },

        /**
         * Determines the current load page events
         * @param  {String} pageName - The current page name
         * @returns {Array} The current load page events
         */
        /* eslint-disable-next-line complexity */
        getPageEvents: function (pageName = '', pageType) {
            const events = [];
            const shortPageName = pageName.split(':', 1).toString();
            const isDCBasket = this.isDCBasket();
            const basket = store.getState().basket;
            const basketItems = basket.items;
            const currentUser = store.getState().user;
            const authData = store.getState().auth;

            let isOnlyFewLeftFlagPresent;

            switch (pageName) {
                case anaConsts.PAGE_NAMES.BASKET:
                    isOnlyFewLeftFlagPresent = basketItems.find(item => item.sku.isOnlyFewLeft === true);
                    events.push(anaConsts.Event.SC_VIEW);

                    if (isOnlyFewLeftFlagPresent && isDCBasket) {
                        events.push(anaConsts.Event.EVENT_46);
                    }

                    break;
                case anaConsts.PAGE_NAMES.PREBASKET:
                    events.push(anaConsts.Event.SC_VIEW);

                    break;
                case anaConsts.PAGE_NAMES.FAILED_SEARCH:
                    events.push(anaConsts.Event.FAILED_SEARCH);

                    break;
                case anaConsts.PAGE_NAMES.ADD_RATINGS_AND_REVIEWS:
                    events.push(anaConsts.Event.ADD_REVIEW_RATE_AND_REVEW);

                    break;
                case anaConsts.PAGE_NAMES.PRODUCT_SEARCH_RESULTS:
                    events.push(Sephora.configurationSettings.isNLPSearchEnabled ? anaConsts.Event.NLP_SEARCH : anaConsts.Event.ENDECA_SEARCH);

                    break;
                case anaConsts.PAGE_NAMES.BEAUTY_PREFERENCES:
                    // Set event223 event string on BeautyPreferences page load for pre-filled attributes condition
                    {
                        const { beautyPreferences } = store.getState().beautyPreferences;
                        const isAtLeastOneAnswered = beautyPrefsUtils.isAtLeastOneAnswered(beautyPreferences);

                        if (isAtLeastOneAnswered) {
                            events.push(anaConsts.Event.BEAUTY_PREFERENCES_PAGE_VISITS);
                        }
                    }

                    break;
                default:
                //Do nothing
            }

            switch (shortPageName) {
                case anaConsts.PAGE_NAMES.BOOK_CLASS_LANDING:
                case anaConsts.PAGE_NAMES.BOOK_SERVICE_LANDING:
                case anaConsts.PAGE_NAMES.BOOK_EVENT_LANDING:
                case anaConsts.PAGE_NAMES.BOOK_ANNOUNCEMENT_LANDING: {
                    const location = Location.getLocation(true);
                    const isHappeningEventsOrServicePage = /\/happening\/(services|events)/.test(location.pathname);

                    if (!isHappeningEventsOrServicePage) {
                        events.push(anaConsts.Event.EVENT_214);
                    }

                    break;
                }

                case anaConsts.PAGE_NAMES.CREDIT_CARD_APPLICATION_START:
                    events.push(anaConsts.Event.SC_CREDIT_CARD_APPLY_PAGE_LOAD);

                    break;
                default:
                //Do nothing
            }

            switch (pageType) {
                case anaConsts.PAGE_TYPES.NTHCATEGORY:
                case anaConsts.PAGE_TYPES.BRAND:
                case anaConsts.PAGE_TYPES.BRANDCAT:
                case anaConsts.PAGE_TYPES.TOPCATEGORY:
                case anaConsts.PAGE_TYPES.BRANDTOP:
                case anaConsts.PAGE_TYPES.BRANDNTH: {
                    if (digitalData.page.pageInfo.pageName !== anaConsts.PAGE_NAMES.BRANDSLIST) {
                        events.push(
                            Sephora.Util?.InflatorComps?.services?.CatalogService?.catalogEngine?.toLowerCase() === 'nlp'
                                ? anaConsts.Event.NLP_SEARCH
                                : anaConsts.Event.ENDECA_SEARCH
                        );

                        const { catalogTotalProducts } = digitalData.page.attributes;

                        if (typeof catalogTotalProducts === 'number') {
                            events.push(`${anaConsts.Event.PRODUCT_COUNT}=${catalogTotalProducts}`);
                        }
                    }

                    break;
                }
                case anaConsts.PAGE_TYPES.REPLACEMENT_ORDER:
                    if (pageName !== anaConsts.REPLACEMENT_ORDER.FAILURE_PAGE_ENTER) {
                        events.push(anaConsts.REPLACEMENT_ORDER.EVENT_NAME);
                    }

                    break;
                default:
                //Do nothing
            }

            if (digitalData.page.attributes.additionalPageInfo === anaConsts.PAGE_NAMES.ORDER_DETAIL) {
                if (digitalData.page.attributes.smsNotificationFlag != null) {
                    events.push(`${anaConsts.Event.EVENT_263}=${digitalData.page.attributes.smsNotificationFlag}`);
                }

                if (digitalData.page.attributes.isdeliveryLinkAvailable) {
                    events.push(anaConsts.Event.REPORT_ISSUE_MODAL);
                }

                if (digitalData.page.attributes.tempProps.isItemAndSubItemCanceled) {
                    events.push(anaConsts.Event.CANCELED_ITEM_AND_SUB_ITEM);
                }

                if (digitalData.page.attributes.tempProps.isItemSubstituted) {
                    events.push(anaConsts.Event.ITEM_SUBSTITUTED);
                }
            }

            if (digitalData.page.attributes.additionalPageInfo === anaConsts.PAGE_TYPES.AUTO_REPLENISHMENT) {
                events.push(utils.buildAutoReplenishmentEventsString());
            }

            if (
                digitalData.page.category.pageType === anaConsts.PAGE_TYPES.CHECKOUT &&
                digitalData.page.pageInfo.pageName !== anaConsts.PAGE_NAMES.ORDER_CONFIRMATION &&
                digitalData.page.pageInfo.pageName !== anaConsts.PAGE_NAMES.RESERVE_CONFIRMATION &&
                digitalData.page.pageInfo.pageName !== anaConsts.PAGE_NAMES.SAMEDAY_CONFIRMATION &&
                digitalData.page.pageInfo.pageName !== anaConsts.PAGE_NAMES.BOPIS_CONFIRMATION
            ) {
                events.push(anaConsts.Event.SC_CHECKOUT);

                if (hasHalAddress()) {
                    events.push(anaConsts.Event.EVENT_247);
                }

                if (hasAutoReplenishItems()) {
                    events.push(anaConsts.Event.AUTO_REPLENISHMENT_PRODUCT_SETTING);
                }
            }

            if (this.getSignInStatus(authData) !== 'unrecognized') {
                events.push(`${anaConsts.Event.EVENT_261}=${this.getBiPoints(currentUser)}`);
            }

            const event19 = `${anaConsts.Event.EVENT_19}=${basketUtils.getStandardItemsCount(basket)}`;
            const event20 = `${anaConsts.Event.EVENT_20}=${basketUtils.getBOPISItemsCount(basket)}`;
            events.push(event19, event20);

            // EVENT_290 is added for Checkout and Order confirmation pages
            // where Split EDD is displayed. Both shares the "checkout" page type.
            if (digitalData.page.category.pageType === anaConsts.PAGE_TYPES.CHECKOUT) {
                const splitEDDExperience = splitEDDUtils.iSplitEDDExperienceDisplayed();

                if (splitEDDExperience) {
                    events.push(anaConsts.Event.EVENT_290);
                }
            }

            // Global Events Setup: These events will be
            // appended to all outgoing page load analytics calls.
            const event295 = `${anaConsts.Event.EVENT_295}=${this.getStoreAndDeliveryFlyoutStatus(currentUser)}`;
            events.push(event295);

            return events;
        },

        /**
         * Sets the productStrings property in digitalData
         * @param  {String} pageName - The current page name
         */
        setProductStrings: function (pageName) {
            if (pageName === anaConsts.PAGE_NAMES.PREBASKET) {
                digitalData.page.attributes.productStrings = null;
            } else if (pageName === anaConsts.PAGE_NAMES.BASKET) {
                const basket = store.getState().basket;

                const itemsWithBasketType = basket.items.map(item => ({
                    ...item,
                    sku: {
                        ...item.sku,
                        basketType: findBasketTypeByCommerceId(item.commerceId, basket)
                    }
                }));

                const productString = utils.buildProductStrings({
                    products: itemsWithBasketType,
                    basket
                });
                digitalData.page.attributes.productStrings = productString;
            }
        },

        /**
         * used for the Double Click pixel to track purchased items in OrderConfirmation
         * according to https://jira.sephora.com/browse/ILLUPH-129207
         * @param {object} items list of items from orderDetails state
         */
        getArrayOfShortFilteredItems: function (items = []) {
            const nonCompliantItems = [
                skuUtils.skuTypes.GWP,
                skuUtils.skuTypes.SUBSCRIPTION,
                skuUtils.skuTypes.ROUGE_REWARD_CARD.toLowerCase()
                // @TODO toLowerCase should be removed in scope of the story
                // https://jira.sephora.com/browse/ILLUPH-130195
            ];

            return !items
                ? []
                : items
                    .filter(
                        item =>
                            item &&
                              item.sku &&
                              !skuUtils.isBiReward(item.sku) &&
                              typeof item.sku.type === 'string' &&
                              nonCompliantItems.indexOf(item.sku.type.toLowerCase()) === -1
                    )
                    .map(item =>
                        Object.assign(
                            {
                                id: item.sku.skuId,
                                quantity: item.qty
                            },
                            typeof item.sku.salePrice === 'string'
                                ? { price: basketUtils.removeCurrency(item.sku.salePrice) }
                                : typeof item.sku.listPrice === 'string' && { price: basketUtils.removeCurrency(item.sku.listPrice) }
                        )
                    );
        },

        getArrayOfPropValuesFromItems: function (items = [], property = '', notDeep = false, returnNone = false) {
            return items.map(function (item) {
                let propType = property;

                if (property === 'type') {
                    if (typeof item.sku['biType'] !== 'undefined') {
                        propType = 'biType';
                    }
                }

                if (property === 'listPriceSubtotal') {
                    if (typeof item['salePriceSubtotal'] !== 'undefined') {
                        propType = 'salePriceSubtotal';
                    }
                }

                if (notDeep) {
                    return item[propType];
                } else {
                    if (returnNone) {
                        return item.sku[propType] || 'None';
                    } else {
                        return item.sku[propType];
                    }
                }
            });
        },

        getCatName: function (items = [], type = 'cat') {
            var catArr = [];

            function createCatArray(nestedObj, level) {
                if (nestedObj && Object.prototype.hasOwnProperty.call(nestedObj, 'parentCategory')) {
                    // eslint-disable-next-line no-param-reassign
                    level = createCatArray(nestedObj.parentCategory, level);
                }

                if (!Array.isArray(catArr[level])) {
                    catArr[level] = [];
                }

                catArr[level].push(nestedObj ? nestedObj.displayName : '');

                return level + 1;
            }

            items
                .filter(item => !skuUtils.isGiftCard(item.sku) && !skuUtils.isSubscription(item.sku))
                .map(item => createCatArray(item.sku.parentCategory, 0));

            let returnIndex;

            switch (type) {
                case 'cat':
                    returnIndex = 0;

                    break;
                case 'subCat':
                    returnIndex = 1;

                    break;
                default:
                    returnIndex = catArr.length - 1;

                    break;
            }

            return catArr[returnIndex] || [];
        },

        getArrayOfRatings: function (items = []) {
            const ratingsArray = [];

            for (let i = 0; i < items.length; i++) {
                ratingsArray.push(items[i].sku.primaryProduct.rating || 0);
            }

            return ratingsArray;
        },

        /**
         * Sets or replace sort option or price range filter to the category filters list
         * @param  {Boolean} isPriceRange - It is either price range or sort by filter
         * @param  {Array} prices - Lowest and higher price range values
         * @param  {String} sortOptionName - Name of the sort option selected
         */
        setFilter: function (isPriceRange, prices, sortOptionName) {
            const categoryFilters = digitalData.page.attributes.sephoraPageInfo.categoryFilters;
            let filterExists = false;
            let filterString;
            let filterToReplace;
            let filterToReplaceIndex;
            const priceRangeString = 'price range=';
            const sortByString = 'sortby=';

            if (isPriceRange) {
                filterString = `${priceRangeString}${prices[0]}-${prices[1]}`;
                filterToReplace = priceRangeString;
            } else {
                filterString = `${sortByString}${sortOptionName}`.toLowerCase();
                filterToReplace = sortByString;
            }

            if (categoryFilters.length) {
                for (var i = 0; i < categoryFilters.length; i++) {
                    if (categoryFilters[i].indexOf(filterToReplace) !== -1) {
                        filterExists = true;
                        filterToReplaceIndex = i;
                    }
                }
            }

            if (filterExists) {
                categoryFilters[filterToReplaceIndex] = filterString;
            } else {
                categoryFilters.push(filterString);
            }

            digitalData.page.attributes.sephoraPageInfo.categoryFilters = categoryFilters;
        },

        /**
         * Remove filters by group name or value
         * @param  {String} filter group or value to be removed
         * @returns {Array} new array with updated list
         */
        removeFilters: function (filter) {
            const categoryFilters = digitalData.page.attributes.sephoraPageInfo.categoryFilters;

            const filterText = typeof filter === 'string' ? filter : filter?.props?.children;

            const filtersUpdated = categoryFilters.filter(element => {
                return element.indexOf(filterText.toLowerCase()) === -1;
            });

            return filtersUpdated;
        },

        fireUserRelatedEvents: userData => {
            if (userData.profile[0].profileInfo.email) {
                Sephora.analytics.promises.initialPageLoadFired.then(() => {
                    processEvent.processOnce('userIsLoggedInEvent', { data: { doesNotTriggerAdobeTag: true } });
                });
            }
        },

        getAudienceSegmentation: function () {
            const platform = this.getPlatform();
            const tests = [];

            // ATG Basket versus C+C
            if (Location.isBasketPage()) {
                const ecomBasketEnabled = cookieUtils.isRCPSCCEnabled();
                const experience = ecomBasketEnabled ? 'ecom-frictionless' : 'ATG-frictionless';

                tests.push(`1924_${platform}_frictionless-basket_0522_${experience}`);
            }

            return tests.join(';');
        },

        getUserCCApprovalStatus: function () {
            const creditCardInfo = userUtils.getSephoraCreditCardInfo();
            const ccApprovalStatus = creditCardInfo?.ccApprovalStatus;
            let userCCApprovalStatus;

            switch (ccApprovalStatus) {
                case APPROVAL_STATUS.NEW_APPLICATION:
                    userCCApprovalStatus = userUtils.isPreApprovedForCreditCard()
                        ? anaConsts.CC_APPROVAL_STATUS.PRE_APPROVED
                        : anaConsts.CC_APPROVAL_STATUS.INSTANT_CREDIT;

                    break;
                case APPROVAL_STATUS.IN_PROGRESS:
                    userCCApprovalStatus = anaConsts.CC_APPROVAL_STATUS.IN_PROGRESS_APP;

                    break;
                case APPROVAL_STATUS.APPROVED:
                    userCCApprovalStatus = anaConsts.CC_APPROVAL_STATUS.CARD_HOLDER;

                    break;
                case APPROVAL_STATUS.DECLINED:
                    userCCApprovalStatus = anaConsts.CC_APPROVAL_STATUS.DECLINED;

                    break;
                default:
                    userCCApprovalStatus = anaConsts.CC_APPROVAL_STATUS.OTHER;

                    break;
            }

            return ('credit card status:' + userCCApprovalStatus).toLowerCase();
        },

        getSDUStatus: function () {
            const statusMap = {
                ACTIVE: anaConsts.SDU_STATUS.SUBSCRIBED,
                INACTIVE: anaConsts.SDU_STATUS.UNSUBSCRIBED
            };
            const currentUser = store.getState().user;
            const sduSubscription = currentUser.userSubscriptions
                ? currentUser.userSubscriptions[0]
                : {
                    isTrialEligible: true,
                    status: 'INACTIVE',
                    type: 'SDU'
                };
            const userStatus = sduSubscription && statusMap[sduSubscription.status];
            const statusString =
                userStatus === anaConsts.SDU_STATUS.UNSUBSCRIBED
                    ? sduSubscription.isTrialEligible
                        ? userStatus
                        : anaConsts.SDU_STATUS.UNSUBSCRIBED_NOT_ELIGIBLE
                    : userStatus;

            return 'same-day unlimited:' + statusString;
        },

        getSDUSubscriptionType: function () {
            const { SUBSCRIBED, UNSUBSCRIBED, UNSUBSCRIBED_NOT_ELIGIBLE } = anaConsts.SDU_SUBSCRIPTION_TYPE;
            const currentUser = store.getState().user;
            const sduSubscription = currentUser.userSubscriptions
                ? currentUser.userSubscriptions[0]
                : {
                    isTrialEligible: true,
                    status: 'INACTIVE',
                    type: 'SDU'
                };
            const userStatus = sduSubscription?.status;

            const subscriptionType =
                userStatus === 'INACTIVE' ? (sduSubscription.isTrialEligible ? UNSUBSCRIBED : UNSUBSCRIBED_NOT_ELIGIBLE) : SUBSCRIBED;

            return 'sdu:' + subscriptionType;
        },

        getStoreAndDeliveryFlyoutStatus: function (user) {
            const preferredStore = user?.preferredStore;
            const preferredZipCode = user?.preferredZipCode;
            let status;

            if (preferredStore && preferredZipCode) {
                status = 4;
            } else if (preferredZipCode) {
                status = 3;
            } else if (preferredStore) {
                status = 2;
            } else {
                status = 1;
            }

            return status;
        },

        getShopYourStorePreferences: function () {
            const user = store.getState().user;
            const zipCode = addressUtils.formatZipCode(user?.preferredZipCode) || 'n/a';
            const storeId = user?.preferredStore || 'n/a';
            const storeName = user?.preferredStoreInfo?.displayName || 'n/a';

            const result = `${zipCode}:${storeId}:${storeName}`.toLowerCase();

            return result;
        }
    };
}());
