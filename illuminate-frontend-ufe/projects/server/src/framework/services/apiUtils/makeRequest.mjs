/* eslint-disable object-curly-newline, prefer-promise-reject-errors, complexity */
import {
    resolve,
    basename
} from 'path';

import {
    CACHE_ENABLED,
    getCacheItem,
    isGETRequest
} from '#server/framework/services/apiUtils/getCacheKey.mjs';
import SimpleCache from '#server/services/utils/SimpleCache.mjs';
import {
    setupCounter,
    setupHistogram
} from '#server/libs/prometheusMetrics.mjs';
import WebRequest from '#server/framework/services/net/WebRequest.mjs';
import {
    addHeader,
    getHeader
} from '#server/utils/responseHeaders.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    stringifyMsg,
    getMax,
    getError
} from '#server/utils/serverUtils.mjs';
import {
    COOKIES_NAMES
} from '#server/services/utils/Constants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

// 0.1 is 100ms
const MAX_RESPONSE_TIME = 0.1,
    MAX_RESPONSE_DISPLAY_TIME = MAX_RESPONSE_TIME * 1000;

const simpleCache = new SimpleCache();

let apiCallCounts = 0,
    apiFailedErrorCounts = 0,
    apiErrorCounts = 0,
    apiSuccessCounts = 0,
    apiCacheHits = 0,
    totalHttpSocketCount = 0,
    totalHttpsSocketCount = 0,
    apiCallQueues = {
        http: 0,
        https: 0,
        httpSockets: 0,
        httpsSockets: 0,
        httpFreeSockets: 0,
        httpsFreeSockets: 0
    };

const {
    SITE_LANGUAGE,
    SITE_LOCALE
} = COOKIES_NAMES;

const API_DURATIONS = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.75, 1];

const apiRequestDurationMicroseconds = setupHistogram('api_processing_time',
        'Duration of API requests in microseconds', API_DURATIONS),
    apiRequestCounts = setupCounter('api_call_counts', 'Count of API requests'),
    slowapiSuccessRequestCounts = setupCounter('slow_api_success_call_counts', 'Count of API requests'),
    slowapiErrorRequestCounts = setupCounter('slow_api_error_call_counts', 'Count of API requests');

const flattenError = err => {
    return (err?.err ? getError(err.err) : getError(err) || 'API responded with an unknown error!');
};

function logAPICalls(callTime, url, hostname, isError, headers = {}, resObj, inputPath) {
    const requestId = headers['request-id'];

    if (callTime > MAX_RESPONSE_TIME || isError) {

        const msg = {
            'API_response': {
                'status': isError ? 'ERROR ' : 'Success',
                'url': url,
                'inUrl': inputPath,
                'hostname': hostname,
                'slow_processing_time_limit': `${MAX_RESPONSE_DISPLAY_TIME}ms`,
                'processing-time-took': callTime,
                'statusCode': resObj?.statusCode,
                'request-id': requestId,
                'responseDataLength': resObj?.data?.length || 0,
                'x-requested-source': headers['x-requested-source'],
                'correlationId': getHeader(resObj?.headers, 'correlationId') || ''
            }
        };
        if (isError) {
            msg.err = flattenError(isError);
            msg['API_response']['headersInSize'] = stringifyMsg(headers).length;
            if (msg.statusCode === 404 || msg.statusCode === 301 || msg.statusCode === 302) {
                logger.warn(stringifyMsg(msg));
            } else {
                logger.error(stringifyMsg(msg));
            }
            slowapiErrorRequestCounts.inc();
        } else {
            logger.warn(stringifyMsg(msg));
            slowapiSuccessRequestCounts.inc();
        }
    }
}

function filterCookies(cookie) {
    return (cookie.includes(SITE_LOCALE) || cookie.includes(SITE_LANGUAGE));
}

function filterHeaders(headers, data) {
    const responseHeaders = {};
    const setCookiesResponseHeader = getHeader(headers, 'Set-Cookie');

    if (setCookiesResponseHeader && Array.isArray(setCookiesResponseHeader)) {
        const cacheableCookies = setCookiesResponseHeader.filter(filterCookies);

        if (cacheableCookies.length > 0) {
            addHeader(responseHeaders, 'Set-Cookie', {
                'Set-Cookie': cacheableCookies
            });
        }
    }

    addHeader(responseHeaders, 'Edge-Cache-Tag', headers);
    addHeader(responseHeaders, 'x-frame-options', headers);
    addHeader(responseHeaders, 'content-security-policy', headers);

    return {
        headers: responseHeaders,
        data: data
    };
}

const CLEAN_PATH = /\/(v\d|util|gapi|gway|api(\d*))/g;

function simplifyAPI(apiPath) {

    const questionmarkIndex = apiPath.indexOf('?');
    const urlpath = (questionmarkIndex > -1 ? apiPath.substring(0, questionmarkIndex) : apiPath);

    return urlpath.replace(CLEAN_PATH, '').split('/')[1];
}

