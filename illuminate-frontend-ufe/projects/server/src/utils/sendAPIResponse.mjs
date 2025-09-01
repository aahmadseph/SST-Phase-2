import {
    resolve,
    basename
} from 'path';

import {
    setupCounter
} from '#server/libs/prometheusMetrics.mjs';
import {
    stringifyMsg,
    getError
} from '#server/utils/serverUtils.mjs';
import {
    getHeader
} from '#server/utils/responseHeaders.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const httpServerErrorResponse = setupCounter('send_api_error_response_counts',
    'Counter for HTTP requests that result in an error');

const DEFAULT_ERROR_MESSAGE = 'Something went wrong!';

function sendAPIStatusResponse(response, statusCode, message, errorMessage) {
    const error = {
        statusCode,
        msg: DEFAULT_ERROR_MESSAGE
    };
    let logMessage = false;

    if (errorMessage && typeof errorMessage !== 'boolean') {
        error['msg'] = getError(errorMessage);
        logMessage = true;
    } else if (message) {
        error['msg'] = message;
        logMessage = true;
    } else if (statusCode < 200 && statusCode >= 300) {
        logMessage = true;
    }

    if (statusCode >= 500 || statusCode === 400) {
        httpServerErrorResponse.inc();
    }

    if (logMessage) {
        logger.error(stringifyMsg(error));
    }

    response.writeHead(statusCode);
    response.end(message);
}

function sendAPIJsonResponse(response, data, logMessage) {
    const requestId = getHeader(response.getHeaders(), 'request-id');

    if (logMessage) {
        const error = {
            statusCode: response.statusCode || 200,
            msg: (typeof logMessage !== 'boolean' ? getError(logMessage) : ''),
            'request-id': requestId
        };
        logger.error(stringifyMsg(error));
    }

    if (response.statusCode) {
        if (response.statusCode >= 500 || response.statusCode === 400) {
            httpServerErrorResponse.inc();
        }
        response.status(response.statusCode).json(data);
    } else {
        response.status(200).json(data);
    }
}

function sendAPI404Response(response, errorMessage) {
    sendAPIStatusResponse(response, 404, 'Content not found!', errorMessage);
}

function sendAPI401Response(response, errorMessage) {
    sendAPIStatusResponse(response, 401, 'The Access Token is Expired!', errorMessage);
}

function sendAPI500Response(response, errorMessage) {
    sendAPIStatusResponse(response, 500, DEFAULT_ERROR_MESSAGE, errorMessage);
}

function sendAPI403Response(response, errorMessage) {
    sendAPIStatusResponse(response, 403, 'The Access Token is not Valid!', errorMessage);
}

export {
    sendAPIJsonResponse,
    sendAPI401Response,
    sendAPI404Response,
    sendAPI500Response,
    sendAPIStatusResponse,
    sendAPI403Response
};
