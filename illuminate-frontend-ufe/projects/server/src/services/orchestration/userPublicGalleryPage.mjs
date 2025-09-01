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

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default function userPublicGalleryPage(request, response) {
    const options = request.apiOptions;
    const userPublicGalleryUrl = request.apiOptions.apiPath;

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    },
    {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }
    ], (err, data) => {
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const results = Object.assign({
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                templateInformation: {
                    'template': 'Community/Gallery/UsersPublicGallery',
                    'channel': options.channel
                }
            });

            ufeServiceCaller(userPublicGalleryUrl,
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
