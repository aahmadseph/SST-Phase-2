/* eslint object-curly-newline: 0, complexity: [ 0 ] */
import {
    resolve,
    basename
} from 'path';
import process from 'node:process';
import {
    EOL
} from 'node:os';

import * as redisWrapperFile from '#server/services/utils/redisWrapper.mjs';
import {
    setupCounter,
    setupHistogram,
    simplifyRoute
} from '#server/libs/prometheusMetrics.mjs';

import getOptions from '#server/framework/services/ufe/getOptions.mjs';
import {
    getHash,
    getUrlPath
} from '#server/framework/services/ufe/utils.mjs';
import {
    callUfe,
    getCallMetrics
} from '#server/framework/services/ufe/callUfe.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    sendOKResponse
} from '#server/utils/sendOKResponse.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    removeHeader,
    addHeader,
    getHTMLContentType
} from '#server/utils/responseHeaders.mjs';
import {
    getDiffTime,
    stringifyMsg,
    getMax
} from '#server/utils/serverUtils.mjs';
import {
    BUILD_INFO,
    BUILD_NUMBER_STRING,
    UFE_SLOW_TIME
} from '#server/config/envConfig.mjs';
import {
    ENABLE_CONFIGURATION_UPDATE,
    DUMP_HASH_MISSES_DATA,
    ENABLE_REDIS,
    ENABLE_EMBEDDED_UFE,
    UFE_COMPRESSION_TYPE
} from '#server/config/envRouterConfig.mjs';
import {
    getServerStatus
} from '#server/framework/ufe/status.mjs';
import {
    setupWorkers,
    sendToRenderWorker
} from '#server/framework/ufe/ufeManager.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const {
    GIT_BRANCH
} = BUILD_INFO;

let redisWrapper,
    fetch,
    setItem;

if (ENABLE_REDIS) {
    redisWrapper = redisWrapperFile;
    redisWrapper.setupRedis();
    fetch = redisWrapper.fetch;
    setItem = redisWrapper.setItem;
} else {
    redisWrapper = {
        isRedisEnabled: () => {
            return false;
        }
    };
}

if (ENABLE_EMBEDDED_UFE) {
    setupWorkers();
}

let ufeServiceCallerMaxTime = 0;

function getUFEMetrics() {

    const results = Object.assign({
        ufeServiceCallerMaxTime
    }, getCallMetrics());

    ufeServiceCallerMaxTime = 0;

    if (ENABLE_EMBEDDED_UFE) {
        results.ufeStatus = getServerStatus(BUILD_INFO, true);
    }

    return results;
}

const callDurationMicroseconds = setupHistogram('ufe_servicecaller_time', 'Duration of UFE service caller in microseconds'),
    ufeREDISConnectionErrorCounts = setupCounter('ufe_service_caller_redis_errors', 'Counter for REDIS connection errors');

function validateParams(channel, country, language, responseHeaders, inUrlPath) {
    if (!channel || !country || !language) {
        logger.error(`Warning calling UFE without all required params Channel: ${channel} Country: ${country} Language: ${language} for URL: ${inUrlPath}`);
    }

    if (!responseHeaders) {
        logger.warn(`No response headers passed into ufeServiceCaller for ${inUrlPath}!`);
    }
}

function logSlowCalls(responseTime, headers) {
    if (responseTime > UFE_SLOW_TIME) {
        logger.warn(`SUCCESS from UFE response took: ${responseTime} request-id: ${headers['request-id']}`);
    }
}

function checkMockedResponse(paramsString, isMockedResponse) {

    let result;

    if (paramsString && isMockedResponse) {
        result = `${paramsString}&mocked=true`;
    } else if (paramsString) {
        result = paramsString;
    } else if (isMockedResponse) {
        result = '&mocked=true';
    }

    return result;
}

function setContentType(headers, mergedHeaders) {
    removeHeader(headers, 'Content-Type');
    removeHeader(mergedHeaders, 'Content-Type');
    addHeader(headers, 'Content-Type', getHTMLContentType());
}

