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
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

export default function basketPage(request, response) {

    const urlPath = request.apiOptions.apiPath,
        options = {
            ...request.apiOptions,
            channel: CHANNELS.RWD
        };

    const apiList = [{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'cmsAPI',
        apiFunction: getCMSPageData,
        options: Object.assign({}, options, {
            apiPath: '/basket/v2'
        })
    }];

    PromiseHandler(apiList, (err, data) => {
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const contentStoreData = data.mediaAPI?.success || {};
            const dataConfig = data.configurationAPI.success;

            const results = Object.assign({}, contentStoreData, {
                apiConfigurationData: dataConfig
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                templateInformation: {
                    'template': 'Basket/RwdBasketpage',
                    'channel': options.channel

                }
            }, {
                seoName: '/basket'
            }, {
                rwdBasket: {
                    cmsData: data.cmsAPI?.success?.data,
                    enableNoindexMetaTag: true
                }
            });

            ufeServiceCaller(urlPath,
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
