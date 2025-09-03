/* eslint-disable object-curly-newline */
import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';

import getBrowseExperienceCategory from '#server/services/api/catalog/categories/getBrowseExperienceCategory.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import {
    urlMappingUtils
} from '#server/services/utils/urlMappingUtils.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';

import {
    filterParams,
    mapApiResponseToApiOptions,
    redirectMappingURL
} from '#server/services/utils/urlUtils.mjs';

import {
    basename,
    resolve
} from 'path';

import Logger from '#server/libs/Logger.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

const adSvcSlot = {
    US: '2502111',
    CA: '2602111'
};

function categoryLookup(categoryUrl, params, response, options) {
    const adServiceParams = `callAdSvc=true&returnConstructorOnly=true&adSvcAwaitConstructor=true&adSvcSession=jerri&adSvcSlot=${adSvcSlot[options.country]}&adSvcInternal=true`;

    // add in necessary params for like page number ?
    const paramsString = filterParams(params);
    const locale = `${options.language}-${options.country}`;

    const getCategoryAPI = getBrowseExperienceCategory;

    // send correct parameters for browseExperience
    const browseExperienceCategoryOptions = Object.assign({}, options, {
        params: `content=true&targetSearchEngine=nlp&includeRegionsMap=true&ch=${options.channel}&loc=${locale}${paramsString ? '&' + paramsString : ''}&${adServiceParams}`
    });

    const categoryOptions = browseExperienceCategoryOptions;

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'categoriesAPI',
        apiFunction: getCategoryAPI,
        options: categoryOptions
    }], (err, data) => {

        // TODO better handling errors like when the JSON
        // contains errorCode
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            logger.debug(`All API calls resolved with success! ${categoryUrl}`);
            const dataConfig = data.configurationAPI.success;
            const categoriesPayload = data.categoriesAPI.success;

            if (categoriesPayload.errorCode) {
                sendTempRedirect(response, undefined, '/');

                return;
            }

            const channel = options.channel.toUpperCase();
            const categoriesData = {
                nthCategory: categoriesPayload
            };
            const template = 'Category/NthCategory';
            const results = Object.assign({}, categoriesData, {
                apiConfigurationData: dataConfig
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                templateInformation: {
                    'template': template,
                    'channel': channel
                }
            });
            //require('fs').writeFileSync('categories.json',
            //    require('js-beautify').js_beautify(JSON.stringify(categories)));
            ufeServiceCaller(categoryUrl,
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

export default async function categoryPages(request, response) {
    const categoryUrl = request.apiOptions.apiPath.match('/.*/$') ? request.apiOptions.apiPath.replace(/\/+$/, ''): request.apiOptions.apiPath,
        params = request.query || {},
        options = Object.assign({}, request.apiOptions, {
            channel: CHANNELS.RWD,
            apiPath: categoryUrl
        });

    const catUrl = categoryUrl.replace(/\/shop\//, '');
    const seoUrl = redirectMappingURL(options.apiPath, params.ref);

    // options specific to the lookup
    const lookupOptions = Object.assign({}, options, {
        pathname: seoUrl,
        seoName: catUrl
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
        const categoryOptions = Object.assign({}, options, {
            categoryUrl: categoryUrl,
            categoryId: `${catUrl}/seo`
        });
        mapApiResponseToApiOptions(request, mappingResults.headers, categoryOptions);
        categoryLookup(categoryUrl, params, response, categoryOptions);
    }
}
