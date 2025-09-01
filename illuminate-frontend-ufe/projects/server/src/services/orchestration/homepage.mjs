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
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';
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

const HOMEPAGE_URL = '/',
    CA_EN_HOMEPAGE_URL = '/ca/en',
    CA_FR_HOMEPAGE_URL = '/ca/fr';

export default function homepage(request, response) {
    /*
        Added because of EXP-3739 - Express .use does not match exact route
        so if we use fixRWDchannelMiddleware in router.js for '/' route,
        it will apply it to every route after that
    */
    request.apiOptions.channel = CHANNELS.RWD;

    const options = request.apiOptions,
        seoUrl = (options.country === 'US' ? HOMEPAGE_URL :
            (options.language === 'fr' ? CA_FR_HOMEPAGE_URL :
                CA_EN_HOMEPAGE_URL));

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'homepageAPI',
        apiFunction: getCMSPageData,
        options
    }], (err, data) => {

        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const results = Object.assign({
                home: data.homepageAPI.success.data
            }, {
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                seoCanonicalUrl: seoUrl,
                isHomepage: true,
                templateInformation: {
                    'template': 'Homepage/Homepage',
                    'channel': options.channel
                }
            });

            ufeServiceCaller(HOMEPAGE_URL,
                results,
                response,
                Object.assign({}, options, {
                    cacheable: true,
                    responseHeaders: data.mergedHeaders
                }));
        } else {
            logger.debug(`Homepage API call failed with error: ${err}`);

            if (err.error && err.error.errorCode === 305) {
                sendTempRedirect(response, undefined, '/preview');
            } else {
                sendErrorResponse(response, stringifyMsg(err));
            }
        }
    });
}
