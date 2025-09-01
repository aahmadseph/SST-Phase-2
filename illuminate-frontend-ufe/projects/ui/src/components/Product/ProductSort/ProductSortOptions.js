import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Product/ProductSort/locales', 'ProductSortOptions');

const RECENTLY = {
        name: getText('recentlyAdded'),
        code: 'recently'
    },
    BRANDNAME_ASC = {
        name: getText('brandAZ'),
        code: 'brandNameASC'
    },
    BRANDNAME_DESC = {
        name: getText('brandZA'),
        code: 'brandNameDESC'
    },
    PRICE_HIGH_TO_LOW = {
        name: getText('priceLow'),
        code: 'priceHighToLow'
    },
    PRICE_LOW_TO_HIGH = {
        name: getText('priceHigh'),
        code: 'priceLowToHigh'
    };

const LIST = [RECENTLY, BRANDNAME_ASC, BRANDNAME_DESC, PRICE_HIGH_TO_LOW, PRICE_LOW_TO_HIGH];

export {
    LIST, RECENTLY, BRANDNAME_ASC, BRANDNAME_DESC, PRICE_HIGH_TO_LOW, PRICE_LOW_TO_HIGH
};
