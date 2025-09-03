const ISO_CURRENCY = { US: 'USD' };
const LOCATION_FIELDS = [
    'isBopisPreferredStore',
    'isRopisEnabled',
    'preferredStore',
    'preferredStoreLat',
    'preferredStoreLng',
    'preferredStoreName',
    'isCurbsideEnabled'
];
const CONFIGURATION_FIELDS = [
    'enablePickupSearchFilterInBrowse',
    'enableSameDaySearchFilterInBrowse',
    'isSDDRougeFreeShipEligible',
    'isSDUFeatureDown',
    'isConciergeCurbsideEnabled'
];

const PAYMENT_PROFILE_FIELDS = [
    'hasSavedPaypal',
    'hasSavedCreditCards'
];

const ERROR_FIELDS = ['data', 'err', 'url', 'statusCode'];
const FULL_PROFILE_ERROR_FIELDS = ['errorCode', 'errorMessages'];

const BD_GIFT_LAST_DATE_TO_REDEEM = 'bdGiftLastDateToRedeem';

const ELIGIBLE_REWARDS_FIELDS = [
    'isEligibleForRRC',
    'eligibleForBirthdayGift',
    'bdGiftLastDateToRedeem'
];

const BI_CASH_LOCK_UP_MSG = 'biCashLockUpMsg';

const CC_STATUS = {
    ACTIVE: 'ACTIVE'
};

const KS = {
    IS_WOODY_CC_REWARDS_ENABLED: 'isWoodyCCRewardsEnabled',
    IS_SHOPPING_LIST_ENABLED: 'isShoppingListEnabled',
    IS_WOODY_PERSONALIZED_PROMO: 'isWoodyPersonalizedPromo',
    IS_SLS_SERVICE_ENABLED: 'isSLSServiceEnabled',
    IS_SLS_SERVICE_COOKIE_IGNORE: 'isSLSServiceCookieIgnore',
    SHARABLE_LISTS_CONFIGURATION: 'sharableLists'
};

const PROFILE_FIELDS = {
    BANK_REWARDS: 'bankRewards',
    STORE_CREDITS: 'storeCredits',
    PRESCREEN_INFO: 'ccAccountandPrescreenInfo'
};

const MILISECONDS_IN_A_DAY = 86400000;

const BIA_PROPS_TO_STRINGIFY = ['birthDay', 'birthYear', 'birthMonth'];

const NON_BI = 'NON_BI';

const DEFAULT_AVAILABLE_RRC_COUPONS = {
    coupons: []
};

const DEFAULT_PERSONALIZED_PROMOTIONS = {
    hasNewPersonalizedPromotions: false,
    totalCount: 0
};

const COUNTRIES = {
    US: 'US',
    CA: 'CA'
};

export {
    ERROR_FIELDS,
    FULL_PROFILE_ERROR_FIELDS,
    CONFIGURATION_FIELDS,
    LOCATION_FIELDS,
    PAYMENT_PROFILE_FIELDS,
    ISO_CURRENCY,
    ELIGIBLE_REWARDS_FIELDS,
    BI_CASH_LOCK_UP_MSG,
    CC_STATUS,
    KS,
    PROFILE_FIELDS,
    BD_GIFT_LAST_DATE_TO_REDEEM,
    MILISECONDS_IN_A_DAY,
    BIA_PROPS_TO_STRINGIFY,
    NON_BI,
    DEFAULT_AVAILABLE_RRC_COUPONS,
    DEFAULT_PERSONALIZED_PROMOTIONS,
    COUNTRIES
};
