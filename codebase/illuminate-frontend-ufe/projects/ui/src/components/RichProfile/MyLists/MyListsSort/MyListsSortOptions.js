import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyLists/MyListsSort/locales', 'MyListsSortOptions');

const RECENTLY = {
        name: getText('recentlyAdded'),
        code: 'recently',
        isDefault: true
    },
    PRICE_LOW_TO_HIGH = {
        name: getText('priceHigh'),
        code: 'priceLowToHigh'
    },
    PRICE_HIGH_TO_LOW = {
        name: getText('priceLow'),
        code: 'priceHighToLow'
    },
    TOP_RATED = {
        name: getText('topRated'),
        code: 'topRated'
    },
    BRANDNAME_ASC = {
        name: getText('brandAZ'),
        code: 'brandNameASC'
    },
    BRANDNAME_DESC = {
        name: getText('brandZA'),
        code: 'brandNameDESC'
    };

const LIST = [RECENTLY, PRICE_LOW_TO_HIGH, PRICE_HIGH_TO_LOW, TOP_RATED, BRANDNAME_ASC, BRANDNAME_DESC];

export {
    LIST, RECENTLY, BRANDNAME_ASC, BRANDNAME_DESC, TOP_RATED, PRICE_HIGH_TO_LOW, PRICE_LOW_TO_HIGH
};
