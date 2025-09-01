/* eslint-disable object-curly-newline */
import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    resolve,
    basename
} from 'path';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import clientSidePage from '#server/services/orchestration/clientSidePage.mjs';
import {
    getConfigurationValue
} from '#server/services/utils/configurationCache.mjs';
import Logger from '#server/libs/Logger.mjs';
import {
    ERROR_404,
    CHANNELS
} from '#server/services/utils/Constants.mjs';


const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

export default function shopYourStorePage(request, response, pageOptions = {}) {
    const options = Object.assign({}, request.apiOptions, {
        channel: CHANNELS.RWD
    });

    const country = options.country;
    const killswitchName = 'isShopYourStoreEnabled' + country;
    const isShopYourStoreEnabled = getConfigurationValue(options, killswitchName, false);

    if (!isShopYourStoreEnabled) {
        logger.info(`Shop Your Store is not enabled for ${country}`);
        clientSidePage(request, response, 'ErrorPages/NotFound404', {}, {
            seoName: ERROR_404,
            is404Page: true,
            statusCode: 404
        });

        return;
    }

    const urlPath = request.apiOptions.apiPath;
    let templateName = '';

    if (pageOptions.isStorePage) {
        templateName = 'Happening/ShopMyStore';
    } else if (pageOptions.isZipCodePage) {
        templateName = 'Happening/ShopSameDay';
    }

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }], (err, data) => {
        if (err) {
            logger.debug(`Shop Your Store page completed with error: ${err}`);
            handleErrorResponse(response, err);

            return;
        }

        const results = Object.assign({}, {
            apiConfigurationData: data.configurationAPI.success
        }, {
            headerFooterTemplate: data.headerFooterAPI.success
        }, {
            templateInformation: {
                'template': templateName,
                'channel': options.channel
            }
        });

        ufeServiceCaller(
            urlPath,
            results,
            response,
            Object.assign({}, options, {
                cacheable: true,
                responseHeaders: data.mergedHeaders
            })
        );
    });
}
