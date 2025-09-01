import ContentConstants from 'constants/content';

const { PRODUCT_LIST_GROUPING } = ContentConstants;
const {
    SHOW_PRICE, SHOW_RATING_WITH_TOTAL_COUNT, SHOW_LOVES_BUTTON, SHOW_MARKETING_FLAGS, SHOW_ADD_BUTTON
} = PRODUCT_LIST_GROUPING;

const NEW_CONTENT_PAGE_ID = 'new';
const BESTSELLERS_PAGE_ID = 'bestsellers';
const ALL = 'all';

const DURATION = {
    HALF_MONTH: '0-336',
    FULL_MONTH: '0-720',
    TWO_MONTHS: '0-1440'
};

const CONSTRUCTOR_PODS = {
    YMAL: 'ymal-test',
    RFY: 'rfy-test',
    SIMILAR_PRODUCTS: 'similar-products-test',
    ATB: 'pdp-atb-modal',
    RFY_BASKET: 'basket-rfy',
    BOPIS_BASKET: 'bopis-basket',
    SELLING_FAST: 'hp-selling-fast',
    NEW_ARRIVALS: 'hp-new-arrivals',
    BESTSELLERS: 'bestsellers-content-page',
    BESTSELLERS_ALL: 'bestsellers-content-page-all',
    NEW_CONTENT_PAGE: 'new-content-page',
    NEW_CONTENT_ALL: 'new-content-page-all',
    BASKET_QUICK_ADDS: 'basket-quick-adds',
    FREQUENTLY_BOUGHT_TOGETHER: 'pdp-frequently-bought-together',
    NEW_CONTENT_PAGE_JUST_DROPPED: 'new-content-page-just-dropped',
    PURCHASE_HISTORY: 'purchase-history-page',
    SIMILAR_PRODUCTS_CONTENT_PAGE: 'content-page-view-similar',
    CLEAN_HIGHLIGHT: 'pdp-clean-highlight',
    ORDER_CONFIRMATION: 'order-confirm-page',
    UNDER_20_LOYALTY: 'loyalty-page-1',
    SALE_LOYALTY: 'loyalty-page-2',
    RFY_LOYALTY: 'loyalty-page-3',
    RFY_CONVENIENCE_HUB: 'convenience-hub',
    COMMUNITY_PROFILE: 'community-profile',
    PERSONALIZED_PICKS: 'mysephora-beauty-preferences',
    BP_REDESIGN_SKINCARE: 'beautypreferences-skincare',
    BP_REDESIGN_HAIR: 'beautypreferences-hair',
    BP_REDESIGN_MAKEUP: 'beautypreferences-makeup',
    BP_REDESIGN_FRAGRANCE: 'beautypreferences-fragrance',
    TARGETED_LANDING_PAGE: 'tlp-landing-page',
    AUTO_REPLENISH_CHOSEN_FOR_YOU: 'auto-replen-1',
    AUTO_REPLENISH_SEPHORA_COLLECTION: 'auto-replen-2',
    TRENDING_SEARCHES: 'trending_searches',
    TRENDING_CATEGORIES: 'trending_categories',
    CREATOR_STOREFRONT: 'creator-storefronts'
};

const GROUPING = {
    YMAL: [SHOW_PRICE, SHOW_RATING_WITH_TOTAL_COUNT],
    ATB: [SHOW_PRICE, SHOW_RATING_WITH_TOTAL_COUNT, SHOW_LOVES_BUTTON],
    PERSONALIZED_PICKS: [SHOW_PRICE, SHOW_RATING_WITH_TOTAL_COUNT, SHOW_LOVES_BUTTON, SHOW_MARKETING_FLAGS],
    BP_REDESIGN: [SHOW_PRICE, SHOW_RATING_WITH_TOTAL_COUNT, SHOW_LOVES_BUTTON, SHOW_MARKETING_FLAGS],
    CREATOR_STOREFRONT: [SHOW_PRICE, SHOW_RATING_WITH_TOTAL_COUNT, SHOW_LOVES_BUTTON, SHOW_MARKETING_FLAGS, SHOW_ADD_BUTTON]
};

const RESULTS_COUNT = {
    SIMILAR_PRODUCTS: '5',
    BESTSELLERS: '200',
    BASKET_QUICK_ADDS: '3',
    FREQUENTLY_BOUGHT_TOGETHER: '3',
    NEW_CONTENT_PAGE: '200',
    DEFAULT: '10'
};

const PRICE_RANGE = {
    UNDER_FIFTEEN: '0-15',
    UNDER_TWENTY: '0-20'
};

const BRANDS = {
    SEPHORA_COLLECTION: 'SEPHORA COLLECTION'
};

const INGREDIENT_PREFERENCES = {
    CLEAN_AT_SEPHORA: 'Clean at Sephora'
};

const CTA = {
    ADD_TO_CART: 'add_to_cart',
    MOVE_TO_LOVES: 'add_to_wishlist'
};

export {
    CONSTRUCTOR_PODS,
    GROUPING,
    RESULTS_COUNT,
    NEW_CONTENT_PAGE_ID,
    BESTSELLERS_PAGE_ID,
    DURATION,
    PRICE_RANGE,
    BRANDS,
    ALL,
    INGREDIENT_PREFERENCES,
    CTA
};