async function ufeServiceCaller(inUrlPath, data, responseHandle, nsOptions = {}) {

    const startTime = process.hrtime();
    const callEnd = callDurationMicroseconds.startTimer();

    const {
        abTest,
        channel,
        country,
        language,
        cacheable,
        isMockedResponse,
        paramsString,
        responseHeaders,
        headers
    } = nsOptions;

    validateParams(channel, country, language, responseHeaders, inUrlPath);

    let stringData = stringifyMsg(data);

    // we either have a hash or we are not caching the data
    const isCacheable = cacheable && ENABLE_CONFIGURATION_UPDATE;
    const hash = (isCacheable ? `hash=${getHash(stringData)}&` : 'dontCache=true&');

    const urlParameters = checkMockedResponse(paramsString, isMockedResponse);

    // url path for UFE with hash
    const urlPath = getUrlPath(hash, inUrlPath, abTest, channel, country, language, urlParameters);

    // url path without hash for REDIS as hash is part of data in redis not key
    const redisUrlPath = getUrlPath(undefined, inUrlPath, abTest, channel, country, language, urlParameters);

    logger.debug(`Entering the node service caller ${urlPath}`);

    // adding build number into cache key for aks pod scaling in lower envs
    const redisKey = `${redisUrlPath}&bn=${BUILD_NUMBER_STRING}`;

    if (isCacheable && ENABLE_REDIS) {

        if (redisWrapper.isRedisEnabled()) {

            // here is wher we would call redis
            const result = await fetch(redisKey, hash);

            if (result) {
                // done with this stuff
                stringData = null;
                // don't need url path for this
                const compressType = (result.compressed ? UFE_COMPRESSION_TYPE : false);
                responseHandle.callUfeTime = 0;
                setContentType(headers, responseHeaders);
                sendOKResponse(headers, '', responseHandle,
                    result.html, false, compressType, responseHeaders);
                // we don't need this data anymore
                logger.verbose(`Serving data from redis cache ${urlPath}`);
                ufeServiceCallerMaxTime = getMax(ufeServiceCallerMaxTime, getDiffTime(startTime));
                callEnd({
                    route: simplifyRoute(urlPath),
                    code: 200,
                    method: 'GET'
                });

                return;
            }

            if (DUMP_HASH_MISSES_DATA) {
                process.stdout.write(`Hash: ${hash.replace('hash=', '').replace('&', '')} URL: ${redisKey} Build: ${BUILD_NUMBER_STRING} ${EOL}`);
                process.stdout.write(`${stringifyMsg(data)} ${EOL}`);
            }
        } else {
            ufeREDISConnectionErrorCounts.inc();
            logger.warn('Redis is enabled but client is not connected or ready, wont call get!');
        }
    }

    const options = getOptions(urlPath);
    options.headers['request-id'] = headers['request-id'];
    options.headers['x-build-number'] = BUILD_NUMBER_STRING;

    if (headers) {
        if (headers['x-akamweb']) {
            options.headers['x-akamweb'] = headers['x-akamweb'];
        } else if (headers.Cookie && headers.Cookie['akamweb']) {
            options.headers['x-akamweb'] = headers.Cookie['akamweb'];
        }
    }

    if (!options.headers['x-akamweb']) {
        logger.warn('No x-akamweb header! If UFE is in single AKS app, we could see problems!');
    }

    const [err, renderedResults] = ENABLE_EMBEDDED_UFE ?
        await asyncWrapper(sendToRenderWorker(options, stringData)) :
        await asyncWrapper(callUfe(options, stringData));
    // we don't need this data anymore
    stringData = null;

    if (renderedResults && renderedResults.data) {
        const renderedHtml = renderedResults.data;

        if (isCacheable && ENABLE_REDIS) {
            if (redisWrapper.isRedisEnabled()) {
                logger.debug('Before setItem');
                setItem(redisKey, {
                    'hashKey': hash,
                    'html': renderedHtml,
                    'compressed': UFE_COMPRESSION_TYPE,
                    'buildNumber': BUILD_NUMBER_STRING,
                    'gitBranch': GIT_BRANCH
                });
                logger.debug('After setItem');
            } else if (!redisWrapper.isRedisEnabled()) {
                ufeREDISConnectionErrorCounts.inc();
                logger.warn('Redis is enabled but client is not connected or ready, wont call set!');
            }
        }

        const mergedHeaders = Object.assign({}, responseHeaders, responseHandle.getHeaders());
        responseHandle.callUfeTime = renderedResults.requestCallTime;
        setContentType(headers, mergedHeaders);
        sendOKResponse(headers, urlPath, responseHandle,
            renderedHtml, false, true, mergedHeaders);
        const responseTime = getDiffTime(startTime);
        logSlowCalls(responseTime, headers);
        ufeServiceCallerMaxTime = getMax(ufeServiceCallerMaxTime, responseTime);
        logger.debug(`UFE call timing took ${getDiffTime(startTime)}`);
        callEnd({
            route: simplifyRoute(urlPath),
            code: 200,
            method: 'GET'
        });
    } else {
        // error
        logger.error(`Error processing URL: ${urlPath} UFE responsed with error: ${err?.message || stringifyMsg(err)}`);
        const responseTime = getDiffTime(startTime);
        logSlowCalls(responseTime, headers);
        ufeServiceCallerMaxTime = getMax(ufeServiceCallerMaxTime, responseTime);
        callEnd({
            route: simplifyRoute(urlPath),
            code: err?.statusCode || 500,
            method: 'GET'
        });
        responseHandle.callUfeTime = err?.requestCallTime;

        if (err?.statusCode && err?.statusCode === 404) {
            sendTempRedirect(responseHandle, stringifyMsg(err));
        } else {
            sendErrorResponse(responseHandle, stringifyMsg(err));
        }
    }
}

export {
    ufeServiceCaller,
    getUFEMetrics
};
