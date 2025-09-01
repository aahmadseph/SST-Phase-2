/* eslint-disable object-curly-newline, prefer-promise-reject-errors */
import path from 'path';
import process from 'node:process';

import {
    createGzip,
    createGunzip
} from 'node:zlib';
import {
    request as httpsRequest,
    Agent as httpsAgent
} from 'node:https';
import {
    request as httpRequest,
    Agent as httpAgent
} from 'node:http';

import {
    WritableStream
} from '#server/libs/WritableStream.mjs';
import StringToStream from '#server/libs/StringToStream.mjs';
import {
    FRAMEWORK_CONSTANTS as Constants,
    MAX_REQUEST_SIZE
} from '#server/config/envConfig.mjs';
import {
    getDiffTime,
    stringifyMsg,
    getError
} from '#server/utils/serverUtils.mjs';
import {
    ENABLE_AGENT,
    ENABLE_AGENT_KEEPALIVE,
    KEEPALIVE_TIMEOUT,
    MAX_API_SOCKETS
} from '#server/config/envRouterConfig.mjs';

const filename = path.basename(path.resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

const AGENT_OPTIONS = {
    'keepAlive': ENABLE_AGENT_KEEPALIVE,
    'keepAliveMsecs': KEEPALIVE_TIMEOUT,
    'maxSockets': MAX_API_SOCKETS,
    'maxTotalSockets': (MAX_API_SOCKETS * 2),
    'maxFreeSockets': Math.floor(MAX_API_SOCKETS * 0.4)
};

// KEEPALIVE_TIMEOUT is in milliseconds so we divide by 1000 to get seconds
// then we take ceil so if it is 2.5 we get 3 seconds
// then we add a buffer of 2 second for total of 5
const HEADER_KEEPALIVE_TIMEOUT = 2 + Math.ceil(KEEPALIVE_TIMEOUT / 1000);

// if MAX_API_SOCKETS is set to 0 then this will be 10
// if MAX_API_SOCKETS is 500 then this will be 60
// if MAX_API_SOCKETS is 100 then this will be 20
const HEADER_REUSE_SOCKET_COUNT = Math.ceil((MAX_API_SOCKETS + 100) / 10);

const httpAgentImpl = new httpAgent(AGENT_OPTIONS);
const httpsAgentImpl = new httpsAgent(AGENT_OPTIONS);

function gatherKeys(socketsIn = {}) {
    return Object.keys(socketsIn).map(key => {
        return socketsIn[key].length;
    }).reduce((acc, next) => {
        return +acc + +next;
    }, 0);
}

const getAgentQueues = () => {
    return {
        http: gatherKeys(httpAgentImpl.requests),
        https: gatherKeys(httpsAgentImpl.requests),
        httpSockets: gatherKeys(httpAgentImpl.sockets),
        httpsSockets: gatherKeys(httpsAgentImpl.sockets),
        httpFreeSockets: gatherKeys(httpsAgentImpl.freeSockets),
        httpsFreeSockets: gatherKeys(httpsAgentImpl.freeSockets)
    };
};

const getErrorObject = (errObj, resObj = {}, data,
    requestOptions = {}, apiStartTime, compressionTime, compressionError) => {
    return {
        err: errObj,
        method: requestOptions.method,
        hostname: requestOptions.hostname,
        statusCode: resObj.statusCode || 500,
        headers: resObj.headers || {},
        url: resObj.path || requestOptions.path,
        requestCallTime: getDiffTime(apiStartTime),
        failed: true,
        data: data,
        compressionTime,
        compressionError,
        totalHttpSocketCount: httpAgentImpl.totalSocketCount,
        totalHttpsSocketCount: httpsAgentImpl.totalSocketCount,
        apiCallQueues: getAgentQueues()
    };
};

function collectResults(results, returnDataMethod) {
    if (results) {
        try {
            return results[returnDataMethod]();
        } catch (_e) {
            return undefined;
        }
    }
    return undefined;
}

function createRequestOptions(options, secure) {
    const {
        enableAgent = ENABLE_AGENT,
        keepalive = ENABLE_AGENT_KEEPALIVE,
        timeout,
        retryCount,
        retryResponseCodes,
        ...requestOptions
    } = options;

    if (enableAgent) {
        requestOptions.agent = secure ? httpsAgentImpl : httpAgentImpl;
    }
    if (!requestOptions.method) {
        requestOptions.method = 'GET';
    }
    requestOptions.method = requestOptions.method.toUpperCase();

    if (!requestOptions.returnDataMethod) {
        requestOptions.returnDataMethod = 'toString';
    }

    if (!requestOptions.headers) {
        requestOptions.headers = {};
    }

    if (keepalive) {
        requestOptions.headers['Connection'] = 'keep-alive';
        requestOptions.headers['Keep-Alive'] = `timeout=${HEADER_KEEPALIVE_TIMEOUT}, max=${HEADER_REUSE_SOCKET_COUNT}`;
    }

    // filter out headers that have no value
    const cleanedHeaders = Object.keys(requestOptions.headers).filter(hKey => {
        const isEmptyValue = !!requestOptions.headers[hKey];
        if (!isEmptyValue && !hKey.includes('x-akamweb')) {
            logger.warn(`Stripping empty header ${hKey} with value of ${requestOptions.headers[hKey]} for API: ${requestOptions.path}`);
        }
        return isEmptyValue;
    }).map(key => {
        return {
            [key]: requestOptions.headers[key]
        };
    }).reduce((acc, next) => {
        return Object.assign({}, acc, next);
    }, {});
    requestOptions.headers = cleanedHeaders;

    return requestOptions;
}

function handleResponse(res, requestOptions, apiStartTime, compression, resolve, reject) {

    logger.debug(`Response returned status code ${res.statusCode}.`);

    const results = new WritableStream({
        maxRequestSize: (requestOptions.maxRequestSize || MAX_REQUEST_SIZE)
    });
    const isCompressed = !requestOptions.keepCompressed && (
        res.headers[Constants.CONTENT_ENCODING_HEADER_LC]?.includes('gzip') ||
        res.headers[Constants.CONTENT_ENCODING_HEADER]?.includes('gzip')
    );
    const isNot2xx = (res.statusCode < 200 || res.statusCode >= 300);

    const pipes = isCompressed
        ? res.pipe(createGunzip()).pipe(results)
        : res.pipe(results);

    pipes.on('error', (err) => {
        const errObj = isNot2xx
            ? `Response code ${res.statusCode} not 2xx => ${getError(err)}`
            : getError(err);
        res.destroy();
        reject(getErrorObject(errObj, res, undefined, requestOptions,
            apiStartTime, compression.compressionTime, compression.compressionError));
    }).on('finish', () => {
        if (isNot2xx) {
            const errMsg = `Response code ${res.statusCode} not 2xx`;
            reject(getErrorObject(errMsg, res,
                collectResults(results, requestOptions.returnDataMethod),
                requestOptions, apiStartTime, compression.compressionTime, compression.compressionError));
            return;
        }

        resolve({
            data: results[requestOptions.returnDataMethod](),
            headers: res.headers,
            statusCode: res.statusCode,
            requestCallTime: getDiffTime(apiStartTime),
            compressionTime: compression.compressionTime,
            compressionError: compression.compressionError,
            totalHttpSocketCount: httpAgentImpl.totalSocketCount,
            totalHttpsSocketCount: httpsAgentImpl.totalSocketCount,
            apiCallQueues: getAgentQueues()
        });
    });
}

function compressDataIfNeeded(request, postdata, requestOptions, apiStartTime, compression, logger, reject) {
    const compressStart = process.hrtime();
    const streamData = {
        data: postdata,
        chunkSize: 65536
    };
    new StringToStream(streamData)
        .pipe(createGzip())
        .pipe(request)
        .on('error', err => {
            compression.compressionError = true;
            compression.compressionTime = getDiffTime(compressStart);
            const errorObj = getErrorObject(err, {}, undefined,
                requestOptions, apiStartTime, compression.compressionTime, compression.compressionError);
            logger.error(stringifyMsg(errorObj));
            reject(errorObj);
        }).on('finish', () => {
            compression.compressionTime = getDiffTime(compressStart);
        });
}

function handleRequestBody(request, postdata, requestOptions, apiStartTime, compression, logger, reject) {
    const isMethodShouldHaveBody = METHODS_WITH_BODY.has(requestOptions.method);
    const isMethodMightHaveBody = (requestOptions.method === 'DELETE');

    if (isMethodShouldHaveBody && !postdata) {
        logger.warn(stringifyMsg({
            details: 'Method should have body, but does not.',
            host: requestOptions.hostname || requestOptions.host,
            path: requestOptions.path
        }));
    }

    if ((isMethodShouldHaveBody || isMethodMightHaveBody) && postdata) {
        if (requestOptions.compressData) {
            compressDataIfNeeded(request, postdata, requestOptions, apiStartTime, compression, logger, reject);
        } else {
            request.end(postdata);
        }
    } else {
        request.end();
    }
}

function WebRequest(secure, options = {}, postdata) {

    return new Promise((resolve, reject) => {

        const apiStartTime = process.hrtime();
        const compression = {
            compressionTime: 0,
            compressionError: false
        };

        const {
            keepalive = ENABLE_AGENT_KEEPALIVE,
            timeout
        } = options;

        const requestOptions = createRequestOptions(options, secure);

        // handle http and https requests
        const requestObj = (secure ? httpsRequest : httpRequest);
        const request = requestObj(requestOptions, res => {
            handleResponse(res, requestOptions, apiStartTime,
                compression, resolve, reject);
        });

        if (timeout && timeout > 0) {
            request.setTimeout(timeout, () => {
                request.destroy();
                reject(getErrorObject(`Timeout ${timeout} exceeded!`, {
                    statusCode: 408
                }, undefined, requestOptions, apiStartTime, compression.compressionTime, compression.compressionError));

                return;
            });
        }

        request.setSocketKeepAlive(keepalive);

        request.on('error', err => {
            request.destroy();
            reject(getErrorObject(err, {}, undefined, requestOptions,
                apiStartTime, compression.compressionTime, compression.compressionError));
        });

        handleRequestBody(request, postdata, requestOptions, apiStartTime, compression, logger, reject);
    });
}

export default WebRequest;
