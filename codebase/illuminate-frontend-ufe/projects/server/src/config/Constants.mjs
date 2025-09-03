const MEDIA_IDS = {
    REWARDS: 16800018,
    HAPPENING_AT_SEPHORA: 51900064,
    SEPHORA_NEAR_ME: 'ufestorelocator32400028',
    SERVICES_FAQ: 86300020,
    STORE_LIST: 'ufestorelist32400028',
    CREDIT_CARD_APPROVED: 73400024,
    BEAUTY_WIN_PROMO: 86400056,
    BEAUTY_INSIDER: 43900052
};

const CA_EN_FR = '(/ca/en|/ca/fr)?';

const JERRI_APPLICATION_NAME = 'jerri';
const WOODY_APPLICATION_NAME = 'woody';

const UNKNOWN_LOCAL_BUILD = 'Unknown-Local';
const LOCAL_NODEJS_BUILD = 'UFE-node.js';

const JERRI_APPLICATION_CHANNELS = ['FS', 'MW', 'RWD'];
const WOODY_APPLICATION_CHANNELS = ['FS', 'MW', 'RWD', 'iPhoneApp', 'androidApp'];

const JERRI_NONE_PAGE_ROUTES = /^\/(api|gapi|gway|contentimages|productimages|img|js)\//;
const WOODY_NONE_PAGE_ROUTES = /^\/(contentimages|productimages|img|js)\//;
const STATIC_ASSETS = /\/(favicon.ico|p.js)/;

export {
    MEDIA_IDS,
    CA_EN_FR,
    JERRI_APPLICATION_NAME,
    WOODY_APPLICATION_NAME,
    JERRI_APPLICATION_CHANNELS,
    WOODY_APPLICATION_CHANNELS,
    UNKNOWN_LOCAL_BUILD,
    LOCAL_NODEJS_BUILD,
    JERRI_NONE_PAGE_ROUTES,
    WOODY_NONE_PAGE_ROUTES,
    STATIC_ASSETS
};
