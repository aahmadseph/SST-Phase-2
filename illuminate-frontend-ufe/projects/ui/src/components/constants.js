import localeUtils from 'utils/LanguageLocale';

const getConstants = () => {
    const getText = localeUtils.getLocaleResourceFile('constants/locales', 'Constants');

    return {
        CANADA_LEGAL_COPY: getText('canadaLegalCopy'),
        PROP_65_MSG: getText('prop65Msg'),
        BUTTON_TEXT: {
            COMING_SOON: getText('comingSoon'),
            AVAILABLE_IN_STORE_ONLY: getText('availableInStoreOnly'),
            SOLD_OUT: getText('soldOut'),
            OUT_OF_STOCK: getText('outOfStock'),
            OOS_ACTIVE: getText('emailWhenInStock'),
            OOS_INACTIVE: getText('removeReminder'),
            ADD: getText('add')
        },
        SEPHORA_URL: { DESKTOP: 'https://www.sephora.com' },
        AVATAR_DEFAULT: '/img/ufe/icons/me-active.svg',
        PAGE_RENDER_TRACKING_LIMIT: 2
    };
};

export default getConstants();
