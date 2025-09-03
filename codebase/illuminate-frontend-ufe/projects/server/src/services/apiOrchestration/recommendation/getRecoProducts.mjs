/* eslint-disable complexity */
import { sendAPIJsonResponse } from '#server/utils/sendAPIResponse.mjs';
import {
    safelyParse, stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    overrideLocAndCh,
    mergeProductDetailsWithRecoProducts
} from '#server/services/apiOrchestration/recommendation/utils/recommendationUtils.mjs';
import getProductDetailsWithStock from '#server/services/apiOrchestration/recommendation/getProductDetailsWithStock.mjs';
import getSubstitutes from '#server/services/api/recommendation/getSubstitutes.mjs';
import {
    safeAsyncExecutor
} from '#server/services/apiOrchestration/userFull/utils/utils.mjs';
import {
    buildJsonError, extractError
} from '#server/services/utils/apiCommonUtils.mjs';

import {
    resolve,
    basename
} from 'path';

import Logger from '#server/libs/Logger.mjs';

const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

const LAST_SUBSTITUTE_MSG = 'Something went wrong loading the last substitute. Please choose your substitute again.';
const LAST_SUBSTITUTE_ERROR_KEY = 'loadLastSubstitute';

async function getRecoProducs(request, response) {
    try {
        const requestId = request.apiOptions.headers['request-id'];
        response.setHeader('request-id', requestId);

        const productIdFromUrl = request.apiOptions.apiPath.split('/')[4];
        const options = Object.assign({}, overrideLocAndCh(request.apiOptions), { productId: productIdFromUrl });
        const { selectedProductId } = options.parseQuery;
        const substitutesResponse = await getSubstitutes(options);

        const logMsg = {
            description: 'Reco svc was called successfully from Woody',
            url: request.apiOptions.url,
            Correlationid: substitutesResponse.headers?.correlationid,
            'request-id': requestId
        };

        logger.info(stringifyMsg(logMsg));

        const substitutes = safelyParse(substitutesResponse.data);

        if (!substitutes) {
            const noDataLogMsg = {
                description: 'Reco svc was called successfully from Woody, but there is no data in the response',
                url: request.apiOptions.url,
                Correlationid: substitutesResponse.headers?.correlationid,
                'request-id': requestId
            };

            logger.error(stringifyMsg(noDataLogMsg));
        }

        // Send back original backend errors
        if (substitutes?.errorCode) {
            throw substitutesResponse;
        }

        const substitutesData = substitutes;

        if (selectedProductId) {
            const details = await safeAsyncExecutor(getProductDetailsWithStock, request, selectedProductId);
            const detailsParsed = safelyParse(details) || {};
            const parsedErrorResponse = safelyParse(details?.reason?.data);
            const isProductDetailsWithStockRejected = safelyParse(detailsParsed?.reason) || null;

            if (isProductDetailsWithStockRejected) {
                if (parsedErrorResponse?.errorCode) {
                    substitutesData.errorMessage = {
                        ...parsedErrorResponse,
                        errorKey: LAST_SUBSTITUTE_ERROR_KEY
                    };
                } else {
                    const jsonError = buildJsonError(details?.reason?.statusCode, LAST_SUBSTITUTE_MSG, LAST_SUBSTITUTE_ERROR_KEY);
                    substitutesData.errorMessage = jsonError;
                }
            } else {
                const recoProductsWithStock = mergeProductDetailsWithRecoProducts(details, substitutes.recoProducts, selectedProductId);
                substitutesData.recoProducts = recoProductsWithStock;
            }
        }

        const frontendResponse = {
            ...substitutesData
        };

        return sendAPIJsonResponse(response, frontendResponse);
    } catch (error) {
        const {
            errorCode, errorMessage, longErrorMessage
        } = extractError(error);

        const logMsg = {
            description: 'Failed request to Reco svc from Woody',
            statusCode: error?.statusCode,
            hostname: error?.hostname,
            url: error?.url,
            data: error?.data,
            Correlationid: error?.headers?.correlationid,
            'request-id': error['request-id']
        };

        logger.error(stringifyMsg(logMsg));

        const errorResponse = buildJsonError(errorCode, errorMessage);

        return sendAPIJsonResponse(response, errorResponse, longErrorMessage || errorMessage);
    }
}

export default getRecoProducs;
