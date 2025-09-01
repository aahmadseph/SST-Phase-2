import store from 'store/Store';
import watch from 'redux-watch';
import jsUtils from 'utils/javascript';
import urlUtils from 'utils/Url';
import Storage from 'utils/localStorage/Storage';
import localeUtils from 'utils/LanguageLocale';

const CONTEXTS = {
    CONTAINER: 'container',
    MODAL: 'modal',
    INLINE: 'inline'
};

const COMPONENT_NAMES = {
    CAROUSEL: 54,
    GRID: 55,
    SKU_GRID: 67,
    IMAGE: 53,
    LINK: 58,
    LINK_GROUP: 59,
    MARKDOWN: 57,
    MODAL: 56,
    REWARDS_CAROUSEL: 62,
    SLIDESHOW: 52,
    VIDEO: 61,
    TARGETER: 63,
    HTML: 64,
    PRODUCT_FINDER: 66,
    PROMOTION: 65,
    PLACEHOLDERAPP: 70,
    TAB: 71,
    TABSLIST: 72,
    EMAILSMSOPTIN: 73,
    RWD_RECAP_LIST: 81,
    RWD_MULTI_BANNER: 82,
    RWD_REWARDS_LIST: 83,
    RWD_PERSONALIZED_PROMO_LIST: 88,
    RWD_SOFT_LINKS: 89,
    RWD_PROMO_LIST: 90,
    RWD_LINK: 92,
    RWD_BANNER: 93,
    RWD_TARGETER: 95,
    RWD_MODAL: 96,
    RWD_COPY: 97,
    RWD_PRODUCT_LIST: 98
};

const PLACEHOLDER_APPS = {
    FIXEDLIVECHAT: 'fixedLiveChatApp',
    DYNAMICLIVECHAT: 'dynamicLiveChatApp',
    GIFTCARDLOOKUP: 'giftCardLookupApp',
    CUSTOMER_SERVICE_CHAT: 'customerServiceChatApp',
    FEATURED_ACTIVITY_CAROUSEL: 'HAS_HUB_Featured',
    SERVICES_ACTIVITY_CAROUSEL: 'HAS_HUB_Services',
    CLASSES_ACTIVITY_CAROUSEL: 'HAS_HUB_Classes',
    EVENTS_ACTIVITY_CAROUSEL: 'HAS_HUB_Events',
    ANNOUNCEMENTS_ACTIVITY_CAROUSEL: 'HAS_HUB_Announcements',
    RECENTLY_VIEWED_CAROUSEL: 'recentlyViewedRewardsApp',
    MULTIPRODUCT_SHADEFINDER_RESULTS: 'multiproduct_shadefinder_results_ufe',
    SMS_PHONE_SUBSCRIBER: 'sms_subscriber_ufe'
};

const MEDIA_IDS = {
    BI_TERMS_AND_CONDITIONS: '28100020',
    BOPIS_BAG_FEE: '91100024',
    BOPIS_BASKET_CONTENT: '90600017',
    BOPIS_INFO: '91100025',
    BOPIS_PIF_FEE: '91100022',
    BOPIS_TAX_INFO: '91100023',
    CA_SHIPPING_INFO: '46200064',
    CASH_BACK_REWARDS_MODAL_CONTENT: '10400222',
    CREDIT_CARD_REWARDS: '85500021',
    MAKE_UP_SERVICES: '86400047',
    POINT_MULTIPLIER_MODAL: '86100022',
    POINTS_FOR_DISCOUNT_MODAL: '85100020',
    REWARDS_TERMS_AND_CONDITIONS: '11300018',
    ROPIS_FAQS: '88500017', // is mapped to /beauty/in-store-pick-up-faq for both BOPIS/ROPIS
    ROPIS_INFO: '88000018',
    SAME_DAY_DELIVERY_INFO: '94400017',
    AUTO_REPLENISHMENT: '98100018',
    AUTO_REPLENISHMENT_FAQ: '98800020',
    SDD_FAQ: '95400017',
    SERVICES_FAQ: '86300020',
    TAX_INFO: '46200066',
    US_SHIPPING_INFO: '47200026',
    VALUE_TABLE_MODAL_CONTENT: '72600017',
    ACCESS_POINT_INFO_MODAL: '97800023', // BCC temp placeholder content
    FINAL_SALE_PRODUCT_INFO_MODAL: '99100019', // BCC temp placeholder content for non returnable items
    OCCUPATIONAL_TAX_INFO_MODAL: '91100023', // BCC placeholder content for occupational tax item
    CURBSIDE_CONCIERGE_INFO_MODAL: '98100023',
    TERMS_OF_SERVICE_MODAL: '11300018',
    AUTOREPLENISH_TERMS_AND_CONDITIONS: '104400021',
    PRIVACY_POLICY_MODAL: '12300066',
    SAME_DAY_UNLIMITED_MODAL_US: '100700018',
    SAME_DAY_UNLIMITED_MODAL_CA: '100700019',
    SAME_DAY_UNLIMITED_US: '101400018',
    SAME_DAY_UNLIMITED_CA: '101400019',
    SAME_DAY_UNLIMITED_TERMS_AND_CONDITIONS: '101200018',
    SAME_DAY_UNLIMITED_FAQ: '100700020',
    RETAIL_DELIVERY_FEE_MODAL: '101200020',
    TEXT_TERMS_MODAL: '96300017'
};

