/* eslint consistent-return: [0] */

import Location from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import sharedUtils from 'utils/Shared';
import jsUtils from 'utils/javascript';

const CA_EN = '/ca/en';
const CA_FR = '/ca/fr';
const HTTPS = 'https';
const SEPHORA_COM = 'sephora.com';
const TRACKING_PARAM = 'icid2';
const URL_IS_GUEST_PARAM = 'isGuest';

const absolutePathRegExp = /^https?:\/\/|^\/\//i;
const protocolRegExp = /^https?:/i;
const localHostedPrefixRegExp = /^\/img\//i;
const captchaRegExp = /^\/challenge.png/i;
const rootRelativeLinkRegExp = /^\/[^/]+/i;
const fullLinkRegExp = /((?:^(?:https?:)?\/\/)?(.*)(?:\.sephora\.com(?:\.[a-z]+)?))(.*)/i;
const isSEOForCanadaRegExp = new RegExp(`^(${CA_EN}|${CA_FR})`);

function getImgFixURL() {
    return Sephora.configurationSettings ? Sephora.configurationSettings.imgFixURL : '';
}

// eslint-disable-next-line no-unused-vars
function isAbsoluteUrl(url) {
    return absolutePathRegExp.test(url);
}

function isImageHostedBySelf(url) {
    return localHostedPrefixRegExp.test(url) || captchaRegExp.test(url);
}

/**
 * Builds a query string out of a Map. If multiple values are included
 * for the same param, then they should be separate items in the array.
 *
 * @param {map} queryParams - Map with query params
 * @returns {string} - query string
 */
function buildQuery(queryParams) {
    const paramPairs = [];

    queryParams.forEach((value, key) => {
        let curPair;

        if (Array.isArray(value)) {
            const uniqueVals = Array.from(new Set(value)); // remove dublicates
            curPair = uniqueVals.length ? [key, uniqueVals.join(',')] : undefined;
        } else if (value !== '') {
            curPair = [key, value];
        }

        if (curPair) {
            paramPairs.push(curPair);
        }
    });

    const params = paramPairs.map(one => one.join('='));

    const queryString = params.length === 0 ? '' : '?' + params.join('&');

    return queryString;
}

function getUrlLastFragment(urlPath = Location.getLocation().pathname) {
    const pathArray = urlPath.split('/');

    return pathArray[pathArray.length - 1];
}

/*
 * Returns an array containing all values that were extracted from params.
 * For instance, for (null, '20', true), it returns ['20']
 * For (['15', '12'], '20', true) it returns ['15', '12', '20']
 * For ([], '21,15,23') it returns ['21', '15', '23']
 */

/* eslint-disable no-param-reassign */
function formatParams(existingValue, value, shouldDecode) {
    existingValue = existingValue ? existingValue : [];
    value = shouldDecode ? decodeURIComponent(value) : value;

    if (value.toString().indexOf(',') > -1) {
        value = value.split(',');
    } else {
        value = [value];
    }

    if (!Array.isArray(existingValue)) {
        existingValue = [existingValue];
    }

    return existingValue.concat(value);
}
/* eslint-enable no-param-reassign */

/**
 * Returns an object containing all params as queryParamKey:[array of values]
 */
function getParams(urlSearch = Location.getLocation().search, nonDecodingParams = ['keyword', 'p13n']) {
    const params = {};
    const queryParamRegexp = /([^?&]\w*)=([^&]*)/g;

    let result;

    while ((result = queryParamRegexp.exec(urlSearch))) {
        // eslint-disable-line no-cond-assign
        const key = result[1];
        const value = result[2];
        const shouldDecode = nonDecodingParams.indexOf(key) === -1;
        const existingValue = params[key];
        const validatedParam = sharedUtils.validateQueryParams(key, value, sharedUtils.ALLOWED_FILTERS_BROWSER);
        const skipParams = sharedUtils.ALLOWED_FILTERS_BROWSER.indexOf(key) !== -1 && !validatedParam;

        if (!skipParams) {
            params[key] = formatParams(existingValue, value, shouldDecode);
        }
    }

    return params;
}

