import {
    resolve,
    basename
} from 'path';

import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';

import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import {
    getConfigurationValue
} from '#server/services/utils/configurationCache.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import getBuyPage from '#server/services/api/util/buyPage.mjs';
import seoBuyPage from '#server/services/api/seoService/seoBuyPage.mjs';
import newSeoBuyPage from '#server/services/api/seoService/newSeoBuyPage.mjs';
import {
    urlMappingUtils
} from '#server/services/utils/urlMappingUtils.mjs';
import {
    filterParams,
    mapApiResponseToApiOptions,
    redirectMappingURL
} from '#server/services/utils/urlUtils.mjs';
import {
    sendTempRedirect,
    sendPermRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    CHANNELS,
    ERROR_404
} from '#server/services/utils/Constants.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

function buyPageLookup(buyUrl, params, response, options) {
    const enableBuyPagesFromSeoService = getConfigurationValue(options, 'enableBuyPagesFromSeoService', true);
    const optiversal = getConfigurationValue(options, 'optiversal', {});

    const country = options.country?.toUpperCase() || 'US';
    const isNewVersionEnabled = optiversal ? optiversal[`isNewVersionEnabled${country}`] : false;

    const getBuyPageAPI = isNewVersionEnabled ? newSeoBuyPage : enableBuyPagesFromSeoService ? seoBuyPage : getBuyPage;

    const paramsString = filterParams(params);
    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'buyPageAPI',
        apiFunction: getBuyPageAPI,
        options: Object.assign({},
            options, {
                paramsString
            })
    }], (err, data) => {
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const buyPagePayload = data.buyPageAPI.success;
            const {
                redirectUrl,
                redirectType = 302
            } = buyPagePayload || {};

            if (redirectUrl && redirectUrl !== '') {
                const redirectMethod = redirectType.toString() === '301' ? sendPermRedirect : sendTempRedirect;
                redirectMethod(response, `Buy Page API call redirected call to: ${redirectUrl}`, redirectUrl);

                return;
            }

            if (buyPagePayload.errorCode) {
                logger.debug(`Buy Page API call rejected with errorCode! ${buyUrl}`);
                sendTempRedirect(response, buyPagePayload.errorMessages);

                return;
            }

            if (!buyPagePayload || Object.keys(buyPagePayload).length === 0) {
                logger.verbose(`Buy Page API call no data for slug: ${buyUrl}`);
                sendTempRedirect(response, undefined, ERROR_404);

                return;
            }

            logger.debug(`All API calls resolved with success! ${buyUrl}`);
            const channel = options.channel.toUpperCase();
            const template = 'BuyPage/RwdBuyPage';
            const newTemplate = 'BuyPage/NewRwdBuyPage';
            const { title, metaDescription, slug } = buyPagePayload;
            const results = Object.assign({},
                isNewVersionEnabled ? {
                    seoTitle: title ? `${title} | Sephora${country === 'CA' ? ' Canada' : ''}` : '',
                    seoMetaDescription: metaDescription || '',
                    seoCanonicalUrl: `/buy/${slug || ''}`
                } : {},
                {
                    buy: buyPagePayload
                }, {
                    apiConfigurationData: data.configurationAPI.success
                }, {
                    headerFooterTemplate: data.headerFooterAPI.success
                }, {
                    templateInformation: {
                        'template': isNewVersionEnabled ? newTemplate : template,
                        'channel': channel
                    }
                });
            ufeServiceCaller(buyUrl,
                results,
                response,
                Object.assign({}, options, {
                    cacheable: true,
                    responseHeaders: data.mergedHeaders,
                    paramsString: paramsString
                }));
        } else {
            handleErrorResponse(response, err.error);
        }
    });
}

export default async function buyPage(request, response) {

    const buyPageUrl = request.apiOptions.apiPath,
        params = request.query || {},
        options = Object.assign({}, request.apiOptions, {
            channel: CHANNELS.RWD
        });

    const seoBuyPageUrl = redirectMappingURL(options.apiPath, params.ref);

    // options specific to the lookup
    const lookupOptions = Object.assign({}, options, {
        pathname: seoBuyPageUrl,
        seoName: buyPageUrl
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
        const buyPageOptions = Object.assign({}, options, {
            buyPageUrl: buyPageUrl
        });
        mapApiResponseToApiOptions(request, mappingResults.headers, buyPageOptions);
        buyPageLookup(buyPageUrl, params, response, buyPageOptions);
    }
}
