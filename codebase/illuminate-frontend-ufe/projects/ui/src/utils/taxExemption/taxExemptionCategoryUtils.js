import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

export const validateStep = (data) => {
    let isValid = true;
    let errors = null;

    if (!data.selectedCategory) {
        isValid = false;
        errors = { missingCategory: getText('categoryStepSubtitle') };
    }

    return { isValid, errors };
};