function updateMetrics(resObj) {

    totalHttpSocketCount = getMax(totalHttpSocketCount, resObj.totalHttpSocketCount);
    totalHttpsSocketCount = getMax(totalHttpsSocketCount, resObj.totalHttpsSocketCount);
    apiCallQueues.http = getMax(apiCallQueues.http, resObj?.apiCallQueues?.http);
    apiCallQueues.https = getMax(apiCallQueues.https, resObj?.apiCallQueues?.https);
    apiCallQueues.httpSockets = getMax(apiCallQueues.httpSockets, resObj?.apiCallQueues?.httpSockets);
    apiCallQueues.httpsSockets = getMax(apiCallQueues.httpsSockets, resObj?.apiCallQueues?.httpsSockets);
    apiCallQueues.httpFreeSockets = getMax(apiCallQueues.httpFreeSockets, resObj?.apiCallQueues?.httpFreeSockets);
    apiCallQueues.httpsFreeSockets = getMax(apiCallQueues.httpsFreeSockets, resObj?.apiCallQueues?.httpsFreeSockets);
}

function ensureAcceptHeader(options) {
    if (!getHeader(options.headers, 'Accept')) {
        //TODO: to revert this after SDN-3598 will be resolved
        //options.headers['Accept'] = 'application/json;charset=UTF-8';
        options.headers['Accept'] = 'application/json';
    }
}

// this function is a wrapper around WebRequest
// this adds in metric counters and logging slow API responses
async function makeRequest(secure = true, optionsIn = {}, postdata, inputPath) {

    apiCallCounts++;
    apiRequestCounts.inc();

    const {
        isMockedResponse,
        cacheKey,
        cacheTime,
        abTest,
        ...options
    } = optionsIn;

    ensureAcceptHeader(options);

    const trueCacheKey = (cacheKey ? `${cacheKey}${abTest && abTest !== 'false'? '&' + abTest : ''}` : undefined);

    const item = getCacheItem(options, trueCacheKey, isMockedResponse, simpleCache);

    if (CACHE_ENABLED && item) {
        apiCacheHits++;
        apiSuccessCounts++;

        return Promise.resolve(item);
    }

    const hostname = options.hostname || options.host;

    const apiEnd = apiRequestDurationMicroseconds.startTimer();

    const endCallback = (apiPath, statusCode, apiMethod) => {
        apiEnd({
            route: apiPath,
            code: statusCode,
            method: apiMethod
        });
    };

    logger.debug(`API call to url: ${options.path} with options: ${stringifyMsg(options)}.`);
    const [err, results] = await asyncWrapper(WebRequest(secure, options, postdata));

    const simplifiedPath = simplifyAPI(options.path);
    endCallback(simplifiedPath, (results || err || {}).statusCode || 500, options.method);
    const resObj = (results || err || {});
    const callTime = resObj.requestCallTime;
    updateMetrics(resObj);
    logAPICalls(callTime, options.path, hostname, err, options.headers, resObj, inputPath);

    if (err) {
        if (err.failed) {
            apiFailedErrorCounts++;
        } else {
            apiErrorCounts++;
        }

        const errFiltered = Object.assign({}, err, {
            err: flattenError(err),
            url: options.path,
            data: err?.data || '',
            statusCode: err?.statusCode || 502,
            inputUrl: inputPath,
            callTime: callTime,
            'request-id': options.headers['request-id'],
            'x-requested-source': options.headers['x-requested-source']
        });

        // the logAPICalls function will log errors now, so we do no log them twice
        // this helps reduce logging and if we need more we can enable debug
        logger.debug(getError(err));
        return Promise.reject(errFiltered);
    } else {
        apiSuccessCounts++;

        // only caching items that are GET
        if (CACHE_ENABLED && trueCacheKey && cacheTime && isGETRequest(options)) {
            const cachedData = filterHeaders(results.headers, results.data);
            simpleCache.setCache(trueCacheKey, cachedData, cacheTime);
        }

        return Promise.resolve({
            data: results.data,
            url: options.path,
            headers: results.headers,
            statusCode: results.statusCode,
            callTime: callTime
        });
    }
}
// wrapper function for to makeRequest
// this is for making HTTPS requests
async function makeSecureRequest(options = {}, postdata, inputPath) {
    return makeRequest(true, options, postdata, inputPath);
}

// wrapper function for to makeRequest
// this is for making HTTP requests
async function makeNoneSecureRequest(options = {}, postdata, inputPath) {
    return makeRequest(false, options, postdata, inputPath);
}

function getMetrics() {

    const results = {
        apiCallCounts,
        apiErrorCounts,
        apiFailedErrorCounts,
        apiSuccessCounts,
        apiCacheHits,
        totalHttpSocketCount,
        totalHttpsSocketCount,
        apiCallQueues
    };

    apiCallCounts = 0;
    apiFailedErrorCounts = 0;
    apiErrorCounts = 0;
    apiSuccessCounts = 0;
    apiCacheHits = 0;
    totalHttpSocketCount = 0;
    totalHttpsSocketCount = 0;
    apiCallQueues = {
        http: 0,
        https: 0,
        httpSockets: 0,
        httpsSockets: 0,
        httpFreeSockets: 0,
        httpsFreeSockets: 0
    };

    return results;
}

export {
    simpleCache,
    filterHeaders,
    makeRequest,
    makeSecureRequest,
    makeNoneSecureRequest,
    getMetrics
};
