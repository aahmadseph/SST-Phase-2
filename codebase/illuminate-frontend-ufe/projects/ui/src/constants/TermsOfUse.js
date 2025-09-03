import localeUtils from 'utils/LanguageLocale';

const getTermsOfUseConsts = () => {
    const getText = localeUtils.getLocaleResourceFile('constants/locales', 'TermsOfUse');

    return {
        SEPHORA_CARD_EXCLUSIONS: getText('exclusions'),
        CLICK_HERE_FOR_DETAILS: getText('details')
    };
};

export default getTermsOfUseConsts();
