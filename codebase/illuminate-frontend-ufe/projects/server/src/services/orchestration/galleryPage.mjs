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
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default function galleryPage(request, response) {
    const options = request.apiOptions;
    const galleryUrl = request.apiOptions.apiPath;

    PromiseHandler([{
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
        identifier: 'cmsAPI',
        apiFunction: getCMSPageData,
        options: Object.assign({}, options, {
            apiPath: '/gallery/allGallery',
            channel: 'web'
        })
    }
    ], (err, data) => {
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const results = Object.assign({
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            },
            {
                gallery: { banner: data.cmsAPI?.success?.data }
            },
            {
                templateInformation: {
                    'template': 'Community/GalleryPage',
                    'channel': options.channel
                }

            });

            ufeServiceCaller(galleryUrl,
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
