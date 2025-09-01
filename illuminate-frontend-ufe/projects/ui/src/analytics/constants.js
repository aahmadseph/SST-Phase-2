/**
 * Constants for analytics.
 * These are not really constants as they are ultimately mutable properties
 * of an object, but they still serve their purpose of providing an alias
 * which can be used instead of a string.
 */

import PageTemplateType from 'constants/PageTemplateType';

export default (function () {
    const ASYNC_PAGE_LOAD = 'asyncPageLoad';
    const PAGE_LOAD = 'pageLoadEvent';
    const PRODUCT_PAGE_LOAD = 'productPageLoad';
    const LINK_TRACKING_EVENT = 'linkTrackingEvent';
    const SELECT_ITEM_EVENT = 'selectItemEvent';
    const SOT_LINK_TRACKING_EVENT = 'SOTLinkTracking';
    const SOT_CSF_TRACKING_EVENT = 'SOTCSFTracking';
    const SOT_P13N_TRACKING_EVENT = 'SOTP13nEventsTracking';
    const DOUBLE_CLICK_FOOTER = 'doubleClickFooter';
    const DOUBLE_CLICK_PRODUCT_PAGE = 'doubleClickProductPage';
    const SNAPCHAT_PRODUCT_PAGE_VIEW_EVENT = 'snapchatProductPageViewEvent';
    const PINTEREST_PRODUCT_PAGE_VIEW_EVENT = 'pinterestProductPageViewEvent';
    const SNAPCHAT_QUICK_LOAD_EVENT = 'snapchatQuickLoadEvent';
    const PINTEREST_QUICK_LOAD_EVENT = 'pinterestQuickLoadEvent';
    const DOUBLE_CLICK_CATEGORY_PAGE = 'doubleClickCategoryPage';
    const PROMO_LINK_TRACKING_EVENT = 'promoLinkTrackingEvent';
    const CATEGORY_PAGE_LOAD = 'categoryPageLoad';
    const ADD_SHIPPINGINFO_EVENT = 'add_shipping_info';
    const ADD_PAYMENTINFO_EVENT = 'add_payment_info';
    const SHARE_EVENT = 'shareEvent';
    const VIEW_LIST_EVENT = 'viewListEvent';
    const SELECT_CONTENT_EVENT = 'selectContentEvent';
    const CHECKOUT_PAYMENT_VENMO = 'checkout:payment:venmo';

    const LOGOUT_EVENT = 'logoutEventDispatched';

    const CMS_REFERER_LOCAL_STORAGE_KEY = 'cmsRefererInfo';

    const CMS_COMPONENT_EVENTS = {
        IMPRESSION: 'cms viewable impression',
        ITEM_CLICK: 'cms component item click',
        COLLECTION_VIEW: 'collection view'
    };

    const CMS_URL_PARAMS = {
        icid2: 'icid2',
        cRefid: 'cRefid'
    };

    const EVENTS_TYPES_NAME = {
        VIEW: 'view',
        CLICK: 'click'
    };
    /* Quick Look Events */
    const QUICK_LOOK_LOAD = 'quickLookLoad';

    /* Pros And Cons Highlighted Events */
    const HIGHLIGHTED_REVIEWS_MODAL = 'highlightedReviewsModal';

    /* Sign-In Events */
    const SIGN_IN_MODAL_LOAD = 'signInModalLoad';
    const SIGN_IN_SUCCESS = 'signInSuccess';
    const SIGN_IN_PAGE_TYPE_DETAIL = 'sign in';
    const SIGN_IN_PAGE_TYPE_GUEST_CHECKOUT_DETAIL = 'sign in-guest checkout';

    /* Registration Events */
    const REGISTER_MODAL_LOAD = 'registerModalLoad';

    /* End Quick Look Events */

    /* Used for Context */
    const ADD_TO_BASKET_MODAL = 'addToBasketModal';

    const ADD_TO_CART = 'addToCart';

    const PRODUCT_STRING_TEMPLATE = ';{sku};;;;eVar26={sku}';

    const ADD_TO_LOVES_LIST = 'addToLovesList';

    const SMS = {
        DEFAULT_PAGETYPE: 'SMS_optin',

        ORDER_DETAILS_PAGENAME: 'orderDetails',
        ORDER_CONFIRMATION_PAGENAME: 'orderConfirmation',
        FOOTER_PAGENAME: 'Home_Footer',
        BRAND_LAUNCH_PAGENAME: 'brandLaunch',
        TEXT_ALERT_PAGENAME: 'deepLink',
        REWARDS_BAZAAR: 'RewardsBazaar',
        APP_DOWNLOAD: 'AppDownload',
        ROUGE_PREVIEW: 'RougePreview',

        CF_GLOBAL_PAGENAME: 'global'
    };

    const SMS_PAGENAME_PAGETYPE = {
        [SMS.ORDER_DETAILS_PAGENAME]: SMS.DEFAULT_PAGETYPE,
        [SMS.ORDER_CONFIRMATION_PAGENAME]: SMS.DEFAULT_PAGETYPE,
        [SMS.FOOTER_PAGENAME]: SMS.DEFAULT_PAGETYPE,
        [SMS.BRAND_LAUNCH_PAGENAME]: SMS.DEFAULT_PAGETYPE,
        [SMS.TEXT_ALERT_PAGENAME]: SMS.DEFAULT_PAGETYPE,
        [SMS.REWARDS_BAZAAR]: SMS.DEFAULT_PAGETYPE,
        [SMS.APP_DOWNLOAD]: SMS.DEFAULT_PAGETYPE,
        [SMS.ROUGE_PREVIEW]: SMS.DEFAULT_PAGETYPE
    };

    /* SIGNAL (Tag Management System)
     ** The below constants are needed because Signal does not have find and replace.
     ** These will be referenced within Signal instead of being called directly so that we can make
     ** updates here and references will still point to the actual method, value, etc. */

    //This gets populated in loadAnalytics.js, to avoid a circular reference problem.
    const GET_MOST_RECENT_EVENT = function () {};

    /* End Signal Constants */

    const PAGE_VARIANTS = {
        SWATCHES: '1',
        ONLY_FEW_LEFT: '2',
        ALTERNATE_IMAGES: '3',
        HERO_VIDEOS: '4',
        HOW_TO_USE_TAB: '5',
        INGREDIENTS_TAB: '6',
        USE_IT_WITH: '7',
        EXPLORE_VIDEOS: '8',
        EXPLORE_ARTICLES: '9',
        EXPLORE_LOOKS: '10',
        YOU_MIGHT_ALSO_LIKE: '11',
        SIMILAR_PRODUCTS: '12',
        RECENTLY_VIEWED: '13',
        STANDARD_USER: '21'
    };

    const CUSTOMIZABLE_SETS_VARIANTS = {
        NOT_CUSTOMIZABLE: 0,
        IS_CUSTOMIZABLE_CHOOSE_FREE_ITEM: '1',
        IS_CUSTOMIZABLE: '2'
    };

    const REFERRER_DOMAINS = [
        'google.',
        'bing.',
        'a9.',
        '*, q',
        'abacho.',
        'ah-ha.',
        'alexa.',
        'allesklar.',
        'wo,words',
        'alltheweb.',
        'q,query',
        'altavista.',
        'aol.',
        'arianna.',
        'query,b1',
        'asiaco.',
        'query,qry',
        'ask.',
        'q,ask',
        'atlas.',
        'austronaut.',
        'begriff,suche',
        'auyantepui.',
        'clave',
        'bluewin.',
        'qry,q',
        'centrum.',
        'club-internet.',
        'dino-online.',
        'dir.com.',
        'req',
        'dmoz.',
        'search',
        'dogpile.',
        'q,qkw',
        'eniro.',
        'euroseek.',
        'string,query',
        'exalead.',
        'excite.',
        'search,s,qkw',
        'findlink.',
        'key',
        'findwhat.',
        'mt',
        'fireball.',
        'freeserve.',
        'gigablast.',
        'go2net.',
        'general',
        'goeureka.',
        'key',
        'q,as_q,as_epq,as_oq',
        'googlesyndication.',
        'url',
        'greekspider.',
        'keywords',
        'hotbot.',
        'query,mt',
        'ilor.',
        'iltrovatore.',
        'index.nana.co.il.',
        'infoseek.',
        'qt,q',
        'infospace.',
        'qkw',
        'intuitsearch.',
        'iwon.',
        'ixquick.',
        'jubii.',
        'query,soegeord',
        'jyxo.',
        'kanoodle.',
        'kataweb.',
        'kvasir.',
        'live.',
        'looksmart.',
        'qt,key,querystring',
        'lycos.',
        'query,mt,q,qry',
        'mamma.',
        'metacrawler.',
        'q,general,qry',
        'msn.',
        'q,mt',
        'mywebsearch.',
        'searchfor',
        'mysearch.',
        'netex.',
        'srchkey,keyword',
        'netscape.',
        'search,searchstring,query',
        'netster.',
        'nettavisen.',
        'query,q',
        'ninemsn.',
        'nlsearch.',
        'qr',
        'nomade.',
        'mt,s',
        'northernlight.',
        'oozap.',
        'overture.',
        'ozu.',
        'passagen.',
        'quick.',
        'ftxt_query',
        'savvy.',
        'scrubtheweb.',
        'keyword,q',
        'www.search.com.',
        'searchalot.',
        'searchhippo.',
        'sensis.',
        'find',
        'seznam.',
        'w',
        'soneraplaza.',
        'qt',
        'splatsearch.',
        'searchstring',
        'sprinks.',
        'terms',
        'spray.',
        'srch.',
        'supereva.',
        'teoma.',
        'thunderstone.',
        'tiscali.ch.',
        'key',
        'tjohoo.',
        'soktext,mt,query',
        'track.',
        'truesearch.',
        'tygo.',
        'vinden.',
        'virgilio.',
        'qs',
        'vivisimo.',
        'voila.',
        'kw',
        'walla.',
        'wanadoo.',
        'fkw',
        'web.',
        'su',
        'webcrawler.',
        'qkw,search,searchtext',
        'webwatch.',
        'findindb',
        'wepa.',
        'query',
        'wisenut.',
        'xpsn.',
        'kwd',
        'ya.',
        'yahoo.',
        'p,va,vp,vo',
        'ynet.',
        'zerx.'
    ];

    // The most up-to-date event dictionary is supposed to be under
    // the following link:
    // https://jira.sephora.com/wiki/pages/viewpage.action
    // ?spaceKey=ANLYTX&title=SiteCatalyst+Variable+Mapping+and+Reports
    const Event = {
        INTERNAL_SEARCH: 'event1',
        FAILED_SEARCH: 'event2',
        UNDO_DELIVERY_CHANGE: 'undo',
        EMAIL_OPT_IN: 'event6',
        REGISTRATION_WITH_BI: 'event11',
        REGISTRATION_WITHOUT_BI: 'event12',
        REGISTRATION_STEP_1: 'event14',
        REGISTRATION_SUCCESSFUL: 'event15',
        REGISTRATION_PHONE_SUBMITTED: 'event293',
        REGISTRATION_PHONE_OPT_IN: 'event291',
        SIGN_IN_SUCCESS: 'event100',
        SIGN_IN_ATTEMPT: 'event140',
        SIGN_IN_FAILED: 'event141',
        SIGN_IN_RELOAD: 'signInReload',
        UPLOAD_PROFILE_PHOTO: 'event180',
        EDIT_ABOUT_ME_TEXT: 'event181',
        PRODUCT_VIEW: 'event24',
        PROD_VIEW: 'prodView',
        PRODUCT_COUNT: 'event23',
        PRODUCT_PAGE_VIEW: 'event200',
        PRODUCT_CLEAN_LABEL: 'event238',
        PRODUCT_PAGE_COLORIQ_ENABLED: 'event201',
        CANADA_REVENUE: 'event101',
        CANADA_DISCOUNT: 'event144',
        ENDECA_SEARCH: 'event234',
        NLP_SEARCH: 'event233',
        OPEN_CHALLENGE_DETAIL: 'event267',
        ADD_TO_LIST: 'event29',
        REMOVE_FROM_LIST: 'event30',

        // TODO: Assign better names to these constants
        EVENT_4: 'event4',
        EVENT_17: 'event17',
        EVENT_19: 'event19',
        EVENT_20: 'event20',
        EVENT_25: 'event25',
        EVENT_27: 'event27',
        EVENT_28: 'event28',
        CREATE_LIST: 'event32',
        HARD_GOOD_PRESENT: 'event34',
        GIFT_CARD_REVENUE: 'event35',
        ATB_FROM_BASKET_LOVE_CAROUSEL: 'event36',
        EVENT_37: 'event37',
        CAPTCHA_PRESENT: 'event39',
        EVENT_46: 'event46',
        EVENT_58: 'event58',
        EVENT_59: 'event59',
        EVENT_61: 'event61',
        EVENT_71: 'event71',
        EVENT_80: 'event80',
        EVENT_81: 'event81',
        EVENT_102: 'event102',
        EVENT_103: 'event103',
        EVENT_104: 'event104',
        EVENT_105: 'event105',
        EVENT_106: 'event106',
        EVENT_107: 'event107',
        EVENT_108: 'event108',
        EVENT_109: 'event109',
        EVENT_145: 'event145',
        EVENT_160: 'event160',
        EVENT_161: 'event161',
        EVENT_162: 'event162',
        EVENT_214: 'event214',
        BOOK_RESERVATION_SUCCESS: 'event215',
        RSVP_EVENT_SUCCESS: 'event217',
        RESCHEDULE_SUCCESS: 'event218',
        BOOK_ADD_SPECIAL_REQUEST: 'event224',
        EVENT_219: 'event219',
        EVENT_220: 'event220',
        EVENT_221: 'event221',
        EVENT_230: 'event230',
        EVENT_239: 'event239',
        EVENT_244: 'event244',
        EVENT_247: 'event247',
        EVENT_248: 'event248',
        EVENT_257: 'event257',
        EVENT_261: 'event261',
        EVENT_263: 'event263',
        EVENT_269: 'event269',
        EVENT_289: 'event289',
        EVENT_290: 'event290=1', // Split EDD displayed.
        EVENT_292: 'event292', // SMS unsubscribe success.
        EVENT_294: 'event294',
        EVENT_295: 'event295', // Shop Store & Delivery flyout status.

        SC_VIEW: 'scView',
        SC_REMOVE: 'scRemove',
        SC_ADD: 'scAdd',
        SC_CHECKOUT: 'scCheckout',

        SC_GUEST_ORDER_SIGN_IN_LOAD: 'event210',
        SC_GUEST_ORDER_SIGN_IN_CLICK: 'event211',
        SC_GUEST_ORDER: 'event212',
        SC_GUEST_ORDER_REGISTERED_USER: 'event213',

        SC_CREDIT_CARD_APPLY_PAGE_LOAD: 'event182',
        SC_CREDIT_CARD_APPROVED: 'event183',
        SC_CREDIT_CARD_PENDING: 'event184',
        SC_CREDIT_CARD_ERROR: 'event185',
        SC_CREDIT_CARD_SUBMIT: 'event245',

        ADD_REVIEW_RATE_AND_REVEW: 'event148',
        ADD_REVIEW_CONFIRMATION: 'event149',

        REWARD_PRESENT: 'event120',
        ONLY_REWARD: 'event126',
        PROMOTION_APPLIED: 'event54',
        SAMPLES_PRESENT: 'event51',
        SAMPLES_REDEEMED: 'event60',
        BI_CHIP_SUBSCRIBE: 'event186',

        VIB_TIER_MIGRATION: 'event236',
        ROUGE_TIER_MIGRATION: 'event237',
        ORDER_CANCELLATION_REQUEST: 'event241',
        ORDER_CANCELLATION_SUCCESS: 'event242',
        ORDER_CANCELLATION_DECLINE: 'event243',
        AUTO_REPLENISH_ACTIVE_PRODUCTS: 'event250',
        AUTO_REPLENISH_PAUSED_PRODUCTS: 'event251',
        DEFAULT_PAYMENT_METHOD_USED: 'event252',
        AUTO_REPLENISHMENT_PRODUCT_SETTING: 'event249',
        SDU_SUBSCRIPTION_CANCELED: 'event258',
        REPORT_ISSUE_MODAL: 'event259=1',
        EVENT_254: 'event254=1',
        BEAUTY_PREFERENCES_PAGE_VISITS: 'event223',
        ORDER_CONFIRMATION_GIFT_MESSAGE_ADDED: 'event265',
        GALLERY_COMPONENT_INTERACTION: 'event266=1',
        UGC_COMPONENT_INTERACTION: 'event266=2',
        CANCELED_ITEM_AND_SUB_ITEM: 'event276',
        ITEM_SUBSTITUTED: 'event277',

        DO_NOT_SUBSTITUTE: 'do not substitute',
        YES_STANDARD: 'Yes - standard'
    };

    const RMN_UFE_EVENT = 'rmn.onsite';

    const RMN_PAGE_NAMES = {
        category: 'browse',
        search: 'search',
        pdp: 'pdp'
    };

    const EVENT_NAMES = {
        ADD_TO_BASKET: 'add_to_basket',
        FACEBOOK_ADD_TO_BASKET: 'facebook_add_to_basket',
        ADD_TO_LOVES: 'add_to_loves',
        ERROR: 'error',
        REMOVE_FROM_LOVES: 'remove_from_loves',
        HERO_VIDEO_CLICK: 'HERO_VIDEO_CLICK',
        PRODUCT_ZOOM_MODAL_VIDEO_CLICK: 'PRODUCT_ZOOM_MODAL_VIDEO_CLICK',
        REGISTERED_FOR_BI: 'registeredForBI',
        REMOVE_FROM_BASKET: 'RemoveFromBasket',
        CREDIT_CARD_SIGNUP: 'creditCardSignup',
        BOOKED_RESERVATION: 'bookedReservation',
        GA_BEGIN_CHECKOUT: 'ga_begin_checkout',
        ROPIS_ORDER: 'ropis_order',
        BOPIS_ORDER: 'bopis_order',
        SAME_DAY_ORDER: 'SameDayDelivery',
        GENERIC_ERROR_PAGE_LOAD: 'genericErrorPageLoad',
        GENERIC_ERROR_TRACKING: 'genericErrorTracking',
        PLA_SPONSORED_PRODUCT_CLICK: 'pla_sponsored_product_click',
        PLA_HOMEPAGE_SPONSORED_PRODUCT_CLICK: 'hp sponsored carousel click',
        BESTSELLER_PRODUCT_CLICK: 'bestseller carousel product click',
        PLA_SPONSORED_CAROUSEL_CLICK: 'pla_sponsored_carousel_click',
        PLA_SPONSORED_PRODUCT_VIEWABLE_IMPR: 'pla_sponsored_product_viewable_impression',
        PLA_SPONSORED_CAROUSEL_VIEWABLE_IMPRESSION: 'pla_sponsored_carousel_viewable_impression',
        PLA_SPONSORED_BANNER_CLICK: 'pla_sponsored_banner_click',
        PLA_SPONSORED_BANNER_VIEWABLE_IMPR: 'pla_sponsored_banner_viewable_impression',
        PLA_HOME_SPONSORED_BANNER_VIEWABLE_IMPR: 'hp sponsored banner viewable impression',
        PLA_HOME_SPONSORED_BANNER_CLICK: 'hp sponsored banner click',
        PLA_HOME_SPONSORED_CAROUSEL_VIEWABLE_IMPR: 'hp sponsored carousel viewable impression',
        SAME_DAY_DELIVERY_RADIO_BUTTON_CLICK: 'same-day delivery radio button click',
        RMN_PLA_CLICK: 'rmn-pla-click:product',
        RMN_BANNER_CLICK: 'rmn-banner-click:non-product',
        ASK_QUESTION_BODY_DETAILS: 'ask_question_body_details',
        ANSWER_QUESTION_BODY_DETAILS: 'answer_question_body_details',
        CAROUSEL_PRODUCT_CLICK: 'carousel_product_click',
        CAROUSEL_NAVIGATION_CLICK: 'carousel_navigation_click',
        BAZAAR_VOICE_POLICY_CLICK: 'bazaar voice authenticity policy click',
        AUTO_REPLENISHMENT: {
            SKIP_UNAVAILABLE: 'auto replenish skip subscription unavailable',
            SKIP_CONFIRMATION: 'auto replenish skip subscription confirmation',
            FREQUENCY_CONFIRMED: 'auto replenish delivery frequency confirmed',
            FREQUENCY_CLOSE: 'auto replenish delivery frequency close',
            UNSUBSCRIBE: 'auto replenish unsubscribe subscription confirmation',
            MANAGE_SUBSCRIPTION_CLOSE: 'auto replenish manage subscription close',
            GET_IT_SOONER_CONFIRM: 'auto replenish get it sooner subscription confirmation',
            GET_IT_SOONER_CLOSE: 'auto replenish get it sooner subscription close',
            GET_IT_SOONER_UNAVAILABLE: 'auto replenish get it sooner subscription unavailable',
            RESUME_CLOSE: 'auto replenish resume subscription close',
            PAUSE_CLOSE: 'auto replenish pause subscription close',
            PAUSE_CONFIRMATION: 'auto replenish pause subscription confirmation',
            CLOSE_UNSUBSCRIBE: 'auto replenish unsubscribe subscription close',
            CLOSE_SKIP: 'auto replenish skip subscription close',
            CONFIRM_RESUME: 'auto replenish resume subscription confirmation',
            UPDATE_PAYMENT_SAVE: 'auto replenish update payment saved',
            UPDATE_PAYMENT_CLOSE: 'auto replenish update payment close',
            ADD_CARD_MODAL_CLOSE: 'auto replenish add payment close',
            EDIT_CARD_MODAL_CLOSE: 'auto replenish edit payment close',
            ADD_CARD_MODAL_SAVE: 'auto replenish add payment saved',
            EDIT_CARD_MODAL_SAVE: 'auto replenish edit payment saved',
            REMOVE_PAYMENT: 'auto replenish remove payment',
            LOAD_MORE: 'auto replenish load more'
        },
        SAME_DAY_UNLIMITED: {
            EDIT_PAYMENT_CLOSE: 'same-day unlimited edit payment close',
            UPDATE_PAYMENT_SAVE: 'same-day unlimited update payment saved',
            EDIT_PAYMENT_SAVE: 'same-day unlimited edit payment saved',
            UPDATE_PAYMENT_CLOSE: 'same-day unlimited update payment close',
            ADD_PAYMENT_SAVE: 'same-day unlimited add payment saved',
            ADD_PAYMENT_CLOSE: 'same-day unlimited add payment close',
            REMOVE_PAYMENT: 'same-day unlimited remove payment',
            FAQ_CLICK: 'same-day unlimited faqs',
            TRIAL_ALREADY_ADDED: ' same day unlimited:trial already added',
            ADD_TO_BASKET: 'same day unlimited add to basket',
            CANCEL_SUBSCRIPTION_OPEN: 'same day unlimited cancel subscription open',
            CANCEL_SUBSCRIPTION: 'cancel subscription'
        },
        BANNER: {
            BANNER_IMPRESSION: 'personalized banner viewable impression',
            PERSONALIZED_BANNER_CLICK: 'personalized banner click'
        },
        CHECKOUT: {
            BIRTHDAY_GIFT_REDEMPTION: 'birthday gift redemption',
            ACCESS_POINT: 'access points-select location',
            UNAVAILABLE_ACCESS_POINT: 'access points-selected location unavailable',
            TYPE_FEDEX: 'fedex select location',
            ACCESS_POINTS_ENTRY: 'fedex access points entry click',
            PLACE_BOPIS_ORDER: 'place order',
            PLACE_STANDARD_ORDER: 'standard place order',
            PAYPAL_CLICK: 'checkout payment paypal click'
        },
        PRODUCT_PAGE: {
            CREDIT_CARD_SEE_DETAILS: 'credit card see details',
            SEE_DETAILS: 'see details',
            ADD_ALL_TO_BASKET: 'frequently bought together add all to basket',
            VIEW_BASKET_AND_CHECKOUT: 'view basket and checkout',
            QUANTITY_CHANGE: 'product edit quantity',
            SDD_ZIPCODE_CHANGE: 'same day unlimited enter zipcode',
            SDD_ZIPCODE_CHANGE_OOS: 'same day unlimited zip code unavailable',
            SHOP_ALL: 'shop all from this brand',
            REVIEWS: 'reviews',
            IMAGE_FROM_REVIEWS: 'image from reviews',
            HIGHLY_RATED: 'ratings&reviews-highly rated modal',
            OUT_OF_STOCK: 'out of stock notification',
            COMING_SOON: 'coming soon notification',
            UNSUBSCRIBE: 'unsubscribe',
            SWATCH_CHANGE: 'product alt image swatch size',
            COLLECTION_CLICK: 'product item click from collection'
        },
        HAPPENING_AT_SEPHORA: {
            GIFT_A_SERVICE: 'gift a service click',
            COMPLETE_BOOKING: 'happening complete booking',
            ITEM_CLICK: 'happening activity item tap',
            ADD_TO_CALENDAR: 'add to calendar',
            CANCEL_BOOKING: 'cancel booking',
            BOOK_RESERVATION_PHONE_VALIDATION: 'book a reservation-phone validation',
            START_BOOKING: 'start booking',
            RSVP_BOOKING: 'rsvp booking',
            RESERVATION_DETAILS: 'reservation-details',
            SHOW_MAP: 'show map',
            CANCEL_EVENT_CONFIRMATION: 'cancel event-confirmation',
            CONTINUE_BOOKING: 'continue booking',
            CONTINUE_AS_A_GUEST: 'continue as a guest',
            CONTINUE_AS_GUEST: 'continue as guest'
        },
        MEDALLIA: {
            FEEDBACK_CLICK: 'medallia feedback let us know click',
            FORM_DISPLAYED: 'medallia form displayed',
            FORM_SUBMITTED: 'medallia form submitted',
            FORM_DISMISSED: 'medallia form dismissed'
        },
        PROMO_NOTIFICATIONS: {
            BBQ_SIGN_IN: 'BBQ promo sign in',
            BBQ_JOIN_BI: 'BBQ promo join BI'
        },
        SEARCH: {
            MEGA_FILTER: 'mega-filter',
            SHOW_RESULTS: 'mega filter show results click'
        },
        ORDER_DETAILS: {
            CANCEL_ORDER_MODAL: 'order cancel',
            REASONS: 'reasons',
            CURBSIDE: {
                CURBSIDE: 'curbside',
                PICKUP: 'curbside-pickup',
                DETAILS: 'curbside-details',
                SUCCESS: 'curbside-success',
                ORDER_NOT_AVAILABLE: 'curbside-order status pickup not available',
                HERE_FOR_CURBSIDE: 'here for curbside',
                HERE_FOR_CURBSIDE_CLICK: 'here for curbside click',
                HOURS_CLOSED: 'hours closed',
                SHOW_PICKUP_BARCODE: 'show pickup barcode',
                VERIFICATION: 'curbside-pickup verification'
            },
            SMS_MODAL: {
                SING_UP: 'sms-get order updates',
                CONFIRMATION: 'sms-confirmation',
                SMS_BUTTON_CLICK: 'see order details & get sms updates click'
            }
        },
        RICH_PROFILE: {
            CREDIT_CARDS: {
                MANAGE_MY_CARD: 'creditcard manage my card'
            }
        },
        REWARDS: {
            APPLY_CREDIT_CARD: 'apply creditcard reward'
        },
        NTH_CATEGORY: {
            CLEAR_ALL: 'chiclets clear all',
            SELECT_FILTER: 'chicklet items tapped'
        },
        LOVES: {
            SHARE: 'share love list',
            CREATE_NEW_LIST: 'create new shareable list click',
            ADD_SKU_TO_LIST: 'shareable list sku addition success',
            SHAREABLE_LIST_DISPLAYED: 'shareable list pop up displayed',
            SHAREABLE_LIST_CREATED: 'shareable list created',
            SHAREABLE_LIST_EDITED: 'shareable list edit clicked',
            SHAREABLE_LIST_DELETED_CLICK: 'shareable list delete clicked',
            SHAREABLE_LIST_DELETED_SUCCESS: 'shareable list delete success',
            SHAREABLE_LIST_UPDATE_SUCCESS: 'shareable list details update success',
            SHAREABLE_LIST_SHARE_LINK_COPIED: 'shareable list share link copied',
            SHAREABLE_LIST_SHARED: 'shareable list shared',
            MANAGE_LIST: 'manage list',
            DELETE_LIST: 'delete list',
            MY_LISTS_MODAL: 'my lists modal',
            CREATE_NEW_LIST_PAGE_LOAD: 'create new list',
            CREATE_LIST: 'create list',
            LIST_LIMIT_REACHED: 'list limit reached',
            CANCEL_MODAL: 'cancel modal',
            LIST_SHARE_YOUR_LIST: 'lists-share your list',
            SHARE_LINK: 'share',
            LIST_DETAIL_PAGE_NAME: 'user profile:my lists:list detail:*'
        },
        RESERVATIONS: {
            RESERVATION_CLICK: 'happening reserved item click',
            CANCEL_BOOKING: 'happening cancel booking'
        },
        BEAUTY_PREFERENCES: {
            KEEP_GOING: 'mysephora bi signup skip spoke',
            ACCORDION_OPEN: 'mysephora accordion',
            SKIP_QUESTION: 'mysephora beauty preferences skip question',
            ACCORDION: 'accordion',
            SAVE_AND_CONTINUE: 'beauty preference save and continue',
            SAVE: 'beauty preference save',
            SIGN_IN: 'beauty preferences sign in to save',
            INGREDIENT_PREFERENCES: 'ingredient preferences',
            FAVORITE_BRANDS: 'select favorite brands',
            SPOKE: 'mysephora:guided selling spoke displayed'
        },
        GALLERY: {
            REPORT_PHOTO: 'beautyboard flagged',
            DELETE_PHOTO: 'beautyboard deletephoto',
            PHOTO_CHANGE: 'ugc photo change',
            SCROLL: 'ugc scroll more navigation',
            SWIPE: 'ugc product swipe',
            IMAGE_CLICK: 'ugc image component click'
        },
        BASKET: {
            MULTI_PROMO_MODAL: 'multi promo code modal',
            CHECKOUT_STANDARD: 'checkout payment standard',
            CHECKOUT_BOPIS: 'checkout payment bopis',
            SOT_ADD_TO_BASKET: 'Add To Basket',
            SOT_REMOVE_FROM_BASKET: 'Remove From Basket'
        },
        SIGN_IN: {
            EMAIL_SENT: 'forgot password email sent',
            EMAIL_RESENT: 'forgot password email resent'
        },
        PRODUCT_FINDER: {
            QUIZ_QUESTION: 'product finder quiz question'
        },
        CHANGE_STORE: 'change store',
        ME_FLYOUT: {
            BEAUTY_INSIDER_SUMMARY: 'me-flyout:bi-summary click'
        },
        SHARE: 'share',
        GIFT_CARD: {
            LANDING_CHECK_BALANCE: 'gift card landing:check balance',
            CHECK_BALANCE: 'gift card:check balance',
            ADD_TO_WALLET: 'gift card:add to wallet'
        }
    };

    const MEDIA_TYPE = {
        IMAGE: 'IMAGE',
        VIDEO: 'VIDEO'
    };

    const CONTEXT = {
        BASKET_PRODUCT: 'product',
        BASKET_SAMPLES: 'basket_samples',
        BASKET_REWARDS: 'basket_rewards',
        BASKET_LOVES: 'basket_loves',
        BASKET_PAGE: 'basket',
        CHECKOUT_PAGE: 'checkout',
        USE_IT_WITH: 'use it with',
        QUICK_LOOK: 'quicklook',
        ROUGE_REWARD_CARD_BANNER: 'rouge_reward_card_banner',
        PRODUCTPAGE: 'product',
        CONTENT_STORE: 'content_store',
        ADD_TO_BASKET_STICKY_BANNER: 'add_to_basket_sticky_banner',
        ORDER_CONFIRMATION: 'order-confirmation',
        REPLEN_PRODUCT: 'replen_product',
        BI_REWARDS_CAROUSEL: 'bi_rewards_carousel',
        FREQUENTLY_BOUGHT_TOGETHER: 'frequently bought together',
        CLEAN_AT_SEPHORA: 'clean at sephora',
        BEAUTY_OFFERS: 'beauty offers',
        SAME_DAY_UNLIMITED: 'same-day unlimited',
        REPLACEMENT_ORDER: 'replacement-order',
        GALLERY_VIDEO: 'gallery_video',
        BANNER: 'banner',
        LIST: 'list',
        BUYING_GUIDES: 'buying guides'
    };

    const CAMPAIGN_STRINGS = {
        ADD_TO_BASKET: 'add-to-basket',
        DEFAULT_CAROUSEL_PARAM: 'product',
        RMN_PLA: 'rmn-pla',
        RMN_BANNER: 'rmn-banner'
    };

    const LinkData = {
        SSI: 'stay signed in',
        SELECT_SAMPLES: 'basket:select samples:top',
        SELECT_REWARDS: 'basket:redeem rewards:top',
        CHECKOT_BUTTON_STANDARD: 'checkout:payment:standard',
        ROPIS_CONTINUE_TO_RESERVATION: 'continue to reservation details',
        ROPIS_RESERVATION_COMPLETE: 'complete reservation',
        BOPIS_ORDER_COMPLETE: 'place order',
        BI_PRIVATE_PROFILE: 'profile:bi-traits:private',
        BACK_TO_TOP: 'ppage:back_to_top',
        VIEW_ARTICLES: 'product_learn more_related articles_non-glossy',
        VIEW_PHOTOS: 'product_learn more_related photos',
        MODAL: 'modal',
        RECOMMENDED_ADDRESS: 'address verification:use recommended address:drop-down',
        CUSTOMER_CHAT_SESSION_STARTED: 'customer chat:start session',
        CUSTOMER_CHAT_SESSION_RESUME: 'customer chat:resume session',
        CUSTOMER_CHAT_NOW_CTA_AB_TEST: 'live beauty help click',
        BRANDSLIST: 'brandslist:page:products_back_to_top',
        STORESLIST: 'storeslist:page:products_back_to_top',
        PRODUCTS_BACK_TO_TOP: 'products_back_to_top',
        VIDEO_POPUP: 'video popup',
        CCPA_COOKIE_BANNER_ACCEPT: 'ccpa cookies:accept',
        CCPA_COOKIE_BANNER_PRIVACY: 'ccpa cookies:privacy policy',
        TLP_SHOP_NOW: 'your promo:shop now',
        PFD_APPLY: 'bi:points for discount:apply in basket',
        RRC_APPLY: 'bi:rouge rewards:apply in basket',
        ADV_SHOP_NOW: 'advocacy:shop now',
        LOVES_MODAL_VIEW_ALL: 'loves modal:view all',
        VIEW_IN_BASKET_BUTTON: 'view in basket button',
        VIEW_ITEMS_AND_RESERVE: 'view items and reserve',
        VIEW_ITEMS_AND_CHECKOUT: 'view items and checkout',
        ADD_TO_BASKET_CUSTOM_SET: 'product:custom set:add all to basket',
        VIEW_ITEMS_AND_CHECKOUT_BOPIS: 'view items and checkout:bopis',
        VIEW_ITEMS_AND_CHECKOUT_SHIPPED: 'view items and checkout:shipped',
        VIEW_SHIPPING_AND_RETURNS: 'shipping and returns',
        VIEW_INFORMATION_ICON: 'information icon',
        VIEW_OTHER_STORES: 'check other stores',
        SHOW_MORE_PRODUCTS: 'show more products',
        READY_TO_CHECKOUT: 'ready to checkout',
        CUSTOMER_CHAT_SESSION_ENDED: 'customer chat:end session',
        PERSONAL_RECOMMENDATION: 'personal-recommendation:click',
        SEPHORA_CHECKOUT_BUTTON: 'checkout:payment:pay with sephora credit card',
        GIFT_CARD: 'gift card',
        SHOP_PAGE: 'shop:page',
        SAME_DAY_TIME_SELECTION: 'same day delivery:time selection confirm',
        SAME_DAY_TIME_SELECTOR_CLOSE: 'same day delivery:time selection modal close',
        SAME_DAY_TIME_SELECTOR_OPEN: 'same day delivery:time selection modal open',
        BRAND_PAGE: 'brand:page',
        SEARCH_PAGE: 'search:page',
        ACCESS_POINT_LOCATION_DETAILS: 'access points location details',
        ACCESS_POINT_LOCATION_DETAILS_CLICK: 'access points location details:click',
        ACCESS_POINT_MODAL_OPEN_CLICK: 'access points entry:click',
        AUTO_REPLENISH: 'auto replenish:subscription info modal open',
        AUTO_REPLENISH_FREQUENCY_OPEN: 'auto replenish:delivery frequency open',
        AUTO_REPLENISH_FREQUENCY_CLOSE: 'auto replenish:delivery frequency close',
        AUTO_REPLENISH_FREQUENCY_CONFIRMED: 'auto replenish:delivery frequency confirmed',
        MANAGE_SUBSCRIPTION_OPEN: 'auto replenish:manage subscription open',
        MANAGE_SUBSCRIPTION_CLOSE: 'auto replenish:manage subscription close',
        UNSUBSCRIBE_SUBSCRIPTION_OPEN: 'auto replenish:unsubscribe subscription open',
        UNSUBSCRIBE_SUBSCRIPTION_CLOSE: 'auto replenish:unsubscribe subscription close',
        PAUSE_SUBSCRIPTION_OPEN: 'auto replenish:pause subscription open',
        PAUSE_SUBSCRIPTION_CLOSE: 'auto replenish:pause subscription close',
        BOPIS_STORE_SELECTED: 'bopis store selected',
        UPDATE_PAYMENT_OPEN: 'auto replenish:update payment open',
        UPDATE_PAYMENT_CLOSE: 'auto replenish:update payment close',
        ADD_CARD_OPEN: 'auto replenish:add payment open',
        ADD_CARD_CLOSE: 'auto replenish:add payment close',
        EDIT_CARD_OPEN: 'auto replenish:edit payment open',
        EDIT_CARD_CLOSE: 'auto replenish:edit payment close',
        SAVE_CARD_EDIT: 'auto replenish:edit payment saved',
        SAVE_CARD_ADD: 'auto replenish:add payment saved',
        SAVE_CARD_UPDATE: 'auto replenish:update payment saved',
        DELETE_CARD: 'auto replenish:delete payment',
        REMOVE_CARD: 'auto replenish:remove payment',
        AUTO_REPLENISH_LOAD_MORE: 'auto replen:load more',
        SKIP_SUBSCRIPTION_OPEN: 'auto replenish:skip subscription open',
        SKIP_SUBSCRIPTION_CLOSE: 'auto replenish:skip subscription close',
        GET_IT_SOONER_OPEN: 'auto replenish:get it sooner subscription open',
        GET_IT_SOONER_CLOSE: 'auto replenish:get it sooner subscription close',
        RESUME_SUBSCRIPTION_OPEN: 'auto replenish:resume subscription open',
        RESUME_SUBSCRIPTION_CLOSE: 'auto replenish:resume subscription close',
        PHOTO_AND_BIO: 'photo and bio',
        PRIVACY_SETTINGS: 'bp privacy settings',
        COMMUNITY_PROFILE: 'cmnty profile',
        MY_PROFILE: 'my-profile',
        SDU_UPDATE_PAYMENT_OPEN: 'same-day unlimited:update payment open',
        SDU_UPDATE_PAYMENT_CLOSE: 'same-day unlimited:update payment close',
        SDU_ADD_CARD_OPEN: 'same-day unlimited:add payment open',
        SDU_ADD_CARD_CLOSE: 'same-day unlimited:add payment close',
        SDU_EDIT_CARD_OPEN: 'same-day unlimited:edit payment open',
        SDU_EDIT_CARD_CLOSE: 'same-day unlimited:edit payment close',
        SDU_REMOVE_CARD: 'same-day unlimited:remove payment',
        SDU_DELETE_CARD: 'same-day unlimited:delete payment',
        SDU_SAVE_CARD_UPDATE: 'same-day unlimited:update payment saved',
        SDU_SAVE_CARD_EDIT: 'same-day unlimited:edit payment saved',
        SDU_SAVE_CARD_ADD: 'same-day unlimited:add payment saved',
        SDU_CANCEL_SUBSCRIPTION_OPEN: 'same-day unlimited:cancel subscription open',
        SDU_CANCEL_TRIAL_OPEN: 'same-day unlimited:cancel trial open',
        BASKET_SIGN_IN: 'sign-in:text-link',
        EARN_POINTS: 'basket sign in earn points click',
        TEXT_CLICK: 'basket sign in text click',
        BASKET_FREE_SHIPPING: 'basket sign in free shipping click',
        BASKET_SIGN_IN_FREE_SHIPPING: 'sign-in:free-shipping',
        EMPTY_BASKET_SIGN_IN: 'sign-in:empty-basket',
        FREE_RETURNS: 'free returns click',
        GALLERY_ADD_TO_BASKET: 'add to basket',
        LIGHTBOX_NAV_CLICK_GALLERY: 'lightbox navigation click',
        BASKET_SWITCH_BOPIS: 'basket switching:bopis',
        BASKET_SWITCH_SAD: 'basket switching:shipping and delivery',
        CCR_APPLY: 'bi:credit card rewards:apply in basket',
        BI_CASH_APPLY: 'bi:beauty insider cash:apply in basket',
        ITEM_SUBSTITUTION_MODAL_OPEN: 'item substitution- select substitute modal open',
        ITEM_SUBSTITUTION_EDIT_MODAL_OPEN: 'item substitution- edit substitute modal open',
        ITEM_SUBSTITUTION_MODAL_LOAD_AVAILABLE_OPTIONS: 'item substitution- available options modal open',
        ITEM_SUBSTITUTION_MODAL_INFO: 'item substitution- info modal open',
        ITEM_SUBSTITUTION_MODAL_LOAD_AVAILABLE_OPTIONS_OOS: 'item substitution- available options out of stock modal open',
        ITEM_SUBSTITUTION_MODAL_SUBSTITUTE_SELECTED: 'item substitution- substitute selected',
        ITEM_SUBSTITUTION_REMOVAL: 'item substitution removal:',
        ITEM_SUBSTITUTION_MODAL_CLOSE: 'item substitution- select substitute modal close',
        ITEM_SUBSTITUTION_MODAL_AVAILABLE_OPTIONS_CLOSE: 'item substitution- available options modal close',
        CHECKOUT_SHIPPING_METHOD_UPDATE: 'checkout shipping method update'
    };

    const PAGE_NAMES = {
        ACCOUNT_CREATION: 'account creation',
        ANONYMOUS: 'anonymous',
        BASKET: 'basket',
        PREBASKET: 'pre-basket',
        BENEFITS: 'benefits',
        BRANDNTHCATEGORY: 'brand-nthcategory',
        BRANDSLIST: 'brands-list',
        CATEGORYLEVEL: 'categorylevel',
        NTHCATEGORY: 'nthlevel',
        GC_SHIPPING: 'gift card shipping',
        GC_DELIVERY: 'gift card delivery',
        HOMEPAGE: 'home page',
        LISTS_MAIN: 'lists-main',
        MY_ACCOUNT: 'my-account',
        MY_BEAUTY_INSIDER: 'my beauty insider',
        RESERVE_CONFIRMATION: 'reserve-confirmation',
        ORDER_CONFIRMATION: 'order-confirmation',
        ORDER_DETAIL: 'order detail',
        PROFILE: 'my-profile',
        PRODUCT: 'product',
        PRODUCTPAGE: 'product',
        PLACE_ORDER: 'place order',
        ROPIS_BASKET: 'reserve and pickup',
        ROPIS_CHECKOUT: 'reserve and pickup-reservation details',
        USER_PROFILE: 'user-profile',
        FAILED_SEARCH: 'results-null',
        BOOK_CLASS_LANDING: 'book a class-landing',
        BOOK_SERVICE_LANDING: 'book a service-landing',
        BOOK_EVENT_LANDING: 'book a event-landing',
        BOOK_ANNOUNCEMENT_LANDING: 'book a announcement-landing',
        BOOK_SERVICE_CONFIRMATION: 'book a service-confirmation',
        BOOK_SERVICE_DATE_LOCATION: 'book a service-date & location',
        BOOK_CLASS_CONFIRMATION: 'book a class-confirmation',
        RSVP: 'book an event-rsvp',
        RESCHEDULE_CLASS_CONFIRMATION: 'reschedule class-confirmation',
        RESCHEDULE_SERVICE_CONFIRMATION: 'reschedule service-confirmation',
        WAITLISTED_CLASS_CONFIRMATION: 'book a class-waitlisted',
        CREDIT_CARD_APPLICATION_START: 'application-start',
        CREDIT_CARD_APPLICATION_APPROVED: 'application-approved',
        CREDIT_CARD_APPLICATION_PENDING: 'application-pending',
        CREDIT_CARD_APPLICATION_ERROR: 'application-error',
        STORE_LOCATOR: 'store locator',
        STORE_LIST: 'store list',
        SHIPPING_AND_DELIVERY: 'shipping and delivery',
        SHIPPING_ADD_ADDRESS: 'shipping-add address',
        SHIPPING_USE_RECOMMENDED_ADDRESS: 'shipping-use recommended address',
        SIGNED_IN: 'signed in',
        PRODUCT_SEARCH_RESULTS: 'results-products',
        ADV_CAMPAIGNS: 'campaigns',
        ADD_RATINGS_AND_REVIEWS: 'ratings&reviews-write',
        BOPIS_BASKET: 'buy online and pickup',
        BOPIS_CHECKOUT: 'buy online and pickup-reservation details',
        BOPIS_CONFIRMATION: 'bopis-confirmation',
        SAMEDAY_CONFIRMATION: 'sameday-confirmation',
        SHADE_FINDER_RESULTS: 'shade finder-results',
        SHADE_FINDER_MATCH_FOUND: 'shade finder-match found',
        SAME_DAY_DELIVERY: 'same day',
        GLAD_FOOTER_PAGE: 'chat:home chat',
        GLAD_CUSTOMER_PAGE: 'contentstore:customer service',
        FREE_RETURNS: 'free returns-information',
        UGC_MODAL: 'ugc modal',
        // TODO: Correct extra «s» in accesss, which can't be done now because it would imply
        // changes in analytics databases, so for now just adding an extra constant
        // until analytics team fixes it
        ACCESS_POINT_INFO_MODAL: 'accesss points-how it works',
        ACCESS_POINT_INFO_MODAL_CORRECTED: 'access points-how it works',
        ACCESS_POINT_INFO_MODAL_OPEN: 'access points-select fedex location',
        ACCESS_POINT_LOCATION_DETAILS: 'access points-fedex location details',
        ACCESS_POINT_INFO_MODAL_NO_RESULTS: 'access points-no fedex locations available',
        ACCESS_POINT_INFO_MODAL_NO_RESULTS_EXTRA_DATA: 'access points-no locations available',
        ACCESS_POINT_INFO_MODAL_NO_LOCATIONS: 'access points-no locations available',
        ACCESS_POINT_INFO_MODAL_UNAVAILABLE: 'access points-selected location unavailable',
        BEAUTY_PREFERENCES: 'beauty preferences',
        BEAUTY_CHALLENGES: 'beauty challenges',
        MY_SEPHORA: 'mysephora',
        SAME_DAY_UNLIMITED: 'same-day unlimited',
        GALLERY_LIGHTBOX: 'bb-gallery lightbox',
        COMMUNITY_GALLERY: 'bb-home',
        COMMUNITY_USER_GALLERY: 'bb-user gallery',
        COMMUNITY_MY_GALLERY: 'bb-my gallery',
        COMMUNITY_PRODUCT_MODAL: 'bb-gallery product mini modal',
        CHALLENGE_HUB: 'challenge-hub',
        CHALLENGE_DETAIL: 'challenge-detail',
        TASK_DETAIL: 'task-detail',
        CHALLENGE_JOIN_CONFIRMATION: 'challenge-join-confirmation',
        FAQ: 'faq',
        TERMS_AND_CONDITIONS: 'terms&conditions',
        GIFT_MESSAGE: 'gift message',
        GIFT_CARD_PAYMENT: 'gift card payment-add credit card',
        REMOVE_GIFT_MESSAGE_MODAL: 'modal:remove gift message:n/a:*',
        FAILED_REMOVING_GIFT_MESSAGE_MODAL: 'modal:failed to remove gift message:n/a:*',
        CREDIT_CARD: 'credit card',
        CREDIT_CARD_SECTION_JOIN: 'credit card section join',
        BEAUTY_INSIDER: 'beauty insider',
        BI_SIGNED_IN: 'my beauty insider-signed in',
        BI_ANONYMOUS: 'my beauty insider-anonymous',
        BAZAAR_BASKET: 'basket:rewards bazaar:n/a:*',
        REWARD_BAZAAR: 'reward bazaar',
        REWARDS_BAZAAR: 'rewards bazaar',
        PURCHASE_HISTORY: 'purchase history',
        ORDERS: 'orders',
        AUTO_REPLENISH: 'auto-replenish',
        LOVES: 'loves',
        ACCOUNT_SETTINGS: 'account settings',
        SAME_DAY_UNLIMITED_TRACK: 'same-day-unlimited',
        BEAUTY_ADVISOR_RECOMMENDATIONS: 'beauty advisor recommendations',
        ITEM_SUBSTITUTION_MODAL: 'item-substitution:select-substitute:n/a:*',
        ITEM_SUBSTITUTION_MODAL_AVAILABLE_OPTIONS: 'item-substitution:available-options:n/a:*',
        TARGETED_LANDING_PROMOTION: 'beauty offers-your promo',
        ITEM_SUBSTITUTION_MODAL_AVAILABLE_OPTIONS_OOS: 'item-substitution:available-options-oos:n/a:*',
        MY_RESERVATIONS: 'my reservations',
        CURATED_SEASONAL_LANDING: 'curated seasonal landing',
        REWARD_FULFILLMENT_METHOD_MODAL: 'modal:rewards bazaar choose method:n/a:*',
        LOVE_LIST: 'love list',
        BUY_IT_AGAIN: 'buy it again',
        CATEGORY: 'category',
        SEARCH: 'search',
        RESTOCK_PAST_PURCHASES: 'restock past purchases',
        LOVES_FLYOUT: 'loves flyout',
        COMMUNITY: 'community',
        TRUST_MARK_MODAL: 'modal:trustmark modal open:n/a',
        MY_LISTS: 'my lists',
        CSF: 'creator store front',
        SHOP_YOUR_STORE: 'shop your store',
        SHOP_SAME_DAY: 'shop same-day delivery',
        GIFT_CARD: 'gift card landing',
        ADD_CREDIT_CARD: 'payment-add credit card'
    };

    const PAGE_TYPES = {
        HOMEPAGE: 'home page',
        BASKET: 'basket',
        CHECKOUT: 'checkout',
        USER_PROFILE: 'user profile',
        MY_ACCOUNT_2: 'my account',
        BI_LOOKUP: 'bi lookup',
        COMMUNITY: 'cmnty',
        QUICK_LOOK: 'quicklook',
        ADD_TO_BASKET_MODAL: 'add to basket modal',
        ADD_ALL_TO_BASKET: 'add all to basket',
        ADD_TO_BASKET_FOR_PICKUP_MODAL: 'add to basket for pickup modal',
        LOVES_MODAL: 'loves modal',
        MY_LISTS_FLYOUT: 'my lists flyout',
        COMMUNITY_PROFILE: 'cmnty profile',
        PRODUCT_FINDER: 'productfinder',
        PRODUCT: 'product',
        PRODUCTPAGE: 'product',
        REWARDS: 'rewards',
        SEARCH_TOP: 'top',
        SEARCH_NTH: 'nth',
        SEARCH_CATEGORY: 'category',
        NTHCATEGORY: 'nthlevel',
        TOPCATEGORY: 'toplevel',
        ROOTCATEGORY: 'category',
        RWD_TOPCATEGORY: 'toplevel',
        RWD_CATEGORY: 'category',
        RWD_NTHCATEGORY: 'nthlevel',
        BRAND: 'brand',
        BRANDCAT: 'brand-category',
        BRANDTOP: 'brand-toplevel',
        BRANDNTH: 'brand-nthlevel',
        SEARCH: 'search',
        OLR: 'happening at sephora',
        CONTENT_STORE: 'contentstore',
        CREDIT_CARD: 'creditcard',
        PLAY_QUIZ: 'play! by sephora',
        SIGN_IN: 'sign in',
        REGISTER: 'register',
        EMAIL_VERIFICATION: 'email verification register',
        CHECK_EMAIL: 'check your email',
        ERROR_PAGE: 'error page',
        VIEW_SIMILAR: 'view similar',
        REWARDS_BAZAAR_MODAL: 'modal',
        ADV_REFERRER: 'advocacy referrer',
        BOPIS: 'buy online and pickup',
        ROPIS: 'reserve and pickup',
        PRODUCT_REVIEW: 'reviews',
        VIEW_MORE_CLEAN_BEAUTY: 'view more clean beauty',
        SAME_DAY_LOCATION_SELECTOR: 'same day-select delivery location',
        FREQUENTLY_BOUGHT_TOGETHER: 'frequently bought together',
        COMPARE_SIMILAR_PRODUCTS: 'compare similar products',
        RETURNS: 'returns',
        SHIPPING: 'shipping',
        PAYMENT: 'payment',
        DELIVERY: 'delivery',
        UGC_MODAL: 'modal',
        SAME_DAY_TIME_SELECTOR: 'same day-select delivery time',
        GENERIC_MODAL: 'modal',
        SEOP: 'seop',
        AUTO_REPLENISH: 'auto replenish',
        AUTO_REPLENISHMENT: 'autoreplenishment',
        SAME_DAY_UNLIMITED: 'same-day unlimited',
        ENTER_ZIP_CODE: 'enter zip code',
        TRIAL_OFFER: 'trial offer',
        TRIAL_ALREADY_ADDED: 'trial already added',
        SUBSCRIPTION_OFFER: 'subscription offer',
        SUBSCRIPTION_ALREADY_ADDED: 'subscription already added',
        TRIAL_ADDED_TO_BASKET_CONFIRMATION: 'trial added to basket confirmation',
        SUBSCRIPTION_ADDED_TO_BASKET_CONFIRMATION: 'subscription added to basket confirmation',
        REPLACEMENT_ORDER: 'replacement-order',
        REPLACEMENT_ORDER_SOT: 'replacement order',
        ORDER_DETAIL_REPORT_ISSUE: 'report-issue',
        HIGHLIGHTED_REVIEWS: 'highlighted-reviews',
        GAMIFICATION: 'gamification',
        GALLERY: 'gallery',
        CONTENTFUL_MODAL: 'contentful-modal',
        FILTERS_MODAL: 'filters',
        SHOP_NAV: 'shop',
        CREATOR_STORE_FRONT: 'creatorstorefront',
        COLLECTION_DETAIL: 'collection detail',
        POST_DETAIL: 'post detail',
        TEXT_MODAL: 'sephora text modal',
        ITEM_SUBSTITUTION_MODAL: 'item-substitution-modal',
        BOPIS_CHECKOUT: 'bopis'
    };

    const PRODUCT_TAGGING_PLATFORMS = {
        CHAT: 'chat',
        GALLERY: 'gallery',
        REVIEWS: 'reviews'
    };

    const COMPONENT_TITLE = {
        PRODUCTS_GRID: 'products grid',
        SKUGRID: 'skugrid',
        SEPHORA_CAROUSEL: 'sephora carousel',
        PURCHASE_LISTS: 'purchase lists',
        ALT_IMAGE_CAROUSEL: 'alt-image',
        READY_TO_CHECKOUT: 'ready to checkout',
        CHOSEN_FOR_YOU: 'Chosen For You',
        SELLING_FAST: 'Selling Fast',
        NEW_ARRIVALS: 'New Arrivals',
        VALUE_SETS: 'Value Sets'
    };

    const CARD_NAMES = {
        UGC_IMAGE: 'ugc-image-card'
    };

    const CAROUSEL_NAMES = {
        LOVES: 'loves',
        PURCHASES: 'purchases',
        SERVICES: 'services',
        USER_PROFILE: 'user profile',
        CC_LOVES: 'shop your favorites',
        REPLEN: 'restock past purchases',
        RECENTLY_VIEWED: 'recently viewed',
        REWARDS: 'rewards',
        FREQUENTLY_BOUGHT_TOGETHER: 'frequently bought together',
        REWARD_BAZAAR: 'reward bazaar',
        UGC_PRODUCT: 'ugc-product-carousel',
        SEE_IT_REAL: 'see-it-real-carousel',
        ROUGE_REWARDS_CAROUSEL: 'rouge-only-rewards',
        CSF_FEATURED_CAROUSEL: 'featured carousel:'
    };

    const PAGE_DETAIL = {
        SERVICE_HOME: 'home',
        SHIPPING_UNVERIFIED: 'shipping-double check your address',
        SHIPPING_RECOMMENDED: 'shipping-use recommended address',
        SIGN_IN_AND_REGISTER: 'sign in and register',
        SIGN_IN: 'sign in',
        RESET_PASSWORD: 'reset password',
        REWARDS_BAZAAR: 'rewards bazaar',
        SAMPLES: 'select samples',
        CREDIT_CARD_REWARDS: 'creditcard rewards',
        APPLY_POINTS: 'apply points',
        AFTERPAY_PAYMENT: 'afterpay',
        KLARNA_PAYMENT: 'klarna',
        FLEXIBLE_PAYMENTS: 'flexible-payments',
        RESERVATION_DETAILS: 'reservation-details',
        SHIPPING_INFORMATION: 'customer service help-shipping information',
        BCC_INFORMATION_MODAL: 'bcc information-modal',
        STORE_SELECTION: 'store selection',
        ADD_REVIEW_SELECT_SKU: 'ratings&reviews-select sku',
        ADD_REVIEW_WRITE: 'ratings&reviews-write',
        ADD_REVIEW_ABOUT: 'ratings&reviews-about you',
        ADD_REVIEW_SUBMIT: 'ratings&reviews-submit',
        SHADE_FINDER: 'shade finder',
        BEAUTY_PREFERENCES: 'BeautyPreferences',
        SHADE_FINDER_LANDING: 'shade finder-landing page',
        ESTIMATED_SHIPPING_INFORMATION: 'estimated shipping information',
        SUBSCRIPTION_INFO: 'subscription info modal',
        DELIVERY_FREQUENCY: 'delivery frequency',
        MANAGE_SUBSCRIPTION: 'manage subscription',
        UNSUBSCRIBE_SUBSCRIPTION: 'unsubscribe subscription',
        UNSUBSCRIBE_CONFIRMATION: 'unsubscribe subscription confirmation',
        PAUSE_SUBSCRIPTION: 'pause subscription',
        PAUSE_CONFIRMATION: 'pause subscription confirmation',
        UPDATE_PAYMENT: 'update payment',
        ADD_CARD: 'add payment',
        EDIT_CARD: 'edit payment',
        SKIP_SUBSCRIPTION: 'skip subscription',
        SKIP_SUBSCRIPTION_CONFIRM: 'skip subscription confirmation',
        SKIP_SUBSCRIPTION_UNAVAILABLE: 'skip subscription unavailable',
        GET_IT_SOONER: 'get it sooner subscription',
        GET_IT_SOONER_CONFIRMATION: 'get it sooner subscription confirmation',
        GET_IT_SOONER_UNAVAILABLE: 'get it sooner subscription unavailable',
        RESUME_SUBSCRIPTION: 'resume subscription',
        RESUME_SUBSCRIPTION_CONFIRM: 'resume subscription confirmation',
        SEPHORA_CC_INFO: 'sephora cc info modal',
        SAME_DAY_UNLIMITED_FAQ_PAGE: 'customer service help-same-day delivery unlimited faqs',
        SAME_DAY_UNLIMITED_FAQ_MODAL: 'same-day delivery unlimited faq modal',
        CANCEL_SUBSCRIPTION: 'cancel subscription',
        CANCEL_TRIAL: 'cancel trial',
        ZIP_CODE_UNAVAILABLE: 'zip code unavailable',
        CANCEL_SUBSCRIPTION_CONFIRMATION: 'cancel subscription confirmation',
        CANCEL_TRIAL_CONFIRMATION: 'cancel trial confirmation',
        REPORT_ISSUE_MODAL: 'select reason',
        NCR_ELEGIBLE: 'ncr eligible',
        NCR_NOT_ELEGIBLE: 'ncr not eligible',
        FAVORITE_BRAND_SPOKE: 'favorite brand spoke',
        EVENTS: 'events',
        CREDIT_CARD: 'creditcard',
        BEAUTY_OFFERS: 'beauty-offers',
        PRESCREEN_BANNER: 'bcc prescreen-banner',
        SHOP_NAV: 'browse',
        UNSUBSCRIBE_DISCLAIMER: 'unsubscribe disclaimer',
        UNSUBSCRIBE: 'unsubscribe',
        SUBSCRIBE: 'subscribe',
        SUBSCRIBE_TEXT_IS_ON_THE_WAY: 'subscribe-text is on the way',
        REMOVE: 'remove',
        TEXT_PROMO_DISCLAIMER: 'text promo disclaimer',
        REGISTRATION_PROMO_DISCLAIMER: 'registration promo disclaimer',
        MY_LISTS: 'my lists',
        MY_LIST: 'my list',
        GLAD_PAGE: 'customer service chat',
        ALTERNATE_PICKUP: 'alternate-pickup',
        CHOOSE_OPTIONS: 'choose options'
    };

    const ACTION_INFO = {
        ADDRESS_VERIFICATION: 'address verification:use {0} address',
        ORDER_CANCELLATION: 'order cancellation',
        ADD_TO_BASKET: 'add to basket',
        ADD_TO_THE_BASKET: 'Add to Basket',
        REMOVE_FROM_BASKET: 'remove from basket',
        SEE_DETAILS: 'see details',
        GALLERY_VIDEO_POPUP: 'gallery:video popup',
        ADD_GIFT_MESSAGE: 'add a gift message',
        EDIT_GIFT_MESSAGE: 'edit a gift message',
        REMOVE_GIFT_MESSAGE: 'remove gift message',
        SEPHORA_KOHLS_EXIT_LINK: 'S@K exit link',
        CREDIT_CARD_SUBMIT_APPLICATION: 'creditcard:submit application',
        CREDIT_CARD_CONTINUE_SHOPPING: 'creditcard:continue shopping',
        CREDIT_CARD_CHECKOUT_NOW: 'creditcard:checkout now',
        BI_REFER_AND_EARN_COPY: 'bi:refer & earn:copy',
        APPLY_PROMO_POINTS_MULTIPLIER: 'Enter Promo Code',
        APPLY_PROMO_POINTS_MULTIPLIER_FROM: 'Enter Promo Code from',
        REMOVE_PROMO_POINTS_MULTIPLIER: 'Remove Promo Code',
        REMOVE_PROMO_POINTS_MULTIPLIER_FROM: 'Remove Promo Code from',
        VIEW_PROMO_CODES: 'view promo codes',
        VIEW_PROMO_CODE_MODAL: 'view promo code modal:n/a:*',
        SELECT_SAMPLES: 'select samples:n/a:*',
        APPLY_PROMO_FROM_CHECKOUT: 'Enter Promo Code from Checkout',
        PLACE_ORDER_BTN_CLICK: 'place order button:click',
        CHECKOUT_PLACE_ORDER: 'checkout:place order',
        PHONE_UPDATE: 'user profile:my account:phone:update',
        PHONE_REMOVE: 'user profile:my account:phone:remove',
        PHONE_ADD: 'user profile:my account:phone:add',
        PHONE_EDIT: 'user profile:my account:phone:edit',
        PHONE_CANCEL: 'user profile:my account:phone:cancel'
    };

    const SDU_STATUS = {
        SUBSCRIBED: 'subscribed',
        UNSUBSCRIBED: 'unsubscribed',
        UNSUBSCRIBED_NOT_ELIGIBLE: 'unsubscribed-not eligible'
    };

    const SDU_SUBSCRIPTION_TYPE = {
        SUBSCRIBED: 'subscribed',
        UNSUBSCRIBED: 'trial eligible',
        UNSUBSCRIBED_NOT_ELIGIBLE: 'not trial eligible'
    };

    const CC_APPROVAL_STATUS = {
        CARD_HOLDER: 'card holder',
        DECLINED: 'declined',
        PRE_APPROVED: 'pre-approved',
        INSTANT_CREDIT: 'instant-credit',
        IN_PROGRESS_APP: 'in-progress-app',
        OTHER: 'other'
    };

    const DELIVERY_OPTIONS_MAP = {
        Standard: 'standard',
        Sameday: 'same day delivery',
        Pickup: 'buy online and pick up',
        AutoReplenish: 'auto replenish'
    };

    const FULFILLMENT_TYPE = {
        Standard: 'standard',
        Sameday: 'sameday',
        Pickup: 'pickup',
        AutoReplenish: 'auto-replenish'
    };

    const MEDALLIA = {
        FEEDBACK: { LET_US_KNOW: 'medallia:feedback:let us know' },
        FORM: {
            DISPLAYED: 'medallia:form displayed',
            SUBMITTED: 'medallia:form submitted',
            DISMISSED: 'medallia:form dismissed'
        }
    };

    const ALT_PICKUP = {
        PAGE_NAME: 'bopis:alternate-pickup:n/a:*',
        ADD: 'alternate pickup person:request',
        EDIT: 'alternate pickup person:edit',
        REMOVE: 'alternate pickup person:removed',
        SAVE: 'alternate pickup person:submit'
    };

    const UGC_DYNAMIC_WIDGET = {
        IMAGE_CLICKED: 'ugc:image component click',
        SCROLL_MORE: 'ugc:scroll more navigation',
        SWIPE: 'ugc:product-swipe',
        SEE_DETAILS: 'ugc:see details',
        PAGE_NAME: 'modal:ugc modal:n/a:*'
    };

    const PRODUCT_AUTO_REPLENISH_ELIGIBLE = {
        AVAILABLE: 1,
        NOT_ALL_SKUS_AVAILABLE: 2,
        NOT_AVAILABLE: 3
    };

    const REPLACEMENT_ORDER = {
        PAGE_NAME: `${PAGE_TYPES.REPLACEMENT_ORDER}:submit for review:n/a:*`,
        SUBMIT_EVENT: `${PAGE_TYPES.REPLACEMENT_ORDER}:submit for review click`,
        SUBMIT_EVENT_SOT: `${PAGE_TYPES.REPLACEMENT_ORDER_SOT} submit for review click`,
        SUBMIT_PAGE_ENTER: 'submit for review',
        SELECT_SAMPLES: 'select samples',
        SELECT_SAMPLES_ENTER: `${PAGE_TYPES.REPLACEMENT_ORDER}:${ACTION_INFO.SELECT_SAMPLES}`,
        SPINNER_PAGE_ENTER: `${PAGE_TYPES.REPLACEMENT_ORDER}:fraud check processing:n/a:*`,
        SPINNER_PAGE: 'fraud check processing',
        FAILURE_PAGE_ENTER: 'request declined',
        SUCCESS_PAGE_ENTER: 'confirmation',
        EVENT_NAME: 'event260'
    };

    const SMS_SIGNUP = {
        PAGE_NAME: 'modal:sms-get order updates:n/a:*',
        CONFIRMATION_PAGE_NAME: 'modal:sms-confirmation:n/a:*'
    };

    const NO_PAGE_LOAD_PAGE_TYPES = [
        PageTemplateType.OrderDetails,
        PageTemplateType.ShopMyStore,
        PageTemplateType.ShopSameDay,
        PageTemplateType.MyCustomList
    ];

    const FAVORITE_BRAND_ADDED = {
        FILLED: 'favorite brand added:filled',
        EMPTY: 'favorite brand added:empty'
    };

    const ADD_GIFT_MESSAGE_MODAL_SCREENS = {
        0: 'choose design',
        1: 'write message',
        2: 'preview'
    };

    const GIFT_MESSAGE_ACTIONS = {
        GIFT_MESSAGE_ADDED: 'gift message added successfully',
        GIFT_MESSAGE_UPDATED: 'gift message updated successfully',
        GIFT_MESSAGE_REMOVED: 'gift message removed successfully',
        GENERIC_ERROR_MESSAGE: 'Something went wrong, please try again',
        GIFT_MESSAGE_IMAGE_SELECT: 'gift message image select',
        GIFT_MESSAGE_SUBMIT_SUCCESS: 'checkout gift message submit success'
    };

    const ADDITIONAL_PAGE_INFO = {
        CARD_HOLDER: 'card holder'
    };

    const NOT_AVAILABLE = 'n/a';

    const GUIDED_SELLING = {
        MY_SEPHORA: 'mysephora',
        GUIDED_SELLING_SPOKE: 'guided selling spoke'
    };

    const AFFILIATE_PARAMETERS = {
        AFFILIATE_COOKIE_LIFETIME: 730, // Rakuten recommends 730 days.
        AFFILIATE_PARAMETERS_STORAGE: 'affiliateGatewayParameters',
        AFFILIATE_LINKSHARETIME_COOKIE: 'linkShareTime',
        AFFILIATE_SITEID_COOKIE: 'siteId',
        AFFILIATE_SOURCE_NA: 'na',
        AFFILIATE_SOURCE_COOKIE: 'cookie',
        AFFILIATE_SOURCE_STORAGE: 'storage',
        AFFILIATE_LINKSHARETIME_STORAGE: 'linkshareTime',
        AFFILIATE_SITEID_STORAGE: 'linkshareSiteId',
        AFFILIATE_RAKUTEN_ATTRSOURCE_STORAGE: 'rakutenAttrSource',
        AFFILIATE_RAKUTEN_ORDERBYSOT_STORAGE: 'rakutenOrderNeedsToBeStoredBySot',
        AFFILIATE_RAKUTEN_ORDERNUMBER_STORAGE: 'rakutenOrderNumber'
    };

    const USER_INPUT = {
        ENTER_PROMO: 'enter promo:',
        REMOVE_PROMO: 'remove promo:'
    };

    const FIELD_ERRORS = {
        CHECKOUT_PLACE_ORDER: 'checkout-place order',
        PHONE_UPDATE: 'user profile:my account:phone'
    };

    const NAV_PATH = {
        TOP_NAV: 'top nav',
        ACCOUNT: 'account',
        MY_LISTS: 'my lists',
        LOVES_ICON: 'loves icon'
    };

    const SUPER_CHAT = {
        SUPERCHAT: 'superchat:',
        SUPERCHAT_MENU: 'superchat:menu:n/a:*',
        SUPERCHAT_BASKET: 'Add To Basket:superchat',
        SUPERCHAT_LANDING: 'superchat:landing:n/a:*',
        SUPERCHAT_PROMPT: 'superchat:prompt window:',
        SUPERCHAT_FEEDBACK: 'superchat:open feedback:question',
        SUPERCHAT_FEEDBACK_SUBMITTED: 'superchat:feedback submitted',
        SUPERCHAT_EXIT: 'superchat:swipe exit'
    };

    return {
        ACTION_INFO,
        ADD_TO_BASKET_MODAL,
        ADD_TO_CART,
        ADD_TO_LOVES_LIST,
        PRODUCT_STRING_TEMPLATE,
        ALT_PICKUP,
        ASYNC_PAGE_LOAD,
        CAMPAIGN_STRINGS,
        CARD_NAMES,
        CAROUSEL_NAMES,
        CATEGORY_PAGE_LOAD,
        CC_APPROVAL_STATUS,
        CMS_URL_PARAMS,
        COMPONENT_TITLE,
        CONTEXT,
        CUSTOMIZABLE_SETS_VARIANTS,
        DELIVERY_OPTIONS_MAP,
        FULFILLMENT_TYPE,
        DOUBLE_CLICK_CATEGORY_PAGE,
        DOUBLE_CLICK_FOOTER,
        DOUBLE_CLICK_PRODUCT_PAGE,
        Event,
        EVENT_NAMES,
        GET_MOST_RECENT_EVENT,
        LinkData,
        LINK_TRACKING_EVENT,
        SOT_LINK_TRACKING_EVENT,
        SOT_CSF_TRACKING_EVENT,
        SOT_P13N_TRACKING_EVENT,
        PROMO_LINK_TRACKING_EVENT,
        MEDALLIA,
        MEDIA_TYPE,
        NOT_AVAILABLE,
        PAGE_DETAIL,
        PAGE_LOAD,
        PAGE_NAMES,
        PAGE_TYPES,
        PAGE_VARIANTS,
        PINTEREST_PRODUCT_PAGE_VIEW_EVENT,
        PINTEREST_QUICK_LOAD_EVENT,
        PRODUCT_AUTO_REPLENISH_ELIGIBLE,
        PRODUCT_PAGE_LOAD,
        PRODUCT_TAGGING_PLATFORMS,
        QUICK_LOOK_LOAD,
        HIGHLIGHTED_REVIEWS_MODAL,
        REFERRER_DOMAINS,
        REGISTER_MODAL_LOAD,
        REPLACEMENT_ORDER,
        RMN_PAGE_NAMES,
        RMN_UFE_EVENT,
        SDU_STATUS,
        SIGN_IN_MODAL_LOAD,
        SIGN_IN_PAGE_TYPE_DETAIL,
        SIGN_IN_PAGE_TYPE_GUEST_CHECKOUT_DETAIL,
        SIGN_IN_SUCCESS,
        SNAPCHAT_PRODUCT_PAGE_VIEW_EVENT,
        SNAPCHAT_QUICK_LOAD_EVENT,
        UGC_DYNAMIC_WIDGET,
        NO_PAGE_LOAD_PAGE_TYPES,
        SMS_SIGNUP,
        SMS,
        SMS_PAGENAME_PAGETYPE,
        SDU_SUBSCRIPTION_TYPE,
        FAVORITE_BRAND_ADDED,
        ADD_GIFT_MESSAGE_MODAL_SCREENS,
        GIFT_MESSAGE_ACTIONS,
        ADD_SHIPPINGINFO_EVENT,
        ADD_PAYMENTINFO_EVENT,
        ADDITIONAL_PAGE_INFO,
        CMS_COMPONENT_EVENTS,
        EVENTS_TYPES_NAME,
        SELECT_ITEM_EVENT,
        SHARE_EVENT,
        CMS_REFERER_LOCAL_STORAGE_KEY,
        VIEW_LIST_EVENT,
        SELECT_CONTENT_EVENT,
        GUIDED_SELLING,
        CHECKOUT_PAYMENT_VENMO,
        AFFILIATE_PARAMETERS,
        USER_INPUT,
        FIELD_ERRORS,
        NAV_PATH,
        LOGOUT_EVENT,
        SUPER_CHAT
    };
}());
