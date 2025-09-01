/* eslint-disable object-curly-newline, prefer-promise-reject-errors */
import {
    resolve,
    basename
} from 'path';

import {
    getAPIHeaders
} from '#server/services/utils/apiHeaders.mjs';
import {
    makeSecureRequest,
    makeNoneSecureRequest,
    getMetrics,
    simpleCache
} from '#server/framework/services/apiUtils/makeRequest.mjs';
import {
    getApiOptions
} from '#server/framework/services/apiUtils/getOptions.mjs';
import {
    getError,
    sleep
} from '#server/utils/serverUtils.mjs';
import {
    MAX_ECONNRESET_RETRY_COUNT,
    MAX_API_RETRY_COUNT,
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

function apiPost(method, url, _headers = {}, options = {}, _body) {

    const err = new Error(`ATG ${method} method is NO longer valid for ${url}`);
    const error = {
        err: getError(err),
        url: options.path,
        data: '',
        statusCode: 501,
        inputUrl: '',
        callTime: 0,
        'request-id': options?.headers?.['request-id'],
        'x-requested-source': options?.headers?.['x-requested-source']
    };

    return Promise.reject(error);
}

function apiGet(url, headers = {}, options = {}) {
    return apiPost('GET', url, headers, options);
}

function doRetryRequest(handler, url, options = {}, headers = {}) {

    let attempts = 0;

    function doOneRequest() {
        async function catchBlock(err) {
            attempts++;

            if (attempts < MAX_API_RETRY_COUNT) {
                logger.warn(`API call failed, (Using ${MAX_API_RETRY_COUNT}). Trying the request again to ${url}`);

                return doOneRequest();
            } else if (options.retryCount && attempts < options.retryCount && options.retryResponseCodes &&
                Array.isArray(options.retryResponseCodes) && options.retryResponseCodes.includes(err.statusCode)) {
                logger.warn(`API call failed with responseCode:'${err.statusCode}', (Using ${options.retryCount}). Trying the request again to ${url}`);

                return doOneRequest();
            } else if (options.retryCount && attempts < options.retryCount && !options.retryResponseCodes) {
                logger.warn(`API call failed, (Using ${options.retryCount}). Trying the request again to ${url}`);

                return doOneRequest();
            } else if (err) {
                if (err.err && attempts < MAX_ECONNRESET_RETRY_COUNT &&
                    (err.err.includes('socket hang up') || err.err.includes('ECONNRESET'))) {

                    logger.warn(`Socket hang up error: ${err.err}  will retry again to ${url}`);
                    // 10ms sleepy time
                    await sleep(10);

                    return doOneRequest();
                } else {
                    // makeRequest.js dumps log we don't need this
                    logger.verbose(`API calls resulted in an error: ${getError(err)}`);

                    return Promise.reject(err);
                }
            } else {
                // in the event that we have no err object we handle this semi gracefully
                const message = `API calls resulted in an unknown error while calling API ${url}`;
                logger.error(message);

                return Promise.reject({
                    errMsg: message,
                    statusCode: 520,
                    url: url,
                    headers: headers
                });
            }
        }

        return handler().catch(catchBlock);
    }

    return doOneRequest();
}

function ufeGet(url, headers = {}, options = {}) {

    const handler = () => {
        return apiPost('GET', url, headers, options);
    };

    return doRetryRequest(handler, url, options, headers);
}

async function httpsRequest(host, port, urlPath, method = 'GET', apiOptions = {}, postdata, headersIn = {}) {

    const headers = Object.assign({}, headersIn, getAPIHeaders());
    const options = getApiOptions(host, port, urlPath, method, apiOptions, headers);

    const handler = () => {
        return makeSecureRequest(options, postdata, apiOptions.url);
    };

    return doRetryRequest(handler, urlPath, options, headers);
}

async function httpRequest(host, port, urlPath, method = 'GET', apiOptions = {}, postdata, headersIn = {}) {

    const headers = Object.assign({}, headersIn, getAPIHeaders());
    const options = getApiOptions(host, port, urlPath, method, apiOptions, headers);

    const handler = () => {
        return makeNoneSecureRequest(options, postdata, apiOptions.url);
    };

    return doRetryRequest(handler, urlPath, options, headers);

}

async function sdnGraphQLRequest(apiOptions = {}, postdata, headers = {}, method='POST', graphQLUrl = '/v1/graph') {

    const options = getApiOptions(SDN_API_HOST, SDN_API_PORT, graphQLUrl, method, apiOptions, headers);

    const handler = () => {
        return makeSecureRequest(options, postdata, apiOptions.url);
    };

    return doRetryRequest(handler, graphQLUrl, options, headers);
}

function flushCache(partialKeys) {
    if (partialKeys) {
        simpleCache.purgeByPartialKey(partialKeys);
    } else {
        simpleCache.flush();
    }
}

function apiMetrics() {
    return Object.assign({}, getMetrics(), simpleCache.getMetrics());
}

export {
    apiPost,
    apiGet,
    ufeGet,
    httpsRequest,
    httpRequest,
    sdnGraphQLRequest,
    apiMetrics,
    flushCache
};
