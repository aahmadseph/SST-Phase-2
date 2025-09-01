import {
    resolve,
    basename
} from 'path';

import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import clientSidePage from '#server/services/orchestration/clientSidePage.mjs';
import { ERROR_404 } from '#server/services/utils/Constants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const PRODUCT_NOT_CARRIED_URL = '/search?keyword=productnotcarried';
const HAPPENING_ERROR_URL = '/happening/error';
const HAPPENING_SERVICES_URL = '/happening/services';

const PAGE_TYPE = Object.freeze({
    PRODUCT: Symbol('product page'),
    HAPPENING: Symbol('happening page'),
    HAPPENING_SERVICES_EDP: Symbol('happening services edp'),
    OTHER: Symbol('other pages')
});

function handleErrorResponse(response, err, pageType = PAGE_TYPE.OTHER) {
    let is404ErrorResponse = false;

    if (Array.isArray(err)) {
        // so 3 of the API calls should not return 404
        is404ErrorResponse = err.find(element => element.statusCode && element.statusCode === 404);
    }

    if (is404ErrorResponse || (err.statusCode && err.statusCode === 404)) {
        if (pageType === PAGE_TYPE.PRODUCT) {
            sendTempRedirect(response, undefined, PRODUCT_NOT_CARRIED_URL);
            logger.verbose(`Temporary redirect to ${PRODUCT_NOT_CARRIED_URL} ${stringifyMsg(err.error)}`);
        } else if (pageType === PAGE_TYPE.HAPPENING_SERVICES_EDP) {
            sendTempRedirect(response, undefined, HAPPENING_SERVICES_URL);
            logger.verbose(`Temporary redirect to ${HAPPENING_SERVICES_URL} ${stringifyMsg(err.error)}`);
        } else if (pageType === PAGE_TYPE.HAPPENING) {
            sendTempRedirect(response, undefined, HAPPENING_ERROR_URL);
            logger.verbose(`Temporary redirect to ${HAPPENING_ERROR_URL} ${stringifyMsg(err.error)}`);
        } else {
            logger.info(`{ 'URL not found: ${response.req.apiOptions.apiPath}, 'details': ${stringifyMsg(err)} }`);
            clientSidePage(response.req, response, 'ErrorPages/NotFound404', {}, {
                seoName: ERROR_404,
                is404Page: true,
                statusCode: 404
            });
        }

        return;
    } else if (err.statusCode && err.statusCode === 503) {
        // service unavailable so log it
        const message = `Service unavailable ${stringifyMsg(err)}`;
        sendErrorResponse(response, message, {
            sendErrorPage: true,
            statusCode: err.statusCode
        });
        logger.verbose(message);
    } else {
        sendErrorResponse(response, stringifyMsg(err), {
            sendErrorPage: true,
            statusCode: err.statusCode || 500
        });
    }
}

export {
    handleErrorResponse,
    PAGE_TYPE
};
