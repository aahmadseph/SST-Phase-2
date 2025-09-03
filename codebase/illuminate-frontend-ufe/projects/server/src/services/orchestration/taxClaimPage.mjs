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
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';
import Logger from '#server/libs/Logger.mjs';

const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

export default function taxClaimPage(request, response) {
    const urlPath = request.path;
    const options = request.apiOptions;
    const templateName = 'Community/RichProfile/MyAccount/TaxClaim';

    PromiseHandler([{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }, {
        identifier: 'getCMSPageData',
        apiFunction: getCMSPageData,
        options: Object.assign({}, options, {
            apiPath: '/taxClaim'
        })
    }], (err, data) => {
        if (err) {
            logger.debug(`Taxclaim page completed with error: ${err}`);
            handleErrorResponse(response, err);

            return;
        }

        if (!data.getCMSPageData.success?.data) {
            const logData = 'No tax exempt CMS data, redirecting from tax page';
            sendTempRedirect(response, logData);

            return;
        }

        const results = Object.assign({}, {
            taxClaim: data.getCMSPageData.success.data
        }, {
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
