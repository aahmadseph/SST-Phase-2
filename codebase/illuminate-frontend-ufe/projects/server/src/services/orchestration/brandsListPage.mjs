import {
    basename,
    resolve
} from 'path';

import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';

import Logger from '#server/libs/Logger.mjs';
import getBrowseExperienceGroupedBrandsList from '#server/services/api/catalog/brands/getBrowseExperienceGroupedBrandsList.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import {
    urlMappingUtils
} from '#server/services/utils/urlMappingUtils.mjs';
import {
    mapApiResponseToApiOptions
} from '#server/services/utils/urlUtils.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

function brandsListLookup(brandsUrl, response, options) {
    const locale = `${options.language}-${options.country}`;
    const getGroupedBrandsListAPI = getBrowseExperienceGroupedBrandsList;
    const paramsString = `ch=${options.channel}&loc=${locale}`;

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'brandsListAPI',
        apiFunction: getGroupedBrandsListAPI,
        options: Object.assign({},
            options, {
                paramsString
            })
    }], (err, data) => {
        // TODO better handling errors like when the JSON
        // contains errorCode
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const dataConfig = data.configurationAPI.success;
            const brandListData = data.brandsListAPI.success;
            logger.debug(`All API calls resolved with success! ${brandsUrl}`);

            const results = Object.assign({},
                brandListData, {
                    apiConfigurationData: dataConfig
                }, {
                    headerFooterTemplate: data.headerFooterAPI.success
                }, {
                    templateInformation: {
                        'template': 'Brands/BrandsList',
                        'channel': options.channel
                    }
                }
            );
            ufeServiceCaller(brandsUrl,
                results,
                response,
                Object.assign({}, options, {
                    cacheable: true,
                    responseHeaders: data.mergedHeaders
                }));
        } else {
            handleErrorResponse(response, err.error);
        }
    });
}

export default async function brandsListPage(request, response) {

    const brandsUrl = request.apiOptions.apiPath,
        options = request.apiOptions;

    const brandUrl = brandsUrl.replace(/\/brands-list\//, '');

    // options specific to the lookup
    const lookupOptions = Object.assign({}, options, {
        pathname: brandUrl,
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
        mapApiResponseToApiOptions(request, mappingResults.headers, options);
        brandsListLookup(brandsUrl, response, options);
    }
}
