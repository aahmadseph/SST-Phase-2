/* eslint-disable object-curly-newline */
import {
    gunzip,
    gzip,
    brotliCompress,
    deflate
} from 'node:zlib';
import {
    promisify
} from 'node:util';
import {
    resolve,
    basename
} from 'path';

import {
    getResponseHeaders
} from '#server/utils/responseHeaders.mjs';
import promiseWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    getMax,
    getError
} from '#server/utils/serverUtils.mjs';
import {
    DISABLE_COMPRESSION
} from '#server/config/envConfig.mjs';
import {
    FRAMEWORK_CONSTANTS as Constants
} from '#server/config/envConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const GZIP = 'gzip',
    DEFLATE = 'deflate',
    BROTLI = 'brotli',
    DEFAULT_ENCODING = 'utf8';

const gunzipPromise = promisify(gunzip),
    gzipPromise = promisify(gzip),
    brotliPromise = promisify(brotliCompress),
    deflatePromise = promisify(deflate);

let sendPromiseErrors = 0,
    maxResponsePayload = 0;

function getSendPromiseErrors() {
    return sendPromiseErrors;
}

function resetSendPromiseErrors() {
    sendPromiseErrors = 0;
}

function getMaxResponsePayload() {
    return maxResponsePayload;
}

function resetMaxResponsePayload() {
    maxResponsePayload = 0;
}

function logPromiseErrors(errorMsg) {
    let stackTrace = '';
    try {
        throw new Error('Generated stack trace');
    } catch (e) {
        stackTrace = getError(e.stack);
    }
    logger.error(`Promise rejection: ${errorMsg} with trace: ${stackTrace}`);
    sendPromiseErrors++;
}

function haveGzipped(encoding) {
    return (encoding && encoding.indexOf(GZIP) > -1);
}

function haveDeflate(encoding) {
    return (encoding && encoding.indexOf(DEFLATE) > -1);
}

function haveBrotli(encoding) {
    return (encoding && encoding.indexOf(BROTLI) > -1);
}

function sendCompressionErrorResponse(errMsg, responseHeaders, response, data, statusCode) {
    logPromiseErrors(errMsg);
    //logger.debug(`Response headers ${stringifyMsg(responseHeaders)} ${typeof data}`);
    // do we want to send a 200 response when we hit this?
    response.writeHead(statusCode || 200, responseHeaders);
    response.end(data, DEFAULT_ENCODING);
    maxResponsePayload = getMax(maxResponsePayload, data.length);

    return;
}

function sendResponse(responseHeaders, response, data, statusCode) {
    //logger.debug(`Response headers ${stringifyMsg(responseHeaders)} ${typeof data}`);
    // do we want to send a 200 response when we hit this?
    response.writeHead(statusCode || 200, responseHeaders);
    response.end(data, DEFAULT_ENCODING);
    maxResponsePayload = getMax(maxResponsePayload, data.length);

    return;
}

function handleGunzipError(err, data, responseHeaders, response, statusCode) {
    responseHeaders[Constants.CONTENT_ENCODING_HEADER] = 'gzip';
    sendCompressionErrorResponse(`Decompression of gzipped data failed: ${err}, sending data as gzip!`,
        responseHeaders, response, data, statusCode);
}

function handleCompressionError(err, data, responseHeaders, response, options = {}) {
    delete responseHeaders[Constants.CONTENT_ENCODING_HEADER];
    sendCompressionErrorResponse(`Compression of data failed: ${err}, sending data as plain text.`,
        responseHeaders, response, data, options.statusCode);
}

async function sendOKResponse(headers, url, response,
    data, cacheRequest, isGzipped, extraHeaders = {}) {

    // default content type will be text/html
    const responseHeaders = getResponseHeaders(headers, extraHeaders),
        encoding = (!DISABLE_COMPRESSION ?
            headers['accept-encoding'] || headers['Accept-Encoding'] :
            undefined);

    if (haveGzipped(encoding)) {
        if (isGzipped) {
            // already compressed and we are ok with gzip
            sendResponse(responseHeaders, response, data, extraHeaders.statusCode);
        } else {
            const [err, compressedData] = await promiseWrapper(gzipPromise(data));

            if (compressedData) {
                sendResponse(responseHeaders, response, compressedData, extraHeaders.statusCode);

                if (cacheRequest) {
                    logger.warn(`Cacheable item wont be cached for ${url}`);
                }
            } else {
                handleCompressionError(err, data, responseHeaders, response, extraHeaders);
            }
        }
    } else if (haveDeflate(encoding)) {
        let uncompressedData;

        if (isGzipped) {
            // uncomress
            const [err, uncompressed] = await promiseWrapper(gunzipPromise(data));

            if (err) {
                handleGunzipError(err, data, responseHeaders, response, extraHeaders.statusCode);
            } else {
                uncompressedData = uncompressed;
            }
        } else {
            uncompressedData = data;
        }

        // so if we are here and uncompressedData is null
        // then it means uncompression had an error
        // also the data would have been sent
        if (uncompressedData) {
            // deflate data and send
            const [err, compressedData] = await promiseWrapper(deflatePromise(uncompressedData));

            if (compressedData) {
                sendResponse(responseHeaders, response, compressedData, extraHeaders.statusCode);
            } else {
                handleCompressionError(err, data, responseHeaders, response, extraHeaders);
            }
        }
    } else if (haveBrotli(encoding)) {
        let uncompressedData;

        if (isGzipped) {
            // uncomress
            const [err, uncompressed] = await promiseWrapper(gunzipPromise(data));

            if (err) {
                handleGunzipError(err, data, responseHeaders, response, extraHeaders.statusCode);
            } else {
                uncompressedData = uncompressed;
            }
        } else {
            uncompressedData = data;
        }

        // so if we are here and uncompressedData is null
        // then it means uncompression had an error
        // also the data would have been sent
        if (uncompressedData) {
            // deflate data and send
            const [err, compressedData] = await promiseWrapper(brotliPromise(uncompressedData));

            if (compressedData) {
                sendResponse(responseHeaders, response, compressedData, extraHeaders.statusCode);
            } else {
                handleCompressionError(err, data, responseHeaders, response, extraHeaders);
            }
        }
    } else {
        // no content encoding headers
        if (isGzipped) {
            const [err, uncompressed] = await promiseWrapper(gunzipPromise(data));

            if (uncompressed) {
                sendResponse(responseHeaders, response, uncompressed, extraHeaders.statusCode);
            } else {
                handleGunzipError(err, data, responseHeaders, response, extraHeaders.statusCode);
            }
        } else {
            sendResponse(responseHeaders, response, data, extraHeaders.statusCode);
        }
    }
}

export {
    logPromiseErrors,
    sendOKResponse,
    getSendPromiseErrors,
    resetSendPromiseErrors,
    getMaxResponsePayload,
    resetMaxResponsePayload
};
