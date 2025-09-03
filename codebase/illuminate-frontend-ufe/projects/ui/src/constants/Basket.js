import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('constants/locales', 'Basket');

// fulfillmenttype
const BasketType = {
    Standard: null,
    SameDay: 'sameday',
    BOPIS: 'ROPIS' || 'buy online and pick up basket'
};

const API_BASKET_TYPE = {
    sameday: 'SameDay',
    standard: 'ShipToHome',
    ROPIS: 'Pickup',
    BOPIS: 'Pickup'
};

export default {
    MESSAGES: {
        BASKET_LEVEL: {
            FREE_SHIPPING: getText('freeShipping')
        }
    },
    DELIVERY_OPTIONS: {
        STANDARD: 'Standard',
        ROUGE_FREE_SHIPPING: 'Rouge Free Shipping',
        SAME_DAY: 'Sameday',
        PICKUP: 'Pickup',
        AUTO_REPLENISH: 'Auto-Replenish'
    },
    CONTEXT: { RW_REMAINING_BALANCE: 'basket.rwRemainingBalance' },
    // The minimum points at which a reward is valuable enough to be shipping without a product
    // also being in the order
    STANDALONE_REWARD_MIN_VAL: 750,
    POINTS_FOR_DISCOUNT_MIN_VAL: 500,
    // Warning messages (key/messageContext) we don't want to show in the Inline Basket and show them
    // in a different way in Basket page list item
    WARNING_BLACKLIST_MESSAGES: [],
    SHOPPING_LIST_PROMO_WARNING: 'shoppingList.promoWarning',
    PROMO_WARNING: 'basket.promoWarning',
    RESTRICTED_ITEMS_REMOVED: 'basket.restrictedItemsRemoved',
    PICK_UP_ITEMS_OUT_OF_STOCK_SKU: 'basket.pickupsku.outOfStock',
    AMOUNT_TO_FREE_SHIPPING: 'basket.amountToFreeShipping',
    FREE_SHIPPING_THRESHOLD: 'basket.thresholdFreeShipping',
    FREE_SHIPPING_ROUGE: 'basket.rougeFreeShipping',
    FREE_SHIPPING_ROUGE_CA: 'basket.rougeCAFreeShipping',
    FREE_SHIPPING_ROUGE_HAZMAT: 'basket.rougeHazmatFreeShipping',
    CBR_PROMO_MESSAGE: 'basket.promoMessages.cbr',
    PFD_PROMO_MESSAGE: 'basket.promoMessages.pfd',
    SED_CLOSE_PROMO_MESSAGE: 'basket.promotion.sed.close',
    BasketType,
    API_BASKET_TYPE,
    ERROR_CODES: {
        ERROR_CODE_1093: -1093
    },
    ERROR_KEYS: {
        LIMIT_EXCEEDED: 'basket.lineItem.purchaseLimit.exceeded',
        OUT_OF_STOCK: 'basket.sku.outOfStock'
    },
    GIFT_MESSAGE_STATUS: {
        NOT_AVAILABLE: 0,
        AVAILABLE: 1,
        ADDED: 2
    },
    LANGUAGE_OPTIONS: {
        FRENCH: 'giftMessages_fr-CA'
    },
    ALL_TITLE: {
        ENGLISH: 'All',
        FRENCH: 'Tout'
    },
    DEEPLINK_ADD_TO_BASKET_SOURCES: {
        DEEPLINK_US_SMS: 'sms-us_addtobasket',
        DEEPLINK_CA_SMS: 'sms-can_addtobasket',
        DEEPLINK_US_EMAIL: 'email-us_addtobasket',
        DEEPLINK_CA_EMAIL: 'email-can_addtobasket',
        REPLEN_US_SMS: 'sms-us_92e9f1e7-fd85-49bd-a3bf-ec74a8970235_5d5f752c-76b0-4d41-8cd4-9d44b3f90ecf_[US]TR_(SMS)(CRM)ReplenAddtoBasket_SMS',
        REPLEN_CA_SMS: 'sms-ca_e3894833-c491-42a2-90d0-3c3ed3b7ff7c_0aeb4b8b-d4b5-4f5d-9969-f82d75aafe16_[CA]TR_(SMS)(CRM)ReplenAddtoBasket_SMS'
    }
};
