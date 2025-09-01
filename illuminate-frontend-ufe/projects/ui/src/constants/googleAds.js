import localeUtils from 'utils/LanguageLocale';

const BASE_GOOGLE_ADS_SEPHORA_ID = '22480080943';
const BASE_GOOGLE_ADS_BASE_BLOCK_ID = 'div-gpt-ad';

const ADS_NAMESPACES = {
    EN_US_WEB: 'SephoraUSWeb',
    EN_US_MOB: 'SephoraUSMob',
    EN_CA_WEB: 'SephoraCAENWeb',
    EN_CA_MOB: 'SephoraCAENMob',
    FR_CA_WEB: 'SephoraCAFRWeb',
    FR_CA_MOB: 'SephoraCAFRMob'
};

const PAGE_TYPES = {
    BEAUTY: 'BEAUTY',
    BRAND: 'BRAND',
    BRANDS_LIST: 'BRANDS-LIST',
    HAPPENING: 'HAPPENING',
    HOME: 'HOME',
    PRODUCT: 'PRODUCT',
    SEARCH: 'SEARCH',
    SHOP: 'SHOP',
    SALE: 'SALE'
};

const PAGE_TYPE_TARGETING = {
    [PAGE_TYPES.BEAUTY]: 'content',
    [PAGE_TYPES.BRAND]: 'brand',
    [PAGE_TYPES.BRANDS_LIST]: 'content',
    [PAGE_TYPES.HAPPENING]: 'content',
    [PAGE_TYPES.HOME]: 'home',
    [PAGE_TYPES.PRODUCT]: 'pdp',
    [PAGE_TYPES.SEARCH]: 'search',
    [PAGE_TYPES.SHOP]: 'category'
};

const getAdSlotNamespace = () => {
    const isMobile = Sephora.isMobile ? Sephora.isMobile() : false;
    const isCanada = localeUtils.isCanada();
    const isFrench = localeUtils.isFrench();

    const key = `${isFrench ? 'FR' : 'EN'}_${isCanada ? 'CA' : 'US'}_${isMobile ? 'MOB' : 'WEB'}`;

    return ADS_NAMESPACES[key];
};

const AD_SLOTS_UNIT_PATHS = {
    [PAGE_TYPES.BEAUTY]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/beauty`,
    [PAGE_TYPES.BRAND]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/brand`,
    [PAGE_TYPES.HAPPENING]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/happening`,
    [PAGE_TYPES.HOME]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/home`,
    [PAGE_TYPES.PRODUCT]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/product`,
    [PAGE_TYPES.SEARCH]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/search`,
    [PAGE_TYPES.SHOP]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/shop`,
    [PAGE_TYPES.BRANDS_LIST]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/brands`,
    [PAGE_TYPES.SALE]: `/${BASE_GOOGLE_ADS_SEPHORA_ID}/${getAdSlotNamespace()}/sale`
};

const AD_BLOCK_ID_BASES = {
    [PAGE_TYPES.BEAUTY]: `${BASE_GOOGLE_ADS_BASE_BLOCK_ID}-4617412`,
    [PAGE_TYPES.BRAND]: `${BASE_GOOGLE_ADS_BASE_BLOCK_ID}-9850293`,
    [PAGE_TYPES.HAPPENING]: `${BASE_GOOGLE_ADS_BASE_BLOCK_ID}-3962737`,
    [PAGE_TYPES.HOME]: `${BASE_GOOGLE_ADS_BASE_BLOCK_ID}-2850704`,
    [PAGE_TYPES.PRODUCT]: `${BASE_GOOGLE_ADS_BASE_BLOCK_ID}-6263316`,
    [PAGE_TYPES.SEARCH]: `${BASE_GOOGLE_ADS_BASE_BLOCK_ID}-3748882`,
    [PAGE_TYPES.SHOP]: `${BASE_GOOGLE_ADS_BASE_BLOCK_ID}-5236909`
};

export default {
    PAGE_TYPES,
    PAGE_TYPE_TARGETING,
    AD_SLOTS_UNIT_PATHS,
    AD_BLOCK_ID_BASES
};
