import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/PurchaseHistoryList/PurchasesFilter/locales', 'PurchasesFilterOptions');

const BOTH = {
        name: getText('nameAll'),
        code: 'both'
    },
    ONLINE = {
        name: getText('nameOnlinePurchases'),
        code: 'online'
    },
    STORE = {
        name: getText('nameStorePurchases'),
        code: 'store'
    },
    REWARDS = {
        name: getText('nameRewardsGift'),
        code: 'rewards'
    };

const LIST = [BOTH, ONLINE, STORE, REWARDS];

export {
    LIST,
    BOTH,
    ONLINE,
    STORE,
    REWARDS
};