var urlUtils = {
    CA_EN: CA_EN,
    CA_FR: CA_FR,
    HTTPS: HTTPS,
    SEPHORA_COM: SEPHORA_COM,
    TRACKING_PARAM: TRACKING_PARAM,
    getUrlLastFragment: getUrlLastFragment,
    getParams: getParams,
    formatParams: formatParams,

    /**
     * Add a parameter to an existing URL after any existing parameters
     * but before a hash tag if one exists.
     * @param {string} url        The url to add to
     * @param {string} paramToAdd The parameter to add
     * @return {string} The original url with the new param added to it
     */
    addParam: function (url, paramName, value) {
        if (typeof url !== 'string') {
            return url;
        }

        let urlStr = url;

        var parts = urlStr.split('#');
        var delimiter;
        var paramToAdd = paramName + '=' + (value || '').toLowerCase();

        if (parts.length < 3) {
            delimiter = parts[0].indexOf('?') !== -1 ? '&' : '?';
            urlStr = parts[0] + delimiter + paramToAdd + (parts[1] ? '#' + parts[1] : '');
        }

        return urlStr;
    },

    /**
     * Remove parameter from existing URL
     * @param {string} url        The url to remove from
     * @param {string} paramToRemove The parameter to remove
     */
    removeParam: function (url, paramToRemove) {
        if (typeof url !== 'string') {
            return url;
        }

        var parts = url.split('#');

        if (parts.length < 3 && parts.length) {
            const hostUrl = parts[0].split('?')[0];
            const urlParams = getParams(parts[0]) || {};
            delete urlParams[paramToRemove];

            return hostUrl + buildQuery(jsUtils.buildMap(urlParams)) + (parts.length === 2 ? '#' + parts[1] : '');
        }

        return url;
    },

    getTrackingValue: function (values = []) {
        return values.join(':');
    },

    addInternalTracking: function (url, values = []) {
        // If params are not passed properly, we may get [undefined]
        // and do not want to add internal tracking
        const arrayOfUndefined = values.length === 1 && typeof values[0] === 'undefined';

        if (!values.length || arrayOfUndefined) {
            return url;
        }

        const trackingValue = urlUtils.getTrackingValue(values);

        return urlUtils.addParam(url, TRACKING_PARAM, trackingValue);
    },

    buildQuery,

    SEOForCanadaPages: [
        '', // = url '/'
        'shop',
        'product',
        'beauty',
        'brand',
        'beauty-offers',
        'stores',
        'brands-list',
        'sale',
        'buy'
    ],

    SEOForCanadaExcludedSubdomains: ['api', 'chat', 'chat.qa', 'community', 'community.qa', 'hairtutorial', 'jobs', 'theglossy'],

    getLink: function (link, internalTracking) {
        if (typeof link !== 'string') {
            return link;
        }

        let linkStr = link;

        if (Sephora.isSEOForCanadaEnabled && localeUtils.isCanada()) {
            let host, path;

            if (linkStr === '/' || linkStr.match(rootRelativeLinkRegExp)) {
                host = '';
                path = linkStr;
            } else {
                const match = linkStr.match(fullLinkRegExp);

                if (match && urlUtils.SEOForCanadaExcludedSubdomains.indexOf(match[2]) === -1) {
                    host = match[1];
                    path = match[3] || '/';
                }
            }

            if (host !== undefined) {
                linkStr = urlUtils.addSEOForCanadaPrefixToLink(host, path);
            }
        }

        if (internalTracking) {
            linkStr = urlUtils.addInternalTracking(linkStr, internalTracking);
        }

        return linkStr;
    },

    addSEOForCanadaPrefixToLink: function (host = '', path) {
        if (!path) {
            return host;
        }

        let prefix = '';
        const isAlreadySEOForCanada = path.match(isSEOForCanadaRegExp) !== null;

        if (!isAlreadySEOForCanada) {
            const isFrench = localeUtils.isFrench();
            const defaultPrefix = isFrench ? CA_FR : CA_EN;

            // Default prefix for root path or empty first segment
            if (path === '/' || path.split('/')[1] === '') {
                prefix = defaultPrefix;
            } else {
                const pathParts = path.split('/');
                let firstPathSegment = pathParts[1];

                if (firstPathSegment && firstPathSegment.split('?').length > 0) {
                    firstPathSegment = firstPathSegment.split('?')[0];
                }

                // Add prefix if first segment is in whitelist or if it's a non-excluded subdomain
                if (!firstPathSegment || urlUtils.SEOForCanadaPages.indexOf(firstPathSegment) !== -1) {
                    prefix = defaultPrefix;
                }
            }
        }

        return host + prefix + path;
    },

    isSEOForCanadaRegExp,

    getParamValueAsSingleString: (name, url = null) => {
        const valueAsArray = urlUtils.getParamsByName(name, url);

        return (valueAsArray || []).join();
    },

    getParamsByName: function (name, url) {
        const urlOutput = url || Location.getLocation().search;

        return getParams(urlOutput)[name];
    },

    isAbsoluteUrl: function (url) {
        return !!url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0);
    },

    isDataUrl: function (url) {
        return !!url && url.indexOf('data:') === 0;
    },

    getImagePath: function (url) {
        return urlUtils.isAbsoluteUrl(url) || urlUtils.isDataUrl(url) || isImageHostedBySelf(url)
            ? url
            : (getImgFixURL() || '') + (urlUtils.getLink(url) || '').replace(protocolRegExp, '');
    },

    /**
     * Function is created to be able to mock this call for unit-tests,
     * otherwise your tests will fail with attempt of reload the page
     */
    redirectTo: function (url) {
        window.location = url;
    },

    openLinkInNewTab: function (url, features) {
        window.open(url, '_blank', features);
    },

    /**
     * Converts an object into a query parameters string
     * @param  {Object} params - The object to be converted to a query string
     * @return {String} - The query string
     */
    makeQueryString: function (params) {
        const pairs = [];

        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const value = params[key];

                if (Array.isArray(value)) {
                    value.forEach(subValue => {
                        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(subValue));
                    });
                } else if (value !== undefined) {
                    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            }
        }

        return pairs.join('&');
    },

    /**
     * Function created so document referrer can be stubbed in unit tests
     */
    getDocumentReferrer: function () {
        return document.referrer;
    },

    /**
     * Converts a HTTP url to HTTPS
     */
    convertUrlToHTTPS: function (url) {
        if (urlUtils.isAbsoluteUrl(url) && protocolRegExp.exec(url)[0] === 'http:') {
            return `${url.substring(0, 4)}s${url.substring(4)}`;
        } else {
            return url;
        }
    },

    /**
     * Returns an array with the strings between / in the URL path
     * @return {Array} - Strings between /
     * '/happening/classes/OLR_123ASD' = ['', 'happening', 'classes', 'OLR_123ASD']
     */
    getPathStrings: function () {
        return Location.getLocation().pathname.split('/');
    },

    /**
     * @param {object} address - Store address object
     * @return {string} - Google directions url, from current location to the address
     */
    getDirectionsUrl: function (address) {
        return (
            'https://www.google.com/maps/dir/current+location/Sephora,+' +
            address.address1.replace(/ /g, '+') +
            ',+' +
            address.city.replace(/ /g, '+') +
            ',+' +
            address.state +
            '+' +
            address.postalCode
        );
    },

    getAccessPointDirectionsUrl: ({ addressLine1, city, state, zipCode }) => {
        return (
            'https://www.google.com/maps/dir/current+location/' +
            addressLine1.replace(/ /g, '+') +
            ',+' +
            city.replace(/ /g, '+') +
            ',+' +
            state +
            '+' +
            zipCode
        );
    },

    /**
     * returns '/ca/fr' or '/ca/en' or '' depending on locale
     */
    getLocalePathPrefix: function () {
        const isCanada = localeUtils.isCanada();
        const isFrench = localeUtils.isFrench();

        return isCanada ? '/ca' + (isFrench ? '/fr' : '/en') : '';
    },

    /**
     *
     * @param {*} path absolute path starting from /
     */
    getFullPathFromAbsolute: function (path) {
        return HTTPS + '://www.' + SEPHORA_COM + this.getLocalePathPrefix() + path;
    },

    isSiteTraining: function () {
        return window.location.hostname.includes('sitetraining');
    },

    isValidImageUrl: function (url) {
        return !!url && url.includes('https://') && url.includes('sephora.com');
    },

    getIsGuestParamValue: function () {
        const isGuestEventServicesEnabled = Sephora.configurationSettings.isGuestEventServicesEnabled;

        if (!isGuestEventServicesEnabled) {
            return false;
        }

        const isGuestParamValue = urlUtils.getParamsByName(URL_IS_GUEST_PARAM)?.[0];
        const isGuest = typeof isGuestParamValue === 'string' && isGuestParamValue?.toLowerCase() === 'true';

        return isGuest;
    }
};

export default urlUtils;
