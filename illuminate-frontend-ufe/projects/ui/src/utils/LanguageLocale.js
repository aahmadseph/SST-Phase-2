// Manage Language and Locale
import { createSelector } from 'reselect';
import COOKIE_UTILS from 'utils/Cookies';
import translationUtil from 'utils/Translations';
import { localeSelector } from 'viewModel/selectors/locale/localeSelector';
import Empty from 'constants/empty';
import allResource from 'utils/locales/allResources';
import FR from 'components/general_fr_CA.js';
import EN from 'components/general_en_US.js';

const { translationMissingHandler, warningWrapper } = translationUtil;

const LOCALE_COOKIE_KEY = 'site_locale';
const LANGUAGE_COOKIE_KEY = 'site_language';
const LOCALE_SHIP_COUNTRY = 'ship_country';
const COUNTRIES = {
    US: 'US',
    CA: 'CA',
    PR: 'PR'
};
const CANADA_PROVINCES = {
    QC: 'QC'
};
const LANGUAGE_CODES = {
    englishUSA: 'en_US',
    englishCA: 'en_CA',
    frenchCA: 'fr_CA'
};
const LANGUAGES = {
    EN: 'EN',
    FR: 'FR',
    ENGLISH: 'ENGLISH',
    FRENCH: 'FRENCH',
    ENG: 'ENG',
    FRE: 'FRE',
    'US-EN': 'English',
    'CA-EN': 'English',
    'CA-FR': 'Français'
};
const COUNTRY_LONG_NAMES = {
    US: 'United States',
    CA: 'Canada',
    DE: 'Germany',
    GB: 'UK',
    JP: 'Japan',
    KR: 'Korea',
    NO: 'Norway'
};

const ISO_CURRENCY = {
    US: 'USD',
    CA: 'CAD',
    JP: 'JPY',
    KR: 'KRW',
    NL: 'EUR',
    GB: 'GBP',
    DE: 'EUR',
    NO: 'NOK',
    AU: 'AUD'
};

const CURRENCY_SYMBOLS = {
    US: '$',
    CA: 'C$',
    CA_FR: ' $'
};

const SEARCH_RADIUS = {
    US: 50,
    CA: 100
};

const DISTANCE_UNITS = {
    US: 'mi',
    CA: 'km'
};

const COUNTRY_FLAGS = {
    US: '/img/ufe/flags/us.svg',
    CA: '/img/ufe/flags/ca.svg',
    DE: '/img/ufe/flags/de.svg',
    GB: '/img/ufe/flags/gb.svg',
    JP: '/img/ufe/flags/jp.svg',
    KR: '/img/ufe/flags/kr.svg',
    NO: '/img/ufe/flags/no.svg'
};

const postalCodeRegex = /[a-zA-Z]\d[a-zA-Z]\s?\d[a-zA-Z]\d/;

function getCurrentLanguage() {
    return ((Sephora.renderQueryParams && Sephora.renderQueryParams.language) || LANGUAGES.EN).toUpperCase();
}

function getCurrentCountry() {
    return (Sephora.renderQueryParams && Sephora.renderQueryParams.country && Sephora.renderQueryParams.country.toUpperCase()) || COUNTRIES.US;
}

const generalResourceFiles = translationMissingHandler({
    FR,
    EN
});

const getTextFromResource = (getText, label, vars = Empty.Array) => createSelector(localeSelector, () => getText(label, vars));

const getTextDirectFromResource = (getText, label, vars = Empty.Array) => getText(label, vars);

const getLocaleResourceFile = (referenceFolder, resourceFileName) => (label, vars) => {
    const fullPath = `${referenceFolder}/${resourceFileName}`;
    const getText = requireResourceFile(fullPath);
    const text = getText(label, vars);

    return text;
};

const _localizationFilesDictionary = {};

const requireResourceFile = fullPath => {
    try {
        const language = getCurrentLanguage();
        let textResource = _localizationFilesDictionary[fullPath];

        if (!textResource) {
            textResource = translationMissingHandler({
                EN: allResource[`${fullPath}_en_US`],
                FR: allResource[`${fullPath}_fr_CA`]
            });
        }

        _localizationFilesDictionary[fullPath] = textResource;

        return textResource[language];
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        return warningWrapper(allResource[`${fullPath}_en_US`]);
    }
};

function isCanada(country) {
    return (country || getCurrentCountry()).toUpperCase() === COUNTRIES.CA;
}

