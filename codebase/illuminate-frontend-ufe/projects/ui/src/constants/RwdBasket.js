// Types
const BASKET_TYPES = {
    PREBASKET: 'prebasket',
    DC_BASKET: 'distribution center basket',
    ROPIS_BASKET: 'reserve and pick up basket',
    BOPIS_BASKET: 'buy online and pick up basket',
    SAMEDAY_BASKET: 'SameDay',
    STANDARD_BASKET: 'ShipToHome'
};

const ROOT_BASKET_TYPES = {
    PRE_BASKET: 'PRE_BASKET',
    MAIN_BASKET: 'MAIN_BASKET'
};

const MAIN_BASKET_TYPES = {
    DC_BASKET: 'distribution center basket',
    BOPIS_BASKET: 'buy online and pick up basket'
};

const BOPIS_TYPES = {
    ROPIS_BASKET: 'reserve and pick up basket',
    BOPIS_BASKET: 'buy online and pick up basket'
};

const DC_BASKET_TYPES = {
    SAMEDAY_BASKET: 'SameDay',
    STANDARD_BASKET: 'ShipToHome',
    AUTOREPLENISH_BASKET: 'Autoreplenish'
};

const SECONDARY_COLUMN_TYPES = {
    PAYMENT_INFO: 'PAYMENT_INFO',
    BI_BENEFITS: 'BI_BENEFITS'
};

const CART_BANNER_SECTION_TYPES = {
    SDU_ROUGE_INSENTIVE_BANNER: 'SDU ROUGE insentive banner',
    ADD_GIFT_MESSAGE_BANNER: 'gift message modal CTA'
};

const PAYMENT_TYPES = {
    PAY_AFTERPAY: 'payWithAfterpay',
    PAY_KLARNA: 'payWithKlarna',
    PAY_VENMO: 'payWithVenmo',
    PAY_PAZE: 'payWithPaze'
};

// Matched deliveryOption names: https://confluence.sephora.com/wiki/display/ILLUMINATE/Switch+Item+From+Cart+API
const DELIVERY_METHOD_TYPES = {
    SAMEDAY: 'Sameday',
    AUTOREPLENISH: 'Auto-Replenish',
    STANDARD: 'Standard',
    BOPIS: 'Pickup'
};

// Matched currentBasket names: https://confluence.sephora.com/wiki/display/ILLUMINATE/Switch+Item+From+Cart+API
const CHANGE_METHOD_TYPES = {
    ACTION: {
        SWITCH: 'switch',
        UNDO: 'undo'
    },
    BOPIS: 'pickup',
    STANDARD: 'shipToHome'
};

const GIFT_MESSAGE_STATUS = {
    NOT_AVAILABLE: 0,
    AVAILABLE: 1,
    ADDED: 2
};

// Messages
const BASKET_LEVEL_MESSAGES_CONTEXTS = {
    PICK_UP_IN_STORE_ON_HOLD: 'basket.pickupStoreReservationOnHold',
    GLOBAL_BASKET_LEVEL_MESSAGES: ['basket.inventoryNotAvailable', 'basket.sduGiftCardUnavailable'],
    BOPIS_GLOBAL_BASKET_LEVEL_MESSAGES: ['basket.pickupItemsOutOfStock'],
    STANDARD_BASKET_LEVEL_MESSAGES: ['basket.hasOnlySamples', 'basket.biRewardNoMinMerchTotal'],
    SDD_BASKET_LEVEL_MESSAGES: ['sameDayBasketLevelMsg', 'basket.inventoryNotAvailable'],
    BOPIS_BASKET_LEVEL_MESSAGES: [
        'basket.storePickupOnHold',
        'basket.biRewardNoMinMerchTotal',
        'basket.pickupItemsOutOfStock',
        'basket.birthdayGiftNoMindMerchTotal'
    ],
    PRE_BASKET_BOPIS_ERRORS: ['basket.pickupItems.genericErrorMessage'],
    PRE_BASKET_STANDARD_ERRORS: ['basket.shiptoHome.genericErrorMessage'],
    BI_BENEFITS_WARNINGS: ['basket.promoWarning', 'basketLevelMsg'],
    RRC_REMAINING_BALANCE: 'basket.rrcRemainingBalance',
    RW_REMAINING_BALANCE: 'basket.rwRemainingBalance',
    SHOPPING_LIST_PROMO_WARNING: 'shoppingList.promoWarning',
    REWARD_WARNING: 'basket.biRewardNoMinMerchTotal'
};

