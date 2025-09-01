/* eslint object-curly-newline: 0 */
import {
    StringDecoder
} from 'node:string_decoder';
import {
    resolve,
    basename
} from 'node:path';
import {
    getHeader
} from '#server/utils/responseHeaders.mjs';
import {
    UPPER_FUNNEL_REFINEMENTS
} from '#server/services/utils/Constants.mjs';
import {
    safelyParse
} from '#server/utils/serverUtils.mjs';
import {
    PAGE_SIZE
} from '#server/config/apiConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

import {
    validateQueryParams,
    ALLOWED_FILTERS_SERVER
} from '#server/shared/Shared.mjs';

const DEFAULT_ENCODING = 'utf8';

const decoder = new StringDecoder(DEFAULT_ENCODING);

// logs show that when cookies are over this size
// we see 400 error codes
const LOGGING_COOKIES_SIZE = 12500;

function cookiesToString(cookies = {}, cookiesAsString = '') {
    if (!cookies) {
        return '';
    }

    if ((typeof cookies).toLowerCase() === 'string') {
        // already a string
        return cookies;
    }

    const cookieKeys = Object.keys(cookies);

    if (cookieKeys.length === 0) {
        return '';
    }

    const cookieString = cookieKeys.map(name => {
        return (cookiesAsString.indexOf(`${name}=${cookies[name]}`) > -1) ?
            `${name}=${cookies[name]}` :
            `${name}=${encodeURIComponent(cookies[name])}`;
    }).reduce((acc, next) => {
        return `${acc}; ${next}`;
    });

    if (cookieString.length > LOGGING_COOKIES_SIZE) {
        logger.warn(`We might see API issues as cookie size is greater than ${LOGGING_COOKIES_SIZE}`);
    }

    return cookieString;
}

function mapApiResponseToApiOptions(request, apiResponseHeaders, apiOptions = {}) {

    // we don't want to do default parameters here
    // because we want to just return if there are no headers to map over
    if (!apiResponseHeaders) {
        return;
    }

    const cookies = getHeader(apiResponseHeaders, 'Set-Cookie');

    if (cookies && cookies.length > 0) {
        cookies.map(cookie => {
            const cookieParts = cookie.split(';');

            return cookieParts[0];
        }).map(cookie => {
            const cookieParts = cookie.split('=');

            return {
                name: cookieParts[0],
                value: cookieParts[1]
            };
        }).forEach(cookie => {
            request.cookies[cookie.name] = cookie.value;
            apiOptions.headers['Cookie'][cookie.name] = cookie.value;
        });
    }
}

function shouldRedirect(apiResponseData) {
    const results = {
        newLoc: undefined,
        headers: undefined,
        redirectType: undefined
    };

    if (!apiResponseData) {
        return results;
    }

    // this is mostly called after calling URL mapping
    // in the event that URL mapping ends up returning headers
    // we have to return the headers up
    if (apiResponseData.headers) {
        results.headers = apiResponseData.headers;
    }

    const data = ((apiResponseData.data) ?
        safelyParse(apiResponseData.data) :
        safelyParse(apiResponseData)) || {};

    results.newLoc = data.targetUrl;
    results.redirectType = data.redirectType;

    return results;
}

function redirectMappingURL(apiPath, ref) {
    let redirectUrl = apiPath.substring(1);

    if (ref) {
        redirectUrl += encodeURIComponent('?ref=' + ref);
    }

    return redirectUrl;
}

// filter params for category and brand pages
//
// these params for brands and shop should end up in
// request.query or request.apiOptions.parseQuery
// - node
// - currentPage
// - pageSize
// - ph
// - pl
// - ref
// - sortBy
function filterParams(params, allowed = ALLOWED_FILTERS_SERVER) {

    if (!params) {
        return '';
    }

    if (params.pageSize) {
        params.pageSize = PAGE_SIZE;
    }

    // Remove any upper funnel filters as we don't want that to be passed
    // to BXS and Constructor when API is called server side
    if (params.ref) {
        const allFilters = `${params.ref}`.split(',');
        const filtersWithoutUpperFunnel = allFilters.filter(filter => {
            const filterKey = filter.split('=')[0];

            return !UPPER_FUNNEL_REFINEMENTS.includes(filterKey);
        });

        if (!filtersWithoutUpperFunnel.length) {
            delete params.ref;
        } else {
            params.ref = filtersWithoutUpperFunnel;
        }
    }

    const keys = Object.keys(params);

    if (keys.length <= 0) {
        return '';
    }

    const sortedFilter = Object.keys(params).sort((a, b) => {
        return (a.toLowerCase() === b.toLowerCase());
    }).filter(key => {
        return allowed.includes(key);
    });

    if (sortedFilter.length <= 0) {
        return '';
    }

    const filterArray = sortedFilter.map(key => {
        const refsWithSpaceEncoded = (validateQueryParams(key, params[key], ALLOWED_FILTERS_SERVER)) ? (key === 'ref') ?
            encodeURIComponent(params[key]) :
            params[key] : '';

        return refsWithSpaceEncoded !== '' ? `${key}=${refsWithSpaceEncoded}` : '';
    }).filter(val => val !== '');

    return filterArray.length ? filterArray.reduce((acc, next) => {
        return `${acc}&${next}`;
    }) : '';
}

function getBodyBuffer(request) {
    const postData = (request.bodyBuffers && request.bodyBuffers.length > 0 ?
        decoder.write(Buffer.concat(request.bodyBuffers)) : '');

    return postData;
}

export {
    shouldRedirect,
    filterParams,
    mapApiResponseToApiOptions,
    redirectMappingURL,
    cookiesToString,
    getBodyBuffer
};
