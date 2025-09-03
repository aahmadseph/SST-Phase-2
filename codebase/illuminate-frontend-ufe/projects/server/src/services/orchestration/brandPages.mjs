import {
    basename,
    resolve
} from 'path';

import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';

import getBrowseExperienceBrands from '#server/services/api/catalog/brands/getBrowseExperienceBrands.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import {
    urlMappingUtils
} from '#server/services/utils/urlMappingUtils.mjs';
import {
    filterParams,
    mapApiResponseToApiOptions,
    redirectMappingURL
} from '#server/services/utils/urlUtils.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    sendPermRedirect,
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';

import Logger from '#server/libs/Logger.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

const BRANDS_LIST = '/brands-list';

function brandsLookup(brandsUrl, params, response, options) {
    const url = brandsUrl.split('/');

    if (url[url.length - 1] === 'all') {
        const redirectUrl = brandsUrl.replace('/all', '');
        logger.verbose(`Temporary redirect to ${redirectUrl}`);
        sendPermRedirect(response, undefined, redirectUrl);

        return;
    }

    // add in necessary params for like page number ?
    // TODO this does not work
    const catSEOName = options.categorySeoName;
    let paramsString = filterParams(params);

    const getBrandsAPI = getBrowseExperienceBrands;

    paramsString += paramsString !== '' ? '&targetSearchEngine=nlp' : 'targetSearchEngine=nlp';

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'brandsAPI',
        apiFunction: getBrandsAPI,
        options: Object.assign({},
            options, {
                paramsString,
                catSEOName
            })
    }], (err, data) => {
        // TODO better handling errors like when the JSON
        // contains errorCode
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const dataConfig = data.configurationAPI.success;
            const brandsPayload = data.brandsAPI.success;

            if (brandsPayload.errorCode) {
                if (brandsPayload.errorCode === -2) {
                    sendTempRedirect(response, undefined, BRANDS_LIST);

                    return;
                } else {
                    sendTempRedirect(response);

                    return;
                }
            }

            logger.debug(`All API calls resolved with success! ${brandsUrl}`);
            const channel = options.channel.toUpperCase();
            const template = 'Brands/BrandNthCategory';
            const brandsData = {
                nthBrand: brandsPayload
            };
            const results = Object.assign({}, brandsData, {
                apiConfigurationData: dataConfig
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                templateInformation: {
                    'template': template,
                    'channel': channel
                }
            });
            ufeServiceCaller(brandsUrl,
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

export default async function brandPages(request, response) {

    const brandsUrl = request.apiOptions.apiPath,
        params = request.query || {},
        options = Object.assign({}, request.apiOptions, {
            channel: CHANNELS.RWD
        });

    const brandUrl = brandsUrl.replace(/\/brand\//, '');
    const seoBrandUrl = redirectMappingURL(options.apiPath, params.ref);

    // options specific to the lookup
    const lookupOptions = Object.assign({}, options, {
        pathname: seoBrandUrl,
        seoName: brandUrl
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
        let categorySeoName = '';
        let seoBrandName = brandUrl;
        const idx = brandUrl.indexOf('/');

        if (idx > -1) {
            seoBrandName = brandUrl.substring(0, idx);
            categorySeoName = brandUrl.substring(idx + 1);
        }

        const brandOptions = Object.assign({}, options, {
            brandsUrl: brandsUrl,
            seoBrandUrl: `${seoBrandName}/seo`,
            categorySeoName
        });
        mapApiResponseToApiOptions(request, mappingResults.headers, brandOptions);
        brandsLookup(brandsUrl, params, response, brandOptions);
    }
}
