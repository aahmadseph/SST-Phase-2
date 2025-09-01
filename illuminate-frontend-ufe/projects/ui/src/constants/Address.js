import localeUtils from 'utils/LanguageLocale';

const getAddressConst = () => {
    const getText = localeUtils.getLocaleResourceFile('constants/locales', 'Address');

    return {
        ADDRESS_VERIFICATION_TYPE: {
            RECOMMENDED: 'RECOMMENDED',
            UNVERIFIED: 'UNVERIFIED'
        },
        ADDRESS_VERIFICATION_LEVEL: {
            POOR: 'poor',
            QUESTIONABLE: 'questionable',
            GOOD: 'good'
        },
        ADDRESS_VERIFICATION_MODAL: {
            UNVERIFIED: {
                TITLE: getText('unverifiedTitle'),
                LEGEND: getText('unverifiedLegend'),
                BUTTON_TEXT: getText('unverifiedButtonText'),
                DATA_AT: Sephora.debug.dataAt('double_check_modal')
            },
            RECOMMENDED: {
                TITLE: getText('recommendedTitle'),
                LEGEND: getText('recommendedLegend'),
                BUTTON_TEXT: getText('recommendedButtonText'),
                DATA_AT: Sephora.debug.dataAt('recommend_address_modal')
            }
        }
    };
};

export default getAddressConst();
