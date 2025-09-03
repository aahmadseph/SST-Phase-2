const BANNER_TYPES = {
    DEFAULT: 'Banner',
    PERSISTENT: 'PersistentBanner',
    NOTIFICATION: 'NotificationBanner',
    PDP: 'PDPBanner',
    HERO: 'HeroBanner',
    PDP_SAMPLE: 'PDPSampleBanner'
};

const CONTEXTS = {
    BANNER_LIST: 'BannerList',
    CONTAINER: 'Container',
    GRID: 'Grid',
    MODAL: 'Modal',
    PERSISTENT_BANNER: 'PersistentBanner'
};

const PAGE_TYPES = {
    BRAND: 'PageBrand',
    CATEGORY: 'PageCategory',
    CONTENT: 'PageContent',
    SEARCH: 'PageSearch',
    HAPPENING: 'PageHappening',
    CREDITCARD: 'PageCreditCard',
    TLP: 'TargetedLandingPage',
    HOME: 'LandingPage',
    REWARDS_BAZAAR: 'PageRewardsBazaar',
    BEAUTY_INSIDER_PROFILE: 'PageBeautyInsiderProfile'
};

const PAGE_TYPE_PATHS = {
    [PAGE_TYPES.BRAND]: '/brand/',
    [PAGE_TYPES.CATEGORY]: '/shop/',
    [PAGE_TYPES.CONTENT]: '/beauty/',
    [PAGE_TYPES.SEARCH]: '/search?keyword=',
    [PAGE_TYPES.HAPPENING]: '/happening/',
    [PAGE_TYPES.CREDITCARD]: '/creditcard/',
    [PAGE_TYPES.TLP]: '/beauty-win-promo?promocode=',
    [PAGE_TYPES.HOME]: '',
    [PAGE_TYPES.REWARDS_BAZAAR]: '/rewards',
    [PAGE_TYPES.BEAUTY_INSIDER_PROFILE]: '/beautyinsider'
};

const ACTION_TYPES = {
    EXTERNAL: 'ActionLinkExternal',
    INTERNAL: 'ActionLinkInternal',
    MODAL: 'Modal',
    ACTION: 'Action',
    ACTION_CUSTOM: 'ActionCustom',
    ANCHOR: 'Anchor'
};

const CUSTOM_ACTION_TYPES = {
    SIGN_IN: 'SignIn',
    PDP_SAMPLE: 'PDPSample'
};

const RENDERING_TYPE = {
    GAME_DETAILS: 'gameDetails',
    RMN_BANNER: 'RMNBanner',
    RMN_CAROUSEL: 'RMNCarousel',
    HAPPENING_EVENTS_GRID: 'HappeningEventsGrid',
    HAPPENING_STORE_DETAILS: 'Happening_StoreDetails',
    CS_CHAT_WITH_US: 'CS_chatWithUs',
    CS_CALL_US: 'CS_callUs',
    CS_EMAIL_US: 'CS_emailUs',
    CS_ORDER_STATUS: 'CS_orderStatus',
    MULTI_PRODUCT_SHADE_FINDER_RESULTS: 'MultiProductShadeFinder_Results',
    BUG_BOUNTY: 'BugBounty_iFrame',
    GIFT_CARD_BALANCE_CHECK: 'GiftCard_CheckBalance',
    HAPPENING_SHOP_MY_STORE: 'Happening_ShopYourStore',
    HAPPENING_SHOP_SAME_DAY: 'Happening_ShopSameDay',
    HAPPENING_SERVICE_EDP_INFO: 'Happening_ServiceExperienceDetails',
    HAPPENING_SERVICE_EDP_POLICIES: 'Happening_ReservationPolicies',
    HAPPENING_EVENT_EDP_INFO: 'Happening_EventExperienceDetails',
    HAPPENING_RSVP_CONFIRMATION_DETAILS: 'Happening_RSVPConfirmationDetails',
    HAPPENING_EVENT_RESERVATION_DETAILS: 'happening_EventReservationDetails',
    HAPPENING_SERVICES_CONFIRMATION_DETAILS: 'Happening_BookingConfirmationDetails',
    HAPPENING_SERVICE_RESERVATION_DETAILS: 'happening_ServiceReservationDetails',
    HAPPENING_WAITLIST_CONFIRMATION_DETAILS: 'Happening_WaitListConfirmationDetails',
    HAPPENING_WAITLIST_RESERVATION_DETAILS: 'Happening_WaitListReservationDetails',
    FREE_SAMPLES: 'FreeSamples'
};

const SECTION_COMPONENTS_TYPE = {
    CARD: 'CardRendering',
    COPY: 'Copy',
    BANNER: 'Banner'
};

