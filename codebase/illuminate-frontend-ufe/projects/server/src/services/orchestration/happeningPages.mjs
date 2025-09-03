import {
    resolve,
    basename
} from 'path';

// Orchestration Basic Utils
import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import { ufeServiceCaller } from '#server/services/utils/ufeServiceCaller.mjs';
import {
    handleErrorResponse,
    PAGE_TYPE
} from '#server/services/utils/handleErrorResponse.mjs';
import { sendPermRedirect } from '#server/utils/sendRedirect.mjs';
import { withSdnToken } from '#server/services/api/oauth/sdn/withSdnToken.mjs';

import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import getSEOMetadata from '#server/services/api/seoService/graphql/seo.mjs';

// Services APIs
import getStoreDetailsPageData from '#server/services/api/ses/getStoreDetailsPageData.mjs';
import getServicesEDPData from '#server/services/api/ses/getServicesEDPData.mjs';

import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

// Logger
const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

// With SDN token Promises
const SDN_PROMISES = {
    'servicesEDPContentAPI': withSdnToken(getServicesEDPData),
    'storeDetailsContentAPI': withSdnToken(getStoreDetailsPageData)
};

export default function happeningPages(request, response, templateName, pageOptions = {}) {
    const {
        apiPageIdentifier,
        apiPageOptions = {},
        isChannelRwd = true,
        getSeoData,
        isPermRedirect,
        isSSRPage,
        redirectUrl,
        errorPageType = PAGE_TYPE.HAPPENING
    } = pageOptions;
    const getPageContent = isSSRPage && Object.hasOwn(SDN_PROMISES, apiPageIdentifier);
    const options = request.apiOptions;
    const urlPath = options.apiPath;

    if (isChannelRwd) {
        options.channel = CHANNELS.RWD;
    }

    if (isPermRedirect && redirectUrl) {
        sendPermRedirect(response, `Permanent Redirect to ${redirectUrl} page`, redirectUrl);
        logger.verbose(`Permanent redirect of ${urlPath} to ${redirectUrl} with status code 301`);
        return;
    }

    const apiCallList = [{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }];

    if (getSeoData) {
        apiCallList.push({
            identifier: 'seoAPI',
            apiFunction: getSEOMetadata,
            options: Object.assign({}, {
                seoURL: options.apiPath
            }, options)
        });
    }

    if (getPageContent) {
        apiCallList.push({
            identifier: apiPageIdentifier,
            apiFunction: SDN_PROMISES[apiPageIdentifier],
            options: Object.assign({}, options, apiPageOptions)
        });
    }

    PromiseHandler(apiCallList, (err, data) => {
        if (!err) {
            const contentData = getPageContent ? data[apiPageIdentifier]?.success?.data : null;

            const results = {
                apiConfigurationData: data.configurationAPI.success,
                headerFooterTemplate: data.headerFooterAPI.success,
                seo: getSeoData ? data.seoAPI?.success?.data?.seo : {},
                seoName: urlPath,
                seoCanonicalUrl: urlPath,
                enableNoindexMetaTag: false,
                templateInformation: {
                    channel: options.channel,
                    template: templateName
                },
                happening: {
                    content: contentData,
                    isInitialized: !!(getPageContent && contentData)
                }
            };

            ufeServiceCaller(urlPath,
                results,
                response,
                {
                    ...options,
                    cacheable: true,
                    responseHeaders: data?.mergedHeaders
                }
            );
        } else {
            logger.debug(`Happening Services called and completed with error: ${stringifyMsg(err)}`);
            handleErrorResponse(response, err.error, errorPageType);
        }
    });
}
