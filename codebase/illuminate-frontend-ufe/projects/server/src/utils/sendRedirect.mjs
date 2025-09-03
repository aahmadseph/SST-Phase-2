// this is for 3xx errors
import {
    resolve,
    basename
} from 'path';

import {
    addHeader
} from '#server/utils/responseHeaders.mjs';
import {
    ERROR_404
} from '#server/services/utils/Constants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

function copyHeaders(responseHeaders, headers) {
    addHeader(responseHeaders, 'Set-Cookie', headers);
    addHeader(responseHeaders, 'x-frame-options', headers);
    addHeader(responseHeaders, 'content-security-policy', headers);
    addHeader(responseHeaders, 'Content-Type', headers);
}

// this defaults to 404 error page
// sends 302 status code
function sendTempRedirect(response, logData, newLoc, headers = {}) {
    const responseHeaders = {
        location: newLoc || ERROR_404
    };
    copyHeaders(responseHeaders, headers);
    response.writeHead(302, responseHeaders);
    response.end();

    if (logData) {
        logger.warn(logData);
    }
}

// sends 301 status code
function sendPermRedirect(response, logData, newLoc, headers = {}) {
    const responseHeaders = {
        location: newLoc || ERROR_404,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': ' no-cache',
        'Expires': 0
    };
    copyHeaders(responseHeaders, headers);
    response.writeHead(301, responseHeaders);
    response.end();

    if (logData) {
        logger.warn(logData);
    }
}

export {
    sendPermRedirect,
    sendTempRedirect
};
