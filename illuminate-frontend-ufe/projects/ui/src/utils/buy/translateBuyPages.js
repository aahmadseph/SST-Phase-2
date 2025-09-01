import languageLocaleUtil from 'utils/LanguageLocale';

const { LANGUAGES } = languageLocaleUtil;

function replaceWithTranslation(section, locale, isContentSection = false) {
    const { translations, ...restOfSection } = section;
    const formattedLocaleCode = locale.toLowerCase();

    if (!translations || !translations[formattedLocaleCode]) {
        return section;
    }

    const translatedSection = isContentSection
        ? {
            content: translations[formattedLocaleCode].html,
            contentText: translations[formattedLocaleCode].text
        }
        : translations[formattedLocaleCode];

    return {
        ...restOfSection,
        ...translatedSection
    };
}

function translatePageToLocale(page, locale) {
    if (locale === LANGUAGES.EN) {
        return page;
    }

    const {
        slug, url, contentSections, relatedPages, ...restOfPage
    } = page;

    const translatedPage = {
        ...(url && { url }),
        slug,
        ...replaceWithTranslation(restOfPage, locale)
    };

    if (relatedPages && relatedPages.length > 0) {
        translatedPage.relatedPages = relatedPages.map(relPage => translatePageToLocale(relPage, locale));
    }

    if (contentSections && contentSections.length > 0) {
        const introContent = contentSections?.[0]?.[0] ? replaceWithTranslation(contentSections?.[0]?.[0], locale, true) : null;
        const productContent = contentSections?.[1]?.[0] ? replaceWithTranslation(contentSections?.[1]?.[0], locale, true) : null;
        translatedPage.contentSections = [[introContent], [productContent]];
    }

    return translatedPage;
}

export { translatePageToLocale };