const SECTION_LAYOUT_TYPE = {
    GRID: 'grid',
    CAROUSEL: 'carousel'
};

const COMPONENT_TYPES = {
    ANCHOR: 'Anchor',
    BANNER: 'Banner',
    BANNER_LIST: 'BannerList',
    BLOCK_ENTRY_STYLE: 'BlockEntryStyle',
    COPY: 'Copy',
    DIVIDER: 'Divider',
    INLINE_ENTRY_STYLE: 'InlineEntryStyle',
    DYNAMIC_DATA_ATTRIBUTE: 'DynDataAttr',
    LINK: 'Link',
    PRODUCT_LIST: 'ProductList',
    PROMOTION_LIST: 'PromotionList',
    RECAP: 'Recap',
    REWARD_LIST: 'RewardList',
    SECTION_HEADING: 'SectionHeading',
    SOFT_LINKS: 'SoftLinks',
    SMS_OPTIN: 'SmsOptIn',
    SECTION: 'SectionRendering',
    CUSTOM_RENDERING: 'CustomRendering',
    UGC_WIDGET: 'UgcWidget',
    LOVES_LIST: 'LovesList'
};

const RECAP_CAROUSEL = {
    ITEM_URLS: {
        BASKET: '/basket',
        LOVES: '/shopping-list',
        PURCHASE_HISTORY: '/purchase-history',
        RECENTLY_VIEWED: '/recently-viewed',
        BEAUTY_RECOMMENDATIONS: '/in-store-services'
    }
};

const PRODUCT_LIST_GROUPING = {
    SHOW_ADD_BUTTON: 'Show Add Button',
    SHOW_PRICE: 'Show Price',
    SHOW_MARKETING_FLAGS: 'Show Marketing Flags',
    SHOW_RANKING_NUMBERS: 'Show Ranking Numbers',
    SHOW_LOVES_BUTTON: 'Show Loves Button',
    SHOW_RATING_WITH_TOTAL_COUNT: 'Show Rating with total count'
};

const COMPONENT_SPACING = {
    XS: [2, 4],
    SM: [4, 5],
    MD: [5, 6],
    LG: [6, 7]
};

const DIVIDER_SIZE = {
    SM: 'small',
    LG: 'large'
};

const PRODUCT_LIST_VARIANTS = {
    SMALL_CAROUSEL: 'Small Carousel',
    HORIZONTAL_CAROUSEL: 'Horizontal Carousel',
    LARGE_CAROUSEL: 'Large Carousel',
    SMALL_GRID: 'Small Grid',
    LARGE_GRID: 'Large Grid'
};

const PRODUCT_LIST_LAYOUT_VARIANTS = {
    'Small Carousel': 'CarouselLayout',
    'Horizontal Carousel': 'CarouselLayout',
    'Large Carousel': 'CarouselLayout',
    'Small Grid': 'GridLayout',
    'Large Grid': 'GridLayout',
    'Rouge Exclusive Rewards Carousel': 'RougeExclusiveRewardsCarouselLayout'
};
const PRODUCT_LIST_CARD_SIZE_VARIANTS = {
    'Small Carousel': 'small',
    'Horizontal Carousel': 'horizontal',
    'Large Carousel': 'large',
    'Small Grid': 'small',
    'Large Grid': 'large',
    'Rouge Exclusive Rewards Carousel': 'small'
};

const COMPONENT_HANDLER_TYPES = {
    PROMOTION_LIST: {
        FOR_YOU: 'PromotionList_Personalized_For_You',
        FEATURED_OFFERS: 'PromotionList_Personalized_Featured_Offers'
    },
    RECAP: {
        // TODO: Update handler name once the Recap component supports features
        RECAP_SYS: 'RecapSYS'
    }
};

const FILTERS_SIDEBAR_WIDTH = {
    DEFAULT: 208,
    STICKY: 236
};

export default {
    BANNER_TYPES,
    CONTEXTS,
    PAGE_TYPES,
    PAGE_TYPE_PATHS,
    ACTION_TYPES,
    CUSTOM_ACTION_TYPES,
    COMPONENT_TYPES,
    RECAP_CAROUSEL,
    PRODUCT_LIST_GROUPING,
    COMPONENT_SPACING,
    DIVIDER_SIZE,
    RENDERING_TYPE,
    SECTION_COMPONENTS_TYPE,
    SECTION_LAYOUT_TYPE,
    PRODUCT_LIST_VARIANTS,
    PRODUCT_LIST_LAYOUT_VARIANTS,
    PRODUCT_LIST_CARD_SIZE_VARIANTS,
    COMPONENT_HANDLER_TYPES,
    FILTERS_SIDEBAR_WIDTH
};
