// this is for 5xx errors
import fs from 'node:fs';
import {
    resolve,
    basename
} from 'path';

import {
    setupCounter
} from '#server/libs/prometheusMetrics.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    safelyParse
} from '#server/utils/serverUtils.mjs';
import {
    SERVER_HOME
} from '#server/config/envConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const DEFAULT_ERROR_MESSAGE = 'An error has occured processing the request!';

const httpServerErrorResponse = setupCounter('send_error_response_counts',
    'Counter for HTTP requests that result in an error');

let errorPage;
const initErrorPage = (handler) => {
    fs.readFile(`${SERVER_HOME}/src/views/500.html`, (err, results) => {
        if (err) {
            logger.error(err);
        } else {
            errorPage = results.toString();
        }

        if (handler) {
            handler(errorPage || DEFAULT_ERROR_MESSAGE);
        }
    });
};
initErrorPage();

// default is to send an error page
function sendErrorResponse(response, msg, options = {
    sendErrorPage: true
}) {
    httpServerErrorResponse.inc();
    const statusCode = options.statusCode || 500;

    // no status code passed in
    if (!options.statusCode && msg) {
        const errMsg = safelyParse(msg);
        const errorCode = (errMsg?.statusCode ? errMsg.statusCode : 500);

        // handle 404 status code
        if (+errorCode === 404) {
            sendTempRedirect(response, msg);

            return;
        }
    }

    response.writeHead(statusCode, {
        'Content-Type': (options.sendErrorPage ? 'text/html' : 'text/plain')
    });

    if (options.sendErrorPage) {
        if (!errorPage) {
            initErrorPage(page => {
                response.end(page);
            });
        } else {
            response.end(errorPage);
        }
    } else if (msg) {
        response.end(msg);
    } else {
        response.end(DEFAULT_ERROR_MESSAGE);
    }

    if (msg) {
        logger.error(msg);
    } else {
        logger.error(DEFAULT_ERROR_MESSAGE);
    }
}

export {
    sendErrorResponse
};
