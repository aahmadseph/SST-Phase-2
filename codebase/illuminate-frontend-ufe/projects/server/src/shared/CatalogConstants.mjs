const PAGE_TYPES = {
    NTH_CATEGORY_PAGE: 'NthCategory',
    CATEGORY_PAGE: 'Category',
    TOP_CATEGORY: 'TopCategory'
};

const REFINEMENT_STATES = {
    INACTIVE: 1,
    CHECKED: 2,
    IMPLICIT: 4
};

const REFINEMENT_TYPES = {
    COLORS: 'colors',
    RADIOS: 'radios',
    RADIOS_CUSTOM: 'radios_custom',
    CHECKBOXES: 'checkboxes',
    RANGE: 'range',
    SORT: 'sort',
    CHECKBOXES_WITH_DROPDOWN: 'checkboxesWithDropDown',
    CHECKBOXES_CUSTOM: 'checkboxes_custom',
    BEAUTY_PREFERENCES: 'beautyPreferences'
};

const REFINEMENT_NAMES = {
    PICKUP_AND_DELIVERY: 'Pickup & Delivery',
    PICKUP_AND_DELIVERY_FR: 'Ramassage et livraison'
};

const PRICE_KEYS = {
    PL: 'pl',
    PH: 'ph',
    PTYPE: 'ptype'
};

const PRICE_VALUES = {
    MANUAL: 'manual',
    MIN: 'min',
    MAX: 'max'
};

const MANUAL_PTYPE = `${PRICE_KEYS.PTYPE}=${PRICE_VALUES.MANUAL}`;

const SINGLE_SELECTS = [REFINEMENT_TYPES.RADIOS, REFINEMENT_TYPES.SORT, REFINEMENT_TYPES.RANGE];

const ENDECA_VS_CONSTRUCTOR_COLORS = {
    berry: '9010109',
    red: '100007',
    pink: '100006',
    coral: '9010111',
    brown: '100002',
    nude: '100016',
    purple: '100011',
    black: '100010',
    clear: '100012',
    incolore: '100012',
    white: '100009',
    yellow: '100003',
    green: '100015',
    blue: '100013',
    orange: '100005',
    grey: '100001',
    gold: '100014',
    silver: '100008',
    universal: '9010110',
    multi: '100004',
    unconventional: '9010128',
    blanc: '100009',
    bleu: '100013',
    'eau de parfum gold': '100014',
    multiple: '100004',
    noir: '100010',
    'non conformiste': '9010128',
    rose: '100006',
    rouge: '100007',
    universel: '9010110',
    vert: '100015',
    violet: '100011',
    argent: '100008',
    brun: '100002',
    gris: '100001'
};

const BRAND_LETTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '#'
];

const SEARCH_SORT_OPTIONS = [
    {
        name: 'relevancy',
        code: 'RELEVANCY',
        apiValue: '-1'
    },
    {
        name: 'bestselling',
        code: 'BEST_SELLING',
        apiValue: 'P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0'
    },
    {
        name: 'topRated',
        code: 'TOP_RATED',
        apiValue: 'P_RATING:1'
    },
    {
        name: 'exclusive',
        code: 'EXCLUSIVE',
        apiValue: 'P_SEPH_EXCLUSIVE:1'
    },
    {
        name: 'new',
        code: 'NEW',
        apiValue: 'P_NEW:1::P_START_DATE:1'
    },
    {
        name: 'priceDesc',
        code: 'PRICE_HIGH_TO_LOW',
        apiValue: 'price:1'
    },
    {
        name: 'priceAsc',
        code: 'PRICE_LOW_TO_HIGH',
        apiValue: 'price:0'
    },
    {
        name: 'brandName',
        code: 'BRAND_NAME',
        apiValue: 'P_BRAND_NAME:0'
    }
];

const EXTRACT_KEY_FROM_FILTER_REGEX = /filters\[(?<key>.*)\]/;

const BEAUTY_PREFERENCES_FILTER_LIMIT = 24;

const PAGE_ONE = 1;

export {
    MANUAL_PTYPE,
    PRICE_KEYS,
    PRICE_VALUES,
    PAGE_TYPES,
    REFINEMENT_STATES,
    REFINEMENT_TYPES,
    REFINEMENT_NAMES,
    ENDECA_VS_CONSTRUCTOR_COLORS,
    SINGLE_SELECTS,
    BRAND_LETTERS,
    SEARCH_SORT_OPTIONS,
    PAGE_ONE,
    EXTRACT_KEY_FROM_FILTER_REGEX,
    BEAUTY_PREFERENCES_FILTER_LIMIT
};
