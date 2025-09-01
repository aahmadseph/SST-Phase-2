const localeSelector = async () => {
    const {
        default: { LANGUAGES = { EN: 'EN' } }
    } = await import('utils/LanguageLocale');
    const locale = (Sephora.renderQueryParams && Sephora.renderQueryParams.language) || LANGUAGES.EN;

    return locale.toUpperCase();
};

export { localeSelector };
