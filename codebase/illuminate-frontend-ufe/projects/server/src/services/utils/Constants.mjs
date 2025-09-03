const COOKIES_NAMES = {
    AKAMWEB: 'akamweb',
    DEVICE_TYPE: 'device_type',
    SITE_LANGUAGE: 'site_language',
    SITE_LOCALE: 'site_locale',
    RWD: 'rcps_rwd',
    CONFIG_CACHE: 'config_cache',
    PREVIEW: 'preview',
    PRV: 'prv',
    PREVIEW_DATE: 'previewdate',
    RCPS_CCAP: 'rcps_ccap',
    RCPS_CC: 'rcps_cc',
    RCPS_PO: 'rcps_po',
    RCPS_CHECKOUT: 'rcps_checkout',
    RCPS_SLS: 'rcps_sls',
    RCPS_FRICTIONLESS_CHECKOUT: 'rcps_frictionless_checkout'
};

const PARAMETERS = {
    COUNTRY_SWITCH: 'country_switch',
    LANG: 'lang'
};

const COUNTRIES = {
    US: 'us',
    CA: 'ca'
};

const LANGUAGES = {
    EN: 'en',
    FR: 'fr'
};

// url paths that should be prefixed with /ca/en or /ca/fr
const CA_EN_CA_FR_PREFIXED_URLS = [
    '/',
    '/shop',
    '/product',
    '/beauty',
    '/brand',
    '/beauty-offers',
    '/stores',
    '/brands-list',
    '/sale'
];

const ERROR_404 = '/error/404';

const CHANNELS = {
    IPHONE_APP: 'iPhoneApp',
    ANDROID_APP: 'androidApp',
    MOBILE_WEB: 'mobileWeb',
    RWD: 'rwd',
    WEB: 'web',
    UFE: 'UFE'
};

const SDN_CHANNELS = {
    BV: 'BV',
    OLR: 'OLR'
};

// Duplicated values from js/constants/UpperFunnel.js here because that file is no longer using module.exports
const UPPER_FUNNEL_REFINEMENTS = ['filters[Pickup]', 'filters[SameDay]', 'filters[ShipToHome]'];

const FULFILLMENT_TYPES = {
    SAMEDAY: 'SAMEDAY',
    PICK: 'PICK'
};

export {
    ERROR_404,
    COOKIES_NAMES,
    PARAMETERS,
    COUNTRIES,
    LANGUAGES,
    CA_EN_CA_FR_PREFIXED_URLS,
    CHANNELS,
    SDN_CHANNELS,
    UPPER_FUNNEL_REFINEMENTS,
    FULFILLMENT_TYPES
};