const BASKET_ERROR_TYPES = {
    GLOBAL_ERRORS: ['basketLevelMsg'],
    BOPIS_GLOBAL_ERRORS: ['invalidBasket'],
    SDD_ERRORS: ['sameDayBasketLevelMsg']
};

const BI_BENEFITS_ITEM_TYPES = {
    ROUGE_REWARDS: 'rougeRewards',
    CC_REWARDS: 'creditCardRewards',
    BI_POINTS: 'biPoints',
    REWARDS_BAZAAR: 'rewardsBazaar',
    FREE_SAMPLES: 'freeSamples'
};

const TOP_BANNER_MESSAGES = {
    FREE_RETURNS: 'FreeReturns',
    TIER: 'TierMessage',
    CANADA_POST_STRIKE: 'Canada_Post_Strike_Warning'
};
const TOP_BANNER_PERSONALIZED_MESSAGES = {
    BIRTHDAY_GIFT: 'Birthday-Banner'
};

const BASKET_RENDERING_TYPE = {
    GIFT_CARD_QUICK_ADD: 'GiftCardQuickAdd',
    BI_BENEFITS_TILES: 'Basket_BI_Benefits',
    BI_BENEFITS_TILES_ITEM: 'Basket_BI_Benefits_Item',
    CC_BANNER: 'CCBanner'
};

const BASKET_RENDERING_TYPE_DYNAMIC_ATTRIBUTE = {
    ITEM_TYPE: 'itemType'
};

const RWD_CHECKOUT_ERRORS = {
    TOP_OF_PAGE_BOPIS: 'topOfPageBopis',
    TOP_OF_PAGE_SAD: 'topOfPageSad',
    SDD_ZONE_2: 'sddZone2',
    BOPIS_ZONE_2: 'bopisZone2',
    GIS_ZONE_2: 'gisZone2',
    BI_BENEFITS_ERRORS: 'biBenefitsErrors'
};

// CXS
const CXS_INFO_MODAL_KEYS = [
    'foModal',
    'stModal',
    'shModal',
    'arModal',
    'bopisModal',
    'rougeRewardsModal',
    'biCashModal',
    'bagFeeModal',
    'sddModal',
    'discountEventPointsModal',
    'bopisEstimatedTaxModal',
    'crditCadRewrdTemsCond',
    'biFeaturedOffers',
    'creditCardRewardsModal'
];

const CXS_MODAL_KEYS = ['sdu'];

const CXS_ZONE_KEYS = ['biBenifits', 'bopisContent', 'content', 'bopisTopContent', 'topContent', 'bopisBottomContent'];

export {
    BASKET_TYPES,
    ROOT_BASKET_TYPES,
    MAIN_BASKET_TYPES,
    BOPIS_TYPES,
    DC_BASKET_TYPES,
    SECONDARY_COLUMN_TYPES,
    CART_BANNER_SECTION_TYPES,
    DELIVERY_METHOD_TYPES,
    CHANGE_METHOD_TYPES,
    GIFT_MESSAGE_STATUS,
    BASKET_LEVEL_MESSAGES_CONTEXTS,
    BASKET_ERROR_TYPES,
    BI_BENEFITS_ITEM_TYPES,
    TOP_BANNER_MESSAGES,
    CXS_INFO_MODAL_KEYS,
    CXS_MODAL_KEYS,
    CXS_ZONE_KEYS,
    BASKET_RENDERING_TYPE,
    BASKET_RENDERING_TYPE_DYNAMIC_ATTRIBUTE,
    RWD_CHECKOUT_ERRORS,
    TOP_BANNER_PERSONALIZED_MESSAGES,
    PAYMENT_TYPES
};
