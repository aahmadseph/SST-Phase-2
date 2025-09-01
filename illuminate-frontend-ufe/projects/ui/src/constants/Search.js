import PageTemplateType from 'constants/PageTemplateType';

const VIEW_PER_PAGE_MIN = 60;
const VIEW_ALL_PER_PAGE_MAX = 100;
const VIEW_ALL_PRODUCTS = -1;
const PRICE_SLIDER_STEP = 1;
const ALL_CATEGORIES_SEO_NAME = 'all';
const BOTTOM_PAGE_HEIGHT_MOBILE = 850;
const TIMEOUT_MS_BEFORE_SHOWING_THE_INTERSTICE = 0;
const KEYWORD_SEARCH = 'search';
const KEYWORD_SALE = 'sale';
const SALE_PAGE_PATH = '%2Fsale';
const SALE_PAGE_PATH_RWD = '/sale';
const PRODUCT_NOT_CARRIED = 'productnotcarried';
const TRENDING_CATEGORIES_OBJECT_COUNT = 1;

const TEMPLATES = { SEARCH: PageTemplateType.Search };

const CATEGORY_LEVEL = {
    ROOT: 0,
    TOP: 1,
    NTH: 2
};

const CATALOG_API_CALL = { SEARCH: 'getProductsFromKeyword' };

const CATALOG_ITEMS = {
    CATEGORY: 'category',
    BRAND: 'brand'
};

const CHECKBOX_SELECTED = {
    CHECKED: 2,
    IMPLICIT: 4
};

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

const ENDECA_SORT_OPTIONS = {
    BEST_SELLING: 'P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0',
    TOP_RATED: 'P_RATING:1',
    PRICE_LOW_TO_HIGH: 'price:0',
    PRICE_HIGH_TO_LOW: 'price:1',
    NEW: 'P_NEW:1::P_START_DATE:1'
};

const NLP_SORT_OPTIONS = {
    BEST_SELLING: 'P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0',
    RELEVANCY: '-1',
    TOP_RATED: 'P_RATING:1',
    PRICE_LOW_TO_HIGH: 'price:0',
    PRICE_HIGH_TO_LOW: 'price:1',
    NEW: 'P_NEW:1::P_START_DATE:1'
};

const SEARCH_SORT_OPTIONS = {
    BEST_SELLING: 'P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0',
    RELEVANCY: '-1',
    TOP_RATED: 'P_RATING:1',
    PRICE_LOW_TO_HIGH: 'price:0',
    PRICE_HIGH_TO_LOW: 'price:1',
    NEW: 'P_NEW:1::P_START_DATE:1',
    EXCLUSIVE: 'P_SEPH_EXCLUSIVE:1',
    BRAND_NAME: 'P_BRAND_NAME:0'
};

const SALE_KEYWORDS = [
    'sale',
    'sales',
    'solde',
    'soldes',
    'on sale',
    'discount',
    'discounts',
    'sale item',
    'sale items',
    'sale product',
    'sale products',
    'sale makeup',
    'makeup sale',
    'clearance sale',
    'clearence sale',
    'clearence',
    'clearance'
];

const URL_KEYWORDS = {
    KEYWORD: 'q',
    NODE: 'node'
};

export {
    VIEW_PER_PAGE_MIN,
    VIEW_ALL_PER_PAGE_MAX,
    VIEW_ALL_PRODUCTS,
    PRICE_SLIDER_STEP,
    ALL_CATEGORIES_SEO_NAME,
    BOTTOM_PAGE_HEIGHT_MOBILE,
    TIMEOUT_MS_BEFORE_SHOWING_THE_INTERSTICE,
    TEMPLATES,
    CATEGORY_LEVEL,
    CATALOG_API_CALL,
    CATALOG_ITEMS,
    CHECKBOX_SELECTED,
    KEYWORD_SEARCH,
    KEYWORD_SALE,
    SALE_PAGE_PATH,
    ENDECA_VS_CONSTRUCTOR_COLORS,
    ENDECA_SORT_OPTIONS,
    NLP_SORT_OPTIONS,
    SEARCH_SORT_OPTIONS,
    SALE_KEYWORDS,
    SALE_PAGE_PATH_RWD,
    PRODUCT_NOT_CARRIED,
    TRENDING_CATEGORIES_OBJECT_COUNT,
    URL_KEYWORDS
};