export default {
    COUNTRIES,
    COUNTRY_LONG_NAMES,
    ISO_CURRENCY,
    LANGUAGES,
    CURRENCY_SYMBOLS,
    SEARCH_RADIUS,
    DISTANCE_UNITS,
    LANGUAGE_CODES,

    // return the current country such as "us" or "canada"
    getCurrentCountry,

    getCurrentLanguage,

    getCurrentLanguageCountryCode: function () {
        return `${getCurrentLanguage().toLowerCase()}_${getCurrentCountry().toUpperCase()}`;
    },

    // Uses hyphen not underscore i.e. en-US NOT en_US
    getCurrentLanguageLocale: function () {
        return `${getCurrentLanguage().toLowerCase()}-${getCurrentCountry().toUpperCase()}`;
    },

    setCurrentCountry: function (country) {
        COOKIE_UTILS.write(LOCALE_COOKIE_KEY, country);
    },

    setShippingCountry: function (country) {
        COOKIE_UTILS.write(LOCALE_SHIP_COUNTRY, country);
    },

    getLocaleResourceFile,

    getGeneralResourceFile: function () {
        return generalResourceFiles[getCurrentLanguage()];
    },

    setCurrentLanguage: function (language) {
        COOKIE_UTILS.write(LANGUAGE_COOKIE_KEY, language);
    },

    isCanada,

    isQuebecCanada: function (country, state) {
        return isCanada(country) && (state || '').toUpperCase() === CANADA_PROVINCES.QC;
    },

    isFrench: function () {
        return getCurrentLanguage().toUpperCase() === LANGUAGES.FR;
    },

    isUS: function (country) {
        return (country || getCurrentCountry()).toUpperCase() === COUNTRIES.US;
    },

    isFRCanada: function () {
        return getCurrentCountry().toUpperCase() === COUNTRIES.CA && getCurrentLanguage().toUpperCase() === LANGUAGES.FR;
    },

    isCountryInternational: function (country) {
        return country !== COUNTRIES.CA && country !== COUNTRIES.US;
    },

    getCountryFlagImage: function (country) {
        return COUNTRY_FLAGS[country.toUpperCase()];
    },

    getCountryLongName: function (country) {
        return COUNTRY_LONG_NAMES[country.toUpperCase()];
    },

    getCurrencySymbol: function () {
        return getCurrentCountry() === COUNTRIES.US ? CURRENCY_SYMBOLS.US : CURRENCY_SYMBOLS.CA;
    },

    getCountrySearchRadius: function (country) {
        return this.isUS(country) ? SEARCH_RADIUS.US : SEARCH_RADIUS.CA;
    },

    getCountryDistanceUnits: function () {
        return this.isUS() ? DISTANCE_UNITS.US : DISTANCE_UNITS.CA;
    },

    getCountryDistanceUnitsLong: function (distance) {
        return this.isUS() ? 'mile' + (distance === 1 ? '' : 's') : 'km';
    },

    isZipCode: function (possibleZipCode) {
        return Number.isInteger(parseInt(possibleZipCode));
    },

    isPostalCode: function (possiblePostalCode) {
        return postalCodeRegex.test(possiblePostalCode);
    },

    isValidCountry: function (country) {
        return country === COUNTRIES.US || country === COUNTRIES.CA;
    },

    getFormattedPrice: function (value, isValuePrice = false, toFixed = true, isValueLabelLower = false) {
        const floatValue = parseFloat(value);

        if (isNaN(floatValue)) {
            return '';
        }

        const isFRCanada = this.isFRCanada();
        const getText = getLocaleResourceFile('utils/locales', 'LanguageLocale');
        let priceValue = toFixed ? floatValue.toFixed(2) : String(floatValue);

        if (isFRCanada) {
            priceValue = `${priceValue.replace('.', ',')} $`;
        } else {
            priceValue = `$${priceValue}`;
        }

        if (isValuePrice) {
            priceValue = `(${priceValue} ${getText('valueLabel')})`;
        }

        if (isValueLabelLower) {
            priceValue = `(${priceValue} ${getText('valueLabelLower')})`;
        }

        return priceValue;
    },

    getCountryISOCurrency: function () {
        return this.isCanada() ? ISO_CURRENCY.CA : ISO_CURRENCY.US;
    },

    getTextFromResource,
    getTextDirectFromResource
};
