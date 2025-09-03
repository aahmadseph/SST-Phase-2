/* eslint object-curly-newline: 0 */
import {
    resolve,
    basename
} from 'path';

import {
    AGENT_AWARE_SITE_ENABLED
} from '#server/config/envConfig.mjs';
import {
    DISABLE_COMPRESSION
} from '#server/config/envConfig.mjs';
import {
    FRAMEWORK_CONSTANTS as Constants
} from '#server/config/envConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const DEFAULT_CONTENT_TYPE = 'text/html; charset=UTF-8',
    JSON_CONTENT_TYPE = 'application/json; charset=UTF-8',
    GZIP = 'gzip',
    DEFLATE = 'deflate';

let noAcceptsHeaders = 0,
    edgeCacheHeaders = 0,
    unknownContentEncoding = {};

function getHeaderMetrics() {

    const metrics = {
        noAcceptsHeaders,
        edgeCacheHeaders,
        unknownContentEncoding
    };

    noAcceptsHeaders = 0;
    edgeCacheHeaders = 0;
    unknownContentEncoding = {};

    return metrics;
}

function getHeader(headers = {}, headerName) {
    return (headers[headerName] || headers[headerName.toLowerCase()]);
}

// headers is an object that will be modified with addtional headers
// headerName should be Pascal-Case with hypen
// additionalHeaders is an object that contains
// the headers to search for headerName and add to headers
function addHeader(headers = {}, headerName, additionalHeaders = {}) {
    const headerValue = getHeader(additionalHeaders, headerName);

    if (headerValue) {
        headers[headerName] = headerValue;
    }
}

// headers can be mixed case like
// Content-Type
// and node and some systems lower case headers like
// content-type
// so by lowercasing all headers we should get all variations
function removeHeader(headers = {}, headerName) {
    Object.keys(headers).filter(hdr => {
        return hdr.toLowerCase() === headerName.toLowerCase();
    }).forEach(hdr =>{
        delete headers[hdr];
    });
}

function getHTMLContentType() {
    return DEFAULT_CONTENT_TYPE;
}

// headers is an object that will be modified with addtional headers
// additionalHeaders is an object that contains
// specific extra headers that will be added to headers
function getResponseHeaders(headers = {}, additionalHeaders = {}) {

    const accepts = getHeader(headers, 'Accept'),
        gzip = getHeader(headers, 'Accept-Encoding'),
        responseHeaders = {
            'Content-Type': DEFAULT_CONTENT_TYPE,
            'UFE-Page': 'Y'
        };

    const mergedHeaders = {
        ...headers,
        ...additionalHeaders
    };

    addHeader(responseHeaders, 'Edge-Cache-Tag', mergedHeaders);
    addHeader(responseHeaders, 'Set-Cookie', mergedHeaders);
    addHeader(responseHeaders, 'x-frame-options', mergedHeaders);
    addHeader(responseHeaders, 'content-security-policy', mergedHeaders);
    addHeader(responseHeaders, 'content-security-policy', mergedHeaders);

    // UFE timings
    // render time is part of ipc time and takes most of the ipc time
    // send data time max about 15ms
    // time to ipc max about 15ms so data read time would be under that
    addHeader(responseHeaders, 'ipc-time', mergedHeaders);
    addHeader(responseHeaders, 'queue-time', mergedHeaders);

    if (AGENT_AWARE_SITE_ENABLED) {
        addHeader(responseHeaders, 'agenttier', mergedHeaders);
    }

    if (accepts) {
        if (accepts.indexOf('html') > -1) {
            // prioritize HTML over JSON
            responseHeaders['Content-Type'] = DEFAULT_CONTENT_TYPE;
        } else if (accepts.indexOf('json') > -1) {
            // JSON
            responseHeaders['Content-Type'] = JSON_CONTENT_TYPE;
        } else {
            noAcceptsHeaders++;
            logger.verbose(`Accepts header ${accepts} not supported. Defaulting to "${DEFAULT_CONTENT_TYPE}" !`);
        }
    } else {
        logger.warn('Accepts header missing in request headers!');
    }

    if (!DISABLE_COMPRESSION && gzip) {
        if (gzip.indexOf(GZIP) > -1) {
            responseHeaders[Constants.CONTENT_ENCODING_HEADER] = GZIP;
        } else if (gzip.indexOf(DEFLATE) > -1) {
            responseHeaders[Constants.CONTENT_ENCODING_HEADER] = DEFLATE;
        } else {
            // not gzip and not delfate so what is it?
            logger.verbose(`Content-Encoding unknown ${gzip}!`);

            if (!unknownContentEncoding[gzip]) {
                unknownContentEncoding[gzip] = 0;
            }

            unknownContentEncoding[gzip]++;
        }
    }

    return responseHeaders;
}

export {
    getHeader,
    addHeader,
    getResponseHeaders,
    getHeaderMetrics,
    getHTMLContentType,
    removeHeader
};
