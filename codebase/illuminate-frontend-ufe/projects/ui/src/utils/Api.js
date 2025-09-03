import urlUtils from 'utils/Url';
import headerUtils from 'utils/Headers';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import { CHANNELS } from 'constants/Channels';

const { userXTimestampHeader } = headerUtils;

/**
 *
 * @param method
 * @param url
 * @param body
 * @param params -
 * @param qsParams - array of nvps to be converted in to the querystring.  If multiple querystring
 * entries are needed for the same key, then the nvp should contain:  'key': [arrayOfValues]
 * @param headers
 * @param isMultiPart
 * @returns {{then, catch}}
 */
function request({
    method, url, params = {}, qsParams = {}, headers = {}, isMultiPart = false
}) {
    let body;

    if (!url) {
        throw new Error('Url argument is required!');
    }

    let outputUrl = url;

    if (!method) {
        throw new Error('Method argument is required!');
    }

    if (method === 'POST') {
        if (isMultiPart || typeof params === 'string') {
            body = params;
        } else {
            body = JSON.stringify(params);
        }
    }

    if (Object.keys(qsParams).length) {
        outputUrl += '?' + urlUtils.makeQueryString(qsParams);
    }

    return fetch(outputUrl, {
        method,
        body,
        headers
    });
}

/**
 * API -> state mapping error handler
 * @param {*} error
 */
const handleApiResponseMappingError = error => {
    /*eslint no-console: "off"*/
    console.error(`API RESPONSE -> STATE MAPPING ERROR: ${error}`);
};

/**
 * throws an error
 */
const throwApiError = (obj, path) => {
    throw `API RESPONSE -> STATE MAPPING ERROR
        RESPONSE: ${JSON.stringify(obj)}
        REQUESTED PATH: "${path}"`;
};

/**
 * returns true if property is named, and exist in an object
 * @param {*} obj
 * @param {*} propName
 */
const propExist = (obj, propName) => obj instanceof Object && propName !== '' && propName in obj;

/**
 * finds if the prop of defined depth exists and returns it or throws an error
 * @param {*} rootObj parnt object for path prop search
 * @param {*} pathToVal path for search
 */
const getValOrThrowError = (rootObj, pathToVal) =>
    pathToVal.split('.').reduce((obj, propName) => (propExist(obj, propName) ? obj[propName] : throwApiError(rootObj, pathToVal)), rootObj);

/**
 * returns if the prop of defined depth exists or throws an error
 * @param {*} obj
 * @param {*} path
 */
const isValOrThrowError = (obj, path) => !!getValOrThrowError(obj, path);

function addRwdHeaders(headers = {}) {
    const xTimestamp = userXTimestampHeader();

    headers['x-requested-source'] = CHANNELS.RWD;
    headers['x-timestamp'] = xTimestamp['x-timestamp'];

    return headers;
}

function addBrowseExperienceParams(options, config = {}) {
    const locale = `${localeUtils.getCurrentLanguage().toLowerCase()}-${localeUtils.getCurrentCountry()}`;
    const { service, isSXSSearchEnabled } = config;
    options.loc = locale;
    options.ch = isSXSSearchEnabled ? CHANNELS.RWD : Sephora.channel?.toLowerCase();

    const isATGSearch = service === 'search' && !isSXSSearchEnabled;

    if (isATGSearch) {
        return;
    }

    const preferredStoreInfo = userUtils.getPreferredStoreId();
    const preferredZipCode = userUtils.getZipCode();

    const pickupStoreIdParam = isSXSSearchEnabled ? 'pickupStoreId' : 'preferredStoreId';
    const sddZipcodeParam = isSXSSearchEnabled ? 'sddZipcode' : 'preferredSameDayZipCode';

    if (!options[pickupStoreIdParam] && preferredStoreInfo) {
        options[pickupStoreIdParam] = preferredStoreInfo;
    }

    if (!options[sddZipcodeParam] && preferredZipCode) {
        options[sddZipcodeParam] = preferredZipCode;
    }
}

const getVal = getValOrThrowError;
const isVal = isValOrThrowError;

export default {
    request,
    handleApiResponseMappingError,
    getVal,
    isVal,
    addRwdHeaders,
    addBrowseExperienceParams
};