const SEO_NAMES = {
    BEAUTY_OFFERS: 'beauty-offers',
    PROMOTIONS_MODAL: 'add-promotion-modal'
};

const IMAGE_SIZES = {
    42: 42,
    50: 50,
    62: 62,
    97: 97,
    135: 135,
    162: 162,
    250: 250,
    300: 300,
    450: 450,
    1500: 1500
};

const ADAPTATIVE_IMAGE_SIZES = {
    MOBILE_HEIGHT: '170',
    DESKTOP_HEIGHT: '60'
};

const COPY_TEXT_PLACEMENT = {
    HIDE: 'do not display',
    TOP: 'top',
    BOTTOM: 'bottom'
};

const GRID_VERTICAL_ALIGNMENT = {
    TOP: 'Top',
    MIDDLE: 'Middle',
    BOTTOM: 'Bottom'
};

const RWD_REWARDS_LIST_MINIMUM_POINTS = 100;

const BCC = {
    CONTEXTS,
    COMPONENT_NAMES,
    MEDIA_IDS,
    SEO_NAMES,
    IMAGE_SIZES,
    ADAPTATIVE_IMAGE_SIZES,
    PLACEHOLDER_APPS,
    COPY_TEXT_PLACEMENT,
    GRID_VERTICAL_ALIGNMENT,
    RWD_REWARDS_LIST_MINIMUM_POINTS,
    /** Function to process targeters async after userInfo service has completed */
    processTargeters: function (targetersList, callback) {
        const targetersArray = targetersList instanceof Array ? targetersList : [targetersList];

        const unsubscribers = [];

        for (let i = 0; i < targetersArray.length; i++) {
            const targeterName = targetersArray[i];
            const targeters = store.getState().targeters;

            if (targeters.results && targeters.results.targeterResult && targeters.results.targeterResult[targeterName]) {
                callback(targeters.results.targeterResult[targeterName], targeterName);
            }

            const watchTargeters = watch(store.getState, 'targeters');

            const unsubscriber = store.subscribe(
                watchTargeters(watchedTargeters => {
                    if (
                        watchedTargeters.results &&
                        watchedTargeters.results.targeterResult &&
                        watchedTargeters.results.targeterResult[targeterName]
                    ) {
                        callback(watchedTargeters.results.targeterResult[targeterName], targeterName);
                    }
                }),
                { ignoreAutoUnsubscribe: true }
            );
            unsubscribers.push(unsubscriber);
        }

        return unsubscribers;
    },

    extractTargeters: function (data = {}) {
        return jsUtils.filterObjectValuesByKey(data, key => key === 'targeterName', true);
    },

    buildTargetersQueryParams: function (targeterNames = []) {
        const queryParams = new Map();
        let queryParamString = '?';

        if (Array.isArray(targeterNames) && targeterNames.length > 0) {
            // eslint-disable-next-line no-param-reassign
            targeterNames = targeterNames.map(targetName => encodeURIComponent(targetName));
            queryParams.set('includeTargeters', targeterNames.join(','));
            queryParamString = urlUtils.buildQuery(queryParams);
        }

        return queryParamString;
    },

    setTargetWindow: function (target) {
        let targetWindow = target;

        if (typeof targetWindow === 'string') {
            targetWindow = targetWindow.toLowerCase();
        }

        switch (targetWindow) {
            case 1:
            case '1':
            case '_blank':
            case 'blank':
            case 'overlay':
                return '_blank';
            default:
                return null;
        }
    },

    getQuizName: function (urlPath) {
        return urlPath.substring(urlPath.lastIndexOf('/') + 1);
    },

    persistQuizResults: function (quizState) {
        Storage.session.setItem('quizState', JSON.stringify(quizState));
    },

    removeQuizResults: function () {
        Storage.session.removeItem('quizState');
    },

    retrieveQuizResults: function () {
        return Storage.session.getItem('quizState') && JSON.parse(Storage.session.getItem('quizState'));
    },

    excludeForFrCA: function (style = {}) {
        return (localeUtils.isFRCanada() && style.FR_CA_HIDE) || (!localeUtils.isFRCanada() && style.FR_CA_SHOW);
    }
};

export default BCC;
