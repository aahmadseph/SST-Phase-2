/* eslint-disable class-methods-use-this */
import {
    resolve,
    basename
} from 'path';

import {
    PARAMETERS,
    COOKIES_NAMES,
    COUNTRIES,
    LANGUAGES
} from '#server/services/utils/Constants.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);


const usPath = `/${COUNTRIES.US}`;
const caPath = `/${COUNTRIES.CA}`;
const caFrPath = `/${COUNTRIES.CA}/${LANGUAGES.FR}`;

const VALID_COUNTRIES = [COUNTRIES.US.toUpperCase(), COUNTRIES.CA.toUpperCase()],
    VALID_LANGUAGES = [LANGUAGES.EN, LANGUAGES.FR];

function getSubstring(input, upper = true) {
    let result = input;

    if (input && typeof input === 'string') {
        result = input.substring(0, 2);

        if (upper) {
            result = result.toUpperCase();
        }
    }

    return result;
}

class DefaultLocaleAccessor {
    locale(request) {
        const context = {};

        if (!this.localeIsPresent(request, context)) {
            return null;
        }

        const country = getSubstring(this.getCountry(request, context) || COUNTRIES.US);
        const language = getSubstring(this.getLanguage(request, context) || LANGUAGES.EN, false);

        return {
            country: country,
            language: language
        };
    }

    localeIsPresent() {
        return true;
    }

    getCountry() {
        return COUNTRIES.US;
    }

    getLanguage() {
        return LANGUAGES.EN;
    }
}

class UrlQueryParametersLocaleAccessor extends DefaultLocaleAccessor {
    localeIsPresent(request, context) {
        context.country = this.getParamValue(request, PARAMETERS.COUNTRY_SWITCH);
        context.language = this.getParamValue(request, PARAMETERS.LANG);

        return context.country;
    }

    getCountry(request, context) {
        return context.country;
    }

    getLanguage(request, context) {
        return context.language || LANGUAGES.EN;
    }

    getParamValue(request, paramName) {
        const paramValue = request.query[paramName];

        if (Array.isArray(paramValue)) {
            const firstAtLeastTwoCharactersString = paramValue.find(x => x.length >= 2);

            return getSubstring(firstAtLeastTwoCharactersString, false);
        }

        return paramValue;
    }
}

class UrlPathLocaleAccessor extends DefaultLocaleAccessor {
    localeIsPresent(request, context) {
        context.lowerCaseUrl = request.path.toLowerCase();

        return context.lowerCaseUrl.startsWith(caPath) || context.lowerCaseUrl.startsWith(usPath);
    }

    getCountry(request, context) {
        return context.lowerCaseUrl.startsWith(caPath) ? COUNTRIES.CA : COUNTRIES.US;
    }

    getLanguage(request, context) {
        return context.lowerCaseUrl.startsWith(caFrPath) ? LANGUAGES.FR : LANGUAGES.EN;
    }
}

class CookiesLocaleAccessor extends DefaultLocaleAccessor {
    localeIsPresent(request, context) {
        context.country = request.cookies[COOKIES_NAMES.SITE_LOCALE];
        context.language = request.cookies[COOKIES_NAMES.SITE_LANGUAGE];

        return context.country;
    }

    getCountry(request, context) {
        return context.country;
    }

    getLanguage(request, context) {
        return context.language || LANGUAGES.EN;
    }
}

function getLocaleByPriority(localeAccessors, request) {
    for (const localeAccessor of localeAccessors) {
        const locale = localeAccessor.locale(request);

        if (locale !== null) {
            return locale;
        }
    }

    return null;
}

// configure priority heare
const prioritizedLocaleAccessors = [
    new UrlQueryParametersLocaleAccessor(),
    new UrlPathLocaleAccessor(),
    new CookiesLocaleAccessor(),
    new DefaultLocaleAccessor()
];

export default function countryLanguageMiddleware(request, response, next) {
    const locale = getLocaleByPriority(prioritizedLocaleAccessors, request);
    const apiOptions = {
        country: COUNTRIES.US,
        language: LANGUAGES.EN
    };

    if (locale) {
        if (locale.country && (typeof locale.country === 'string')) {
            // seems we get some country like U instead of US or CZ? which is not valid
            apiOptions.country = (VALID_COUNTRIES.includes(locale.country) ? locale.country : COUNTRIES.US.toUpperCase());
            request.cookies[COOKIES_NAMES.SITE_LOCALE] = apiOptions.country.toLowerCase();
        } else {
            logger.error(`Failed to get country from '${locale.country}' of type '${typeof locale.country}'. Using US as a default`);
            logger.info(`
                url: '${request.url}',
                apiOptions: '${stringifyMsg(apiOptions)}',
                1) query: '${stringifyMsg(request.query)}',
                2) path: '${request.path}',
                3) cookies: '${request.cookies[COOKIES_NAMES.SITE_LOCALE]}-${request.cookies[COOKIES_NAMES.SITE_LANGUAGE]}'.`);
            apiOptions.country = COUNTRIES.US.toUpperCase();
        }

        if (locale.language) {
            // seems we get some languages like e instead of en or fr? which is not valid
            apiOptions.language = (VALID_LANGUAGES.includes(locale.language) ? locale.language : LANGUAGES.EN);
            request.cookies[COOKIES_NAMES.SITE_LANGUAGE] = apiOptions.language.toLowerCase();
        }
    }

    // in US force english
    if (apiOptions.country === 'US' && apiOptions.language !== 'en') {
        apiOptions.language = 'en';
    }

    request.apiOptions = apiOptions;

    next();
}
