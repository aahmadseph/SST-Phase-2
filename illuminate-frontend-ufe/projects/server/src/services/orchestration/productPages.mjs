/* eslint-disable object-curly-newline */
import {
    resolve,
    basename
} from 'path';

import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';

import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import getBIOptions from '#server/services/api/util/getBIOptions.mjs';
import getPXSDetails from '#server/services/api/catalog/products/getPXSDetails.mjs';
import {
    urlMappingUtils
} from '#server/services/utils/urlMappingUtils.mjs';

import {
    getConfigurationValue
} from '#server/services/utils/configurationCache.mjs';
import {
    mapApiResponseToApiOptions
} from '#server/services/utils/urlUtils.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    handleErrorResponse,
    PAGE_TYPE
} from '#server/services/utils/handleErrorResponse.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);
const PRODUCT_NOT_CARRIED_URL = '/search?keyword=productnotcarried';

function productLookup(productUrl, response, options) {
    const seoProductName = productUrl.replace(/\/product\//, '');

    const getProductsAPI = getPXSDetails;
    const enableATGDecom = getConfigurationValue(options, 'enableATGDecom', false);

    // Common configuration for the APIs
    const productPageApiList = [
        {
            identifier: 'configurationAPI',
            apiFunction: getConfiguration,
            options
        },
        {
            identifier: 'headerFooterAPI',
            apiFunction: getHeaderFooter,
            options
        },
        {
            identifier: 'productDetailsAPI',
            apiFunction: getProductsAPI,
            options: Object.assign({}, options, {
                productUrl: seoProductName,
                includeCacheTag: true
            })
        }
    ];

    // Conditionally include or exclude the BIOptionsAPI based on enableATGDecom - UA-2163
    if (!enableATGDecom) {
        productPageApiList.push({
            identifier: 'BIOptionsAPI',
            apiFunction: getBIOptions,
            options
        });
    }

    PromiseHandler(productPageApiList, (err, data) => {

        // TODO better handling errors like when the JSON
        // contains errorCode
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const dataConfig = data.configurationAPI.success;

            const productDetailsData = data.productDetailsAPI.success;

            if (productDetailsData.errorCode) {
                const { errorCode } = productDetailsData;

                // -4 Country restricted sku, -15 Not available sku
                if (errorCode === -4 || errorCode === -15) {
                    sendTempRedirect(response, undefined, PRODUCT_NOT_CARRIED_URL);

                    return;
                } else {
                    //otherwise 404 page
                    sendTempRedirect(response);

                    return;
                }
            }

            const results = Object.assign({}, {
                product: data.productDetailsAPI.success
            }, {
                apiConfigurationData: dataConfig
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            },
            // Conditionally include biOptions if BIOptionsAPI is present in data
            data.BIOptionsAPI ? { biOptions: data.BIOptionsAPI.success } : {},
            {
                templateInformation: {
                    'template': 'Product/ProductPage',
                    'channel': 'RWD'
                }
            });

            ufeServiceCaller(
                productUrl,
                results,
                response,
                Object.assign({}, options, {
                    cacheable: true,
                    responseHeaders: data.mergedHeaders
                }));
        } else {
            handleErrorResponse(response, err.error, PAGE_TYPE.PRODUCT);
        }
    });
}

export default async function productPages(request, response) {
    let paramsString;
    const skuId = request.query.skuId;
    const isShowProductBeforeSkuReadyEnabled = getConfigurationValue(request.apiOptions, 'isShowProductBeforeSkuReadyEnabled', false);

    if (isShowProductBeforeSkuReadyEnabled && skuId && parseInt(skuId)) {
        paramsString = `preferedSku=${parseInt(skuId)}`;
    }

    const productUrl = request.apiOptions.apiPath,
        options = Object.assign({}, request.apiOptions, {
            channel: CHANNELS.RWD,
            paramsString
        });

    // options specific to the lookup
    const lookupOptions = Object.assign({}, options, {
        pathname: productUrl
    });

    const [mappingErr, mappingResults] = await asyncWrapper(urlMappingUtils(response, lookupOptions));

    if (mappingErr) {
        sendErrorResponse(response, stringifyMsg(mappingErr), {
            sendErrorPage: true,
            statusCode: mappingErr.statusCode || 500
        });

        return;
    }

    if (mappingResults) {
        mapApiResponseToApiOptions(request, mappingResults.headers, options);
        productLookup(productUrl, response, options);
    }
}
